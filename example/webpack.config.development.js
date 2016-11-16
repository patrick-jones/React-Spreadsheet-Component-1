const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

const join = path.join;

const rootPath = __dirname;
const srcPath = join(rootPath, 'app');
const buildPath = join(rootPath, 'build');
const nodeModulesPath = join(rootPath, 'node_modules');

const sheetsPath = path.resolve(rootPath + './../../src');
const sheetsNodeModulesPath = path.resolve(rootPath + './../../node_modules');

module.exports = {
  context: __dirname + "/app",
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.js', '.css', '.json'],
    alias: { 'react-sheets': sheetsPath },
    modulesDirectories: [
      'app',
      'node_modules',
      './../../node_modules',
      './../../src'
    ]
  },
  entry: [
    'webpack/hot/dev-server',
    'webpack/hot/only-dev-server',
    'index.js',
  ],
  output: {
    path: buildPath,
    filename: 'react-sheets-example.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: [srcPath, sheetsPath, sheetsNodeModulesPath],
      loader: 'babel'
    }, {
      test: /\.css$/,
      include: [srcPath, sheetsPath],
      loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss')
    }]
  },
  postcss(webpackInstance) {
      return [
          require('precss'),
          require('postcss-cssnext'),
      ];
  },
  devServer: {
    contentBase: 'www',
    hot: true,
    port: 5000,
    historyApiFallback: true,
    stats: {
        chunkModules: false,
        colors: true,
    },
  },
  plugins: [
    new ExtractTextPlugin('react-sheets-example.css', { allChunks: true }),
    new TransferWebpackPlugin([], path.resolve(__dirname, './')),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
};
