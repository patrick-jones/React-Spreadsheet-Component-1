const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = require('../webpack.config.js');

var example = Object.assign({}, config, {
    devtool: 'source-map',
    externals: {},
    entry: [
      'webpack/hot/dev-server',
      'webpack/hot/only-dev-server',
      './example/index.js',
    ],
    output: {
      path: __dirname,
      filename: 'react-sheets-example.js'
    },
    plugins: config.plugins.concat(
        new webpack.NormalModuleReplacementPlugin(
          /^react-sheets$/,
          '../src/index'
        )
    ),
});

console.log(example.output.path);

// change plugins
example.plugins = [
    config.plugins[0],
    config.plugins[1],
    new webpack.NormalModuleReplacementPlugin(/^react-sheets$/, '../src/index'),
    new ExtractTextPlugin('react-sheets-example.css', {allChunks: true}),
];

module.exports = example;
