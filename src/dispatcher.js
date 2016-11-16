const spreadsheetId = 'KILL ME';

// TODO: Get rid of this entirely

const dispatcher = {
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
    subscribe: function(topic, listener) {
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
    publish: function(topic, data) {
        // return if the topic doesn't exist, or there are no listeners
        if (!this.topics[spreadsheetId] || !this.topics[spreadsheetId][topic] || this.topics[spreadsheetId][topic].length < 1) {
            return
        }

        this.topics[spreadsheetId][topic].forEach(function(listener) {
            listener(data || {});
        });
    }
};

module.exports = dispatcher;
