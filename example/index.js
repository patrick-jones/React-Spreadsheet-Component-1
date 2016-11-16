import React from 'react';
import ReactDOM from 'react-dom';
import Spreadsheet from 'react-sheets';

// Example One
var exampleOne = {};

exampleOne.initialData = {
    rows: [
        ['', '', '', '', '', '', '', ''],
        ['', 1, 2, 3, 4, 5, 6, 7],
        ['', 1, '', 3, 4, 5, 6, 7],
        ['', 1, 2, 3, 4, 5, 6, 7],
        ['', 1, 2, 3, 4, 5, 6, 7]
    ]
};

exampleOne.config = {
    rows: 5,
    columns: 8,
    hasHeadColumn: true,
    isHeadColumnString: true,
    hasHeadRow: true,
    isHeadRowString: true,
    canAddRow: true,
    canAddColumn: true,
    emptyValueSymbol: '-',
    hasLetterNumberHeads: true
};

const Example = ({initialData, config, cellClasses}) => {
    return (
        <div>
            <div className="intro">
                <h2><a href="https://github.com/patrick-jones/react-sheets">React Sheets</a></h2>
                <p>
                    These are two rather simple examples of <a href="https://github.com/patrick-jones/react-sheets">react-sheets</a>,
                    a simple spreadsheet component in React. It's made with &lt;3 by Microsoft DX
                    and released under the MIT License.
                </p>
            </div>
            <div className="example">
                <h3>Simple Example Spreadsheet</h3>
                <Spreadsheet initialData={initialData} config={config} cellClasses={cellClasses} />
            </div>
        </div>
    );
}

ReactDOM.render(<Example {...exampleOne} />, document.getElementById('example'));
