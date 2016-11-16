import React from 'react';

import Dispatcher from './dispatcher';
import Helpers from './helpers';

import styles from './sheet.css';

var CellComponent = React.createClass({

    /**
     * React "getInitialState" method, setting whether or not
     * the cell is being edited and its changing value
     */
    getInitialState: function() {
        return {
            editing: this.props.editing,
            changedValue: this.props.value
        };
    },

    /**
     * React "render" method, rendering the individual cell
     */
    render: function() {
        var props = this.props,
            selected = (props.selected) ? styles.selected : '',
            config = props.config || { emptyValueSymbol: ''},
            displayValue = (props.value === '' || !props.value) ? config.emptyValueSymbol : props.value,
            cellClasses = (props.cellClasses && props.cellClasses.length > 0) ? props.cellClasses + ' ' + selected : selected,
            cellContent;

        // Check if header - if yes, render it
        var header = this.renderHeader();
        if (header) {
            return header;
        }

        // If not a header, check for editing and return
        if (props.selected && props.editing) {
            cellContent = (
                <input className="mousetrap"
                       onChange={this.handleChange}
                       onBlur={this.handleBlur}
                       onKeyDown={e => this.handleKeyDown(e)}
                       ref={(input) => this.editInput = input}
                       defaultValue={this.props.value} />
            )
        }

        return (
            <td className={styles.td + ' ' + cellClasses}>
                <div className="reactTableCell">
                    {cellContent}
                    <span onDoubleClick={this.handleDoubleClick} onClick={this.handleClick}>
                        {displayValue}
                    </span>
                </div>
            </td>
        );
    },

    /**
     * React "componentDidUpdate" method, ensuring correct input focus
     * @param  {React previous properties} prevProps
     * @param  {React previous state} prevState
     */
    componentDidUpdate: function(prevProps, prevState) {
        if (this.editInput && this.props.editing && this.props.selected) {
            this.editInput.focus();
            if (!prevProps.editing) {
                this.editInput.select();
            }
        }

        if (prevProps.selected && prevProps.editing && this.state.changedValue !== this.props.value) {
            this.props.onCellValueChange(this.props.uid, this.state.changedValue);
        }
    },

    /**
     * Click handler for individual cell, ensuring navigation and selection
     * @param  {event} e
     */
    handleClick: function (e) {
        this.props.handleSelectCell(this.props.uid);
    },

    /**
     * Click handler for individual cell if the cell is a header cell
     * @param  {event} e
     */
    handleHeadClick: function (e) {
        Dispatcher.publish('headCellClicked', this.props.uid);
    },

    /**
     * Double click handler for individual cell, ensuring navigation and selection
     * @param  {event} e
     */
    handleDoubleClick: function (e) {
        e.preventDefault();
        this.props.handleDoubleClickOnCell(this.props.uid);
    },

    /**
     * Blur handler for individual cell
     * @param  {event} e
     */
    handleBlur: function (e) {
        var newValue = e.target.value;

        this.props.onCellValueChange(this.props.uid, newValue, e);
        this.props.handleCellBlur(this.props.uid);
        Dispatcher.publish('cellBlurred', this.props.uid);
    },

    /**
     * Change handler for an individual cell, propagating the value change
     * @param  {event} e
     */
    handleChange: function (e) {
        var newValue = e.target.value;
        this.setState({changedValue: newValue});
    },

    handleKeyDown: function(e) {
        console.log('keydown', e.which, e.keyCode);
        if ([32, 37, 38, 39, 40].includes(e.which)) {
            e.stopPropagation();
        }
    },

    /**
     * Checks if a header exists - if it does, it returns a header object
     * @return {false|react} [Either false if it's not a header cell, a react object if it is]
     */
    renderHeader: function () {
        var props = this.props,
            selected = (props.selected) ? 'selected' : '',
            uid = props.uid,
            config = props.config || { emptyValueSymbol: ''},
            displayValue = (props.value === '' || !props.value) ? config.emptyValueSymbol : props.value,
            cellClasses = (props.cellClasses && props.cellClasses.length > 0) ? this.props.cellClasses + ' ' + selected : selected;

        // Cases
        var headRow = (uid[0] === 0),
            headColumn = (uid[1] === 0),
            headRowAndEnabled = (config.hasHeadRow && uid[0] === 0),
            headColumnAndEnabled = (config.hasHeadColumn && uid[1] === 0)

        // Head Row enabled, cell is in head row
        // Head Column enabled, cell is in head column
        if (headRowAndEnabled || headColumnAndEnabled) {
            if (headColumn && config.hasLetterNumberHeads) {
                displayValue = uid[0];
            } else if (headRow && config.hasLetterNumberHeads) {
                displayValue = Helpers.countWithLetters(uid[1]);
            }

            if ((config.isHeadRowString && headRow) || (config.isHeadColumnString && headColumn)) {
                return (
                    <th className={styles.th + ' ' + styles.td + cellClasses}>
                        <div>
                            <span onClick={this.handleHeadClick}>
                                {displayValue}
                            </span>
                        </div>
                    </th>
                );
            } else {
                return (
                    <th>
                        {displayValue}
                    </th>
                );
            }
        } else {
            return false;
        }
    }
});

module.exports = CellComponent;
