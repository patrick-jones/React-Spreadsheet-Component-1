(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom"], factory);
	else if(typeof exports === 'object')
		exports["ReactSheets"] = factory(require("react"), require("react-dom"));
	else
		root["ReactSheets"] = factory(root["React"], root["ReactDOM"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _sheet = __webpack_require__(7);

	var _sheet2 = _interopRequireDefault(_sheet);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _sheet2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	var Helpers = {
	    /**
	     * Find the first element in an array matching a boolean
	     * @param  {[array]} arr     [Array to test]
	     * @param  {[function]} test [Test Function]
	     * @param  {[type]} context  [Context]
	     * @return {[object]}        [Found element]
	     */
	    firstInArray: function firstInArray(arr, test, context) {
	        var result = null;

	        arr.some(function (el, i) {
	            return test.call(context, el, i, arr) ? (result = el, true) : false;
	        });

	        return result;
	    },

	    /**
	     * Find the first TD in a path array
	     * @param  {[array]} arr  [Path array containing elements]
	     * @return {[object]}     [Found element]
	     */
	    firstTDinArray: function firstTDinArray(arr) {
	        var cell = Helpers.firstInArray(arr, function (element) {
	            if (element.nodeName && element.nodeName === 'TD') {
	                return true;
	            } else {
	                return false;
	            }
	        });

	        return cell;
	    },

	    /**
	     * Check if two cell objects reference the same cell
	     * @param  {[array]} cell1 [First cell]
	     * @param  {[array]} cell2 [Second cell]
	     * @return {[boolean]}    [Boolean indicating if the cells are equal]
	     */
	    equalCells: function equalCells(cell1, cell2) {
	        if (!cell1 || !cell2 || cell1.length !== cell2.length) {
	            return false;
	        }

	        if (cell1[0] === cell2[0] && cell1[1] === cell2[1]) {
	            return true;
	        } else {
	            return false;
	        }
	    },

	    /**
	     * Counts in letters (A, B, C...Z, AA);
	     * @return {[string]} [Letter]
	     */
	    countWithLetters: function countWithLetters(num) {
	        var mod = num % 26,
	            pow = num / 26 | 0,
	            out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
	        return pow ? this.countWithLetters(pow) + out : out;
	    }
	};

	module.exports = Helpers;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	var spreadsheetId = 'KILL ME';

	// TODO: Get rid of this entirely

	var dispatcher = {
	    // Event Pub/Sub System
	    //
	    // Topics used:
	    // [headCellClicked] - A head cell was clicked
	    //      @return {array} [row, column]
	    // [cellSelected] - A cell was selected
	    //      @return {array} [row, column]
	    // [cellBlur] - A cell was blurred
	    //      @return {array} [row, column]
	    // [cellValueChanged] - A cell value changed.
	    //      @return {cell, newValue} Origin cell, new value entered
	    // [dataChanged] - Data changed
	    //      @return {data} New data
	    // [editStarted] - The user started editing
	    //      @return {cell} Origin cell
	    // [editStopped] - The user stopped editing
	    //      @return {cell} Origin cell
	    // [rowCreated] - The user created a row
	    //      @return {number} Row index
	    // [columnCreated] - The user created a column
	    //      @return {number} Column index
	    topics: {},

	    /**
	     * Subscribe to an event
	     * @param  {string} topic         [The topic subscribing to]
	     * @param  {function} listener    [The callback for published events]
	     * @param  {string} spreadsheetId [The reactId (data-spreadsheetId) of the origin element]
	     */
	    subscribe: function subscribe(topic, listener) {
	        if (!this.topics[spreadsheetId]) {
	            this.topics[spreadsheetId] = [];
	        }

	        if (!this.topics[spreadsheetId][topic]) {
	            this.topics[spreadsheetId][topic] = [];
	        }

	        this.topics[spreadsheetId][topic].push(listener);
	    },

	    /**
	     * Publish to an event channel
	     * @param  {string} topic         [The topic publishing to]
	     * @param  {object} data          [An object passed to the subscribed callbacks]
	     * @param  {string} spreadsheetId [The reactId (data-spreadsheetId) of the origin element]
	     */
	    publish: function publish(topic, data) {
	        // return if the topic doesn't exist, or there are no listeners
	        if (!this.topics[spreadsheetId] || !this.topics[spreadsheetId][topic] || this.topics[spreadsheetId][topic].length < 1) {
	            return;
	        }

	        this.topics[spreadsheetId][topic].forEach(function (listener) {
	            listener(data || {});
	        });
	    }
	};

	module.exports = dispatcher;

/***/ },
/* 4 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"sheet":"sheet__sheet___wUrHo","td":"sheet__td___3dyyT","selected":"sheet__selected___2VDVk","th":"sheet__th___19IEk"};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _dispatcher = __webpack_require__(3);

	var _dispatcher2 = _interopRequireDefault(_dispatcher);

	var _helpers = __webpack_require__(1);

	var _helpers2 = _interopRequireDefault(_helpers);

	var _sheet = __webpack_require__(4);

	var _sheet2 = _interopRequireDefault(_sheet);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var CellComponent = _react2.default.createClass({
	    displayName: 'CellComponent',


	    /**
	     * React "getInitialState" method, setting whether or not
	     * the cell is being edited and its changing value
	     */
	    getInitialState: function getInitialState() {
	        return {
	            editing: this.props.editing,
	            changedValue: this.props.value
	        };
	    },

	    /**
	     * React "render" method, rendering the individual cell
	     */
	    render: function render() {
	        var _this = this;

	        var props = this.props,
	            selected = props.selected ? _sheet2.default.selected : '',
	            config = props.config || { emptyValueSymbol: '' },
	            displayValue = props.value === '' || !props.value ? config.emptyValueSymbol : props.value,
	            cellClasses = props.cellClasses && props.cellClasses.length > 0 ? props.cellClasses + ' ' + selected : selected,
	            cellContent;

	        // Check if header - if yes, render it
	        var header = this.renderHeader();
	        if (header) {
	            return header;
	        }

	        // If not a header, check for editing and return
	        if (props.selected && props.editing) {
	            cellContent = _react2.default.createElement('input', { className: 'mousetrap',
	                onChange: this.handleChange,
	                onBlur: this.handleBlur,
	                onKeyDown: function onKeyDown(e) {
	                    return _this.handleKeyDown(e);
	                },
	                ref: function ref(input) {
	                    return _this.editInput = input;
	                },
	                defaultValue: this.props.value });
	        }

	        return _react2.default.createElement(
	            'td',
	            { className: _sheet2.default.td + ' ' + cellClasses },
	            _react2.default.createElement(
	                'div',
	                { className: 'reactTableCell' },
	                cellContent,
	                _react2.default.createElement(
	                    'span',
	                    { onDoubleClick: this.handleDoubleClick, onClick: this.handleClick },
	                    displayValue
	                )
	            )
	        );
	    },

	    /**
	     * React "componentDidUpdate" method, ensuring correct input focus
	     * @param  {React previous properties} prevProps
	     * @param  {React previous state} prevState
	     */
	    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
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
	    handleClick: function handleClick(e) {
	        this.props.handleSelectCell(this.props.uid);
	    },

	    /**
	     * Click handler for individual cell if the cell is a header cell
	     * @param  {event} e
	     */
	    handleHeadClick: function handleHeadClick(e) {
	        _dispatcher2.default.publish('headCellClicked', this.props.uid);
	    },

	    /**
	     * Double click handler for individual cell, ensuring navigation and selection
	     * @param  {event} e
	     */
	    handleDoubleClick: function handleDoubleClick(e) {
	        e.preventDefault();
	        this.props.handleDoubleClickOnCell(this.props.uid);
	    },

	    /**
	     * Blur handler for individual cell
	     * @param  {event} e
	     */
	    handleBlur: function handleBlur(e) {
	        var newValue = e.target.value;

	        this.props.onCellValueChange(this.props.uid, newValue, e);
	        this.props.handleCellBlur(this.props.uid);
	        _dispatcher2.default.publish('cellBlurred', this.props.uid);
	    },

	    /**
	     * Change handler for an individual cell, propagating the value change
	     * @param  {event} e
	     */
	    handleChange: function handleChange(e) {
	        var newValue = e.target.value;
	        this.setState({ changedValue: newValue });
	    },

	    handleKeyDown: function handleKeyDown(e) {
	        console.log('keydown', e.which, e.keyCode);
	        if ([32, 37, 38, 39, 40].includes(e.which)) {
	            e.stopPropagation();
	        }
	    },

	    /**
	     * Checks if a header exists - if it does, it returns a header object
	     * @return {false|react} [Either false if it's not a header cell, a react object if it is]
	     */
	    renderHeader: function renderHeader() {
	        var props = this.props,
	            selected = props.selected ? 'selected' : '',
	            uid = props.uid,
	            config = props.config || { emptyValueSymbol: '' },
	            displayValue = props.value === '' || !props.value ? config.emptyValueSymbol : props.value,
	            cellClasses = props.cellClasses && props.cellClasses.length > 0 ? this.props.cellClasses + ' ' + selected : selected;

	        // Cases
	        var headRow = uid[0] === 0,
	            headColumn = uid[1] === 0,
	            headRowAndEnabled = config.hasHeadRow && uid[0] === 0,
	            headColumnAndEnabled = config.hasHeadColumn && uid[1] === 0;

	        // Head Row enabled, cell is in head row
	        // Head Column enabled, cell is in head column
	        if (headRowAndEnabled || headColumnAndEnabled) {
	            if (headColumn && config.hasLetterNumberHeads) {
	                displayValue = uid[0];
	            } else if (headRow && config.hasLetterNumberHeads) {
	                displayValue = _helpers2.default.countWithLetters(uid[1]);
	            }

	            if (config.isHeadRowString && headRow || config.isHeadColumnString && headColumn) {
	                return _react2.default.createElement(
	                    'th',
	                    { className: _sheet2.default.th + ' ' + _sheet2.default.td + cellClasses },
	                    _react2.default.createElement(
	                        'div',
	                        null,
	                        _react2.default.createElement(
	                            'span',
	                            { onClick: this.handleHeadClick },
	                            displayValue
	                        )
	                    )
	                );
	            } else {
	                return _react2.default.createElement(
	                    'th',
	                    null,
	                    displayValue
	                );
	            }
	        } else {
	            return false;
	        }
	    }
	});

	module.exports = CellComponent;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _cell = __webpack_require__(5);

	var _cell2 = _interopRequireDefault(_cell);

	var _helpers = __webpack_require__(1);

	var _helpers2 = _interopRequireDefault(_helpers);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var RowComponent = function RowComponent(props) {
	    var config = props.config,
	        cells = props.cells,
	        cellClasses = props.cellClasses,
	        selected = props.selected,
	        editing = props.editing,
	        uid = props.uid;


	    if (!config.columns || cells.length === 0) {
	        return console.error('Table can\'t be initialized without set number of columns and no data!');
	    }

	    var columns = cells.map(function (cell, i) {
	        var cellID = [uid, i];
	        var isSelected = _helpers2.default.equalCells(selected, cellID);
	        var classNames = cellClasses && cellClasses[i] ? undefined.props.cellClasses[i] : '';
	        return _react2.default.createElement(_cell2.default, { key: 'row_' + uid + '_cell_' + i,
	            uid: cellID,
	            value: cells[i],
	            config: config,
	            cellClasses: classNames,
	            onCellValueChange: props.onCellValueChange,
	            handleSelectCell: props.handleSelectCell,
	            handleDoubleClickOnCell: props.handleDoubleClickOnCell,
	            handleCellBlur: props.handleCellBlur,
	            selected: isSelected,
	            editing: editing });
	    });

	    return _react2.default.createElement(
	        'tr',
	        null,
	        columns
	    );
	};

	exports.default = RowComponent;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(8);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _row = __webpack_require__(6);

	var _row2 = _interopRequireDefault(_row);

	var _dispatcher = __webpack_require__(3);

	var _dispatcher2 = _interopRequireDefault(_dispatcher);

	var _helpers = __webpack_require__(1);

	var _helpers2 = _interopRequireDefault(_helpers);

	var _sheet = __webpack_require__(4);

	var _sheet2 = _interopRequireDefault(_sheet);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Sheet = _react2.default.createClass({
	    displayName: 'Sheet',


	    /**
	     * React 'getInitialState' method
	     */
	    getInitialState: function getInitialState() {
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
	    render: function render() {
	        var _this = this;

	        var data = this.state.data,
	            config = this.props.config,
	            _cellClasses = this.props.cellClasses,
	            rows = [],
	            key,
	            i,
	            cellClasses;

	        // Sanity checks
	        if (!data.rows && !config.rows) {
	            return console.error('Table Component: Number of colums not defined in both data and config!');
	        }

	        // Create Rows
	        for (i = 0; i < data.rows.length; i = i + 1) {
	            key = 'row_' + i;
	            cellClasses = _cellClasses && _cellClasses.rows && _cellClasses.rows[i] ? _cellClasses.rows[i] : null;

	            rows.push(_react2.default.createElement(_row2.default, { cells: data.rows[i],
	                cellClasses: cellClasses,
	                uid: i,
	                key: key,
	                config: config,
	                selected: this.state.selected,
	                editing: this.state.editing,
	                handleSelectCell: this.handleSelectCell,
	                handleDoubleClickOnCell: this.handleDoubleClickOnCell,
	                handleCellBlur: this.handleCellBlur,
	                onCellValueChange: this.handleCellValueChange,
	                className: 'cellComponent' }));
	        }

	        return _react2.default.createElement(
	            'table',
	            { className: _sheet2.default.sheet, tabIndex: '0',
	                ref: function ref(table) {
	                    return _this.table = table;
	                },
	                onKeyDown: function onKeyDown(e) {
	                    return _this._handleKeyDown(e);
	                },
	                onKeyUp: function onKeyUp(e) {
	                    return _this._handleKeyUp(e);
	                },
	                onKeyPress: function onKeyPress(e) {
	                    return _this._handleKeyPress(e);
	                } },
	            _react2.default.createElement(
	                'tbody',
	                null,
	                rows
	            )
	        );
	    },

	    _handleKeyDown: function _handleKeyDown(e) {
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

	    _handleKeyUp: function _handleKeyUp(e) {
	        console.log('keyup', e.keyCode, e.target.tagName);
	        if ([9, 37, 38, 39, 40].includes(e.keyCode)) {
	            // arrow and tab navigation
	            e.preventDefault();
	            this.navigateTable(e.keyCode);
	        } else if (!this.state.editing && [46, 8].includes(e.keyCode)) {
	            // delete on backspace or delete
	            if (this.state.selected && !_helpers2.default.equalCells(this.state.selected, this.state.lastBlurred)) {
	                this.handleCellValueChange(this.state.selected, '');
	            }
	        }
	    },

	    _handleKeyPress: function _handleKeyPress(e) {
	        console.log('keypress', e.key, !(e.altKey || e.ctrlKey || e.metaKey), /^[^\p{C}\p{Z}]*$/.test(e.key));
	        if (this.state.selected) {
	            if (this.state.editing) {
	                if (/^(Enter|Return)$/.test(e.key)) {
	                    // Enter/return to end edit
	                    this.setState({ editing: false });
	                    // TODO: Do we really need this?
	                    this.table.focus();
	                }
	            } else {
	                // Go into edit mode when the user starts typing on a field
	                // is it a printable character?
	                // nasty regex from http://www.regular-expressions.info/unicode.html
	                if (/^[^\p{C}\p{Z}]*$/.test(e.key)) {
	                    _dispatcher2.default.publish('editStarted', this.state.selected);
	                    this.setState({ editing: true });
	                }
	            }
	        }
	    },

	    /**
	     * Navigates the table and moves selection
	     * @param  {string} direction                               [Direction ('up' || 'down' || 'left' || 'right')]
	     * @param  {Array: [number: row, number: cell]} originCell  [Origin Cell]
	     */
	    navigateTable: function navigateTable(direction) {
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
	    extendTable: function extendTable(direction) {
	        var config = this.props.config,
	            data = this.state.data,
	            newRow,
	            i;

	        if ((direction === 'down' || direction === 40 || direction === 9) && config.canAddRow) {
	            newRow = [];

	            for (i = 0; i < this.state.data.rows[0].length; i = i + 1) {
	                newRow[i] = '';
	            }

	            data.rows.push(newRow);
	            _dispatcher2.default.publish('rowCreated', data.rows.length);
	            return this.setState({ data: data });
	        }

	        if ((direction === 'right' || direction === 39 || direction || 9) && config.canAddColumn) {
	            for (i = 0; i < data.rows.length; i = i + 1) {
	                data.rows[i].push('');
	            }

	            _dispatcher2.default.publish('columnCreated', data.rows[0].length);
	            return this.setState({ data: data });
	        }
	    },

	    /**
	     * Callback for 'selectCell', updating the selected Cell
	     * @param  {Array: [number: row, number: cell]} cell [Selected Cell]
	     * @param  {object} cellElement [Selected Cell Element]
	     */
	    handleSelectCell: function handleSelectCell(cell) {
	        _dispatcher2.default.publish('cellSelected', cell);

	        // TODO: Is this really necessary? This focuses the table element
	        this.table.focus();

	        this.setState({
	            selected: cell
	        });
	    },

	    /**
	     * Callback for 'cellValueChange', updating the cell data
	     * @param  {Array: [number: row, number: cell]} cell [Selected Cell]
	     * @param  {object} newValue                         [Value to set]
	     */
	    handleCellValueChange: function handleCellValueChange(cell, newValue) {
	        var data = this.state.data,
	            row = cell[0],
	            column = cell[1],
	            oldValue = data.rows[row][column];

	        _dispatcher2.default.publish('cellValueChanged', [cell, newValue, oldValue]);

	        data.rows[row][column] = newValue;
	        this.setState({
	            data: data
	        });

	        _dispatcher2.default.publish('dataChanged', data);
	    },

	    /**
	     * Callback for 'doubleClickonCell', enabling 'edit' mode
	     */
	    handleDoubleClickOnCell: function handleDoubleClickOnCell() {
	        this.setState({
	            editing: true
	        });
	    },

	    /**
	     * Callback for 'cellBlur'
	     */
	    handleCellBlur: function handleCellBlur(cell) {
	        if (this.state.editing) {
	            _dispatcher2.default.publish('editStopped', cell);
	        }

	        this.setState({
	            editing: false,
	            lastBlurred: cell
	        });
	    }
	});

	module.exports = Sheet;

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }
/******/ ])
});
;