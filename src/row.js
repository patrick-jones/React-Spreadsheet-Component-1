import React from 'react';

import CellComponent from './cell';
import Helpers from './helpers';

const RowComponent = props => {
    const {config, cells, cellClasses, selected, editing, uid} = props;

    if (!config.columns || cells.length === 0) {
        return console.error('Table can\'t be initialized without set number of columns and no data!');
    }

    const columns = cells.map((cell, i) => {
        const cellID = [uid, i];
        const isSelected = Helpers.equalCells(selected, cellID);
        const classNames = (cellClasses && cellClasses[i]) ? this.props.cellClasses[i] : '';
        return (<CellComponent key={'row_' + uid + '_cell_' + i}
                                   uid={cellID}
                                   value={cells[i]}
                                   config={config}
                                   cellClasses={classNames}
                                   onCellValueChange={props.onCellValueChange}
                                   handleSelectCell={props.handleSelectCell}
                                   handleDoubleClickOnCell={props.handleDoubleClickOnCell}
                                   handleCellBlur={props.handleCellBlur}
                                   selected={isSelected}
                                   editing={editing} />
        );
    });

    return (<tr>{columns}</tr>);
};

export default RowComponent;
