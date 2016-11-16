import React from 'react';
import ReactDOM from 'react-dom';

import RowComponent from './row';
import Dispatcher from './dispatcher';
import Helpers from './helpers';

import styles from './sheet.css';

var Sheet = React.createClass({

    /**
     * React 'getInitialState' method
     */
    getInitialState: function() {
        var initialData = this.props.initialData || {};

        if (!initialData.rows) {
            initialData.rows = [];

            for (var i = 0; i < this.props.config.rows; i = i + 1) {
                initialData.rows[i] = [];
                for (var ci = 0; ci < this.props.config.columns; ci = ci + 1) {
                    initialData.rows[i][ci] = '';
                }
            }
        }

        return {
            data: initialData,
            selected: null,
            lastBlurred: null,
            editing: false
        };
    },

    /**
     * React Render method
     * @return {[JSX]} [JSX to render]
     */
    render: function() {
        var data = this.state.data,
            config = this.props.config,
            _cellClasses = this.props.cellClasses,
            rows = [], key, i, cellClasses;

        // Sanity checks
        if (!data.rows && !config.rows) {
            return console.error('Table Component: Number of colums not defined in both data and config!');
        }

        // Create Rows
        for (i = 0; i < data.rows.length; i = i + 1) {
            key = 'row_' + i;
            cellClasses = (_cellClasses && _cellClasses.rows && _cellClasses.rows[i]) ? _cellClasses.rows[i] : null;

            rows.push(<RowComponent cells={data.rows[i]}
                                    cellClasses={cellClasses}
                                    uid={i}
                                    key={key}
                                    config={config}
                                    selected={this.state.selected}
                                    editing={this.state.editing}
                                    handleSelectCell={this.handleSelectCell}
                                    handleDoubleClickOnCell={this.handleDoubleClickOnCell}
                                    handleCellBlur={this.handleCellBlur}
                                    onCellValueChange={this.handleCellValueChange}
                                    className="cellComponent" />);
        }

        return (
            <table className={styles.sheet} tabIndex="0"
                ref={(table) => this.table = table}
                onKeyDown={e => this._handleKeyDown(e)}
                onKeyUp={e => this._handleKeyUp(e)}
                onKeyPress={e => this._handleKeyPress(e)}>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    },

    _handleKeyDown: function(e) {
        console.log('keydown', e.keyCode, e.target.tagName);
        if (!this.state.editing && [32, 37, 38, 39, 40].includes(e.keyCode)) {
            // Avoid scroll when navigating by arrow keys, space
            e.preventDefault();
        } else if (9 === e.keyCode) {
            // prevent tabbing out of component
            e.preventDefault();
        } else if (!this.state.editing && [46, 8].includes(e.keyCode)) {
            // eat delete and backspace
            e.preventDefault();
        }
    },

    _handleKeyUp: function(e) {
        console.log('keyup', e.keyCode, e.target.tagName);
        if ([9, 37, 38, 39, 40].includes(e.keyCode)) {
            // arrow and tab navigation
            e.preventDefault();
            this.navigateTable(e.keyCode);
        } else if (!this.state.editing && [46, 8].includes(e.keyCode)) {
            // delete on backspace or delete
            if (this.state.selected && !Helpers.equalCells(this.state.selected, this.state.lastBlurred)) {
                this.handleCellValueChange(this.state.selected, '');
            }
        }
    },

    _handleKeyPress: function(e) {
        console.log('keypress', e.key,
            !(e.altKey || e.ctrlKey || e.metaKey),
            /^[^\p{C}\p{Z}]*$/.test(e.key));
        if (this.state.selected) {
            if (this.state.editing) {
                if (/^(Enter|Return)$/.test(e.key)) {
                    // Enter/return to end edit
                    this.setState({editing: false});
                    // TODO: Do we really need this?
                    this.table.focus();
                }
            } else {
                // Go into edit mode when the user starts typing on a field
                // is it a printable character?
                // nasty regex from http://www.regular-expressions.info/unicode.html
                if (/^[^\p{C}\p{Z}]*$/.test(e.key)) {
                    Dispatcher.publish('editStarted', this.state.selected);
                    this.setState({editing: true});
                }
            }
        }
    },

    /**
     * Navigates the table and moves selection
     * @param  {string} direction                               [Direction ('up' || 'down' || 'left' || 'right')]
     * @param  {Array: [number: row, number: cell]} originCell  [Origin Cell]
     */
    navigateTable: function (direction) {
        if (!this.state.editing) {
            var config = this.props.config;
            var destinationCell = [this.state.selected[0], this.state.selected[1]];
            var rows = this.state.data.rows;

            var maxRowIdx = config.canAddRow ? rows.length : rows.length - 1;
            var maxColIdx = config.canAddColumn ? rows[0].length : rows[0].length - 1;

            switch (direction) {
                case "up":
                case 38:
                    destinationCell[0] = Math.max(1, destinationCell[0] - 1);
                    break;
                case "down":
                case 40:
                    destinationCell[0] = Math.min(maxRowIdx, destinationCell[0] + 1);
                    break;
                case "left":
                case 37:
                    destinationCell[1] = Math.max(1, destinationCell[1] - 1);
                    break;
                case "right":
                case 39:
                    destinationCell[1] = Math.min(maxColIdx, destinationCell[1] + 1);
                    break;
                case 9:
                    if (destinationCell[1] === rows[0].length - 1) {
                        if (destinationCell[0] === rows.length - 1 && config.canAddRow) {
                            destinationCell[0] = rows.length;
                            destinationCell[1] = 1;
                        }
                    } else {
                        destinationCell[1] += 1;
                    }
                    break;
            }

            if (rows.length === destinationCell[0] || rows[0].length === destinationCell[1]) {
                this.extendTable(direction);
            }

            this.handleSelectCell(destinationCell);
        }
    },

    /**
     * Extends the table with an additional row/column, if permitted by config.
     * TODO: turn this into an event/callback instead of handling it internally.
     * @param  {string} direction [Direction ('up' || 'down' || 'left' || 'right')]
     */
    extendTable: function (direction) {
        var config = this.props.config,
            data = this.state.data,
            newRow, i;

        if ((direction === 'down' || direction === 40 || direction === 9) && config.canAddRow) {
            newRow = [];

            for (i = 0; i < this.state.data.rows[0].length; i = i + 1) {
                newRow[i] = '';
            }

            data.rows.push(newRow);
            Dispatcher.publish('rowCreated', data.rows.length);
            return this.setState({data: data});
        }

        if ((direction === 'right' || direction === 39 || direction || 9) && config.canAddColumn) {
            for (i = 0; i < data.rows.length; i = i + 1) {
                data.rows[i].push('');
            }

            Dispatcher.publish('columnCreated', data.rows[0].length);
            return this.setState({data: data});
        }

    },

    /**
     * Callback for 'selectCell', updating the selected Cell
     * @param  {Array: [number: row, number: cell]} cell [Selected Cell]
     * @param  {object} cellElement [Selected Cell Element]
     */
    handleSelectCell: function (cell) {
        Dispatcher.publish('cellSelected', cell);

        // TODO: Is this really necessary? This focuses the table element
        this.table.focus();

        this.setState({
            selected: cell,
        });
    },

    /**
     * Callback for 'cellValueChange', updating the cell data
     * @param  {Array: [number: row, number: cell]} cell [Selected Cell]
     * @param  {object} newValue                         [Value to set]
     */
    handleCellValueChange: function (cell, newValue) {
        var data = this.state.data,
            row = cell[0],
            column = cell[1],
            oldValue = data.rows[row][column];

        Dispatcher.publish('cellValueChanged', [cell, newValue, oldValue]);

        data.rows[row][column] = newValue;
        this.setState({
            data: data
        });

        Dispatcher.publish('dataChanged', data);
    },

    /**
     * Callback for 'doubleClickonCell', enabling 'edit' mode
     */
    handleDoubleClickOnCell: function () {
        this.setState({
            editing: true
        });
    },

    /**
     * Callback for 'cellBlur'
     */
    handleCellBlur: function (cell) {
        if (this.state.editing) {
            Dispatcher.publish('editStopped', cell);
        }

        this.setState({
            editing: false,
            lastBlurred: cell
        });
    }
});

module.exports = Sheet;
