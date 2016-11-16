const webpack = require('webpack');
const path = require('path');
const join = path.join;

// Paths
const rootPath = __dirname;
const srcPath = join(rootPath, 'src');
const libPath = join(rootPath, 'lib');
const nodeModulesPath = join(rootPath, 'node_modules');

// Webpack plugins
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var env = process.env.NODE_ENV;

var reactExternal = {
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react'
};
var reactDOMExternal = {
    root: 'ReactDOM',
    commonjs2: 'react-dom',
    commonjs: 'react-dom',
    amd: 'react-dom'
};

var cssName = env === 'development' ? 'react-sheets.css' : 'react-sheets.min.css';
var cssMinimize = env === 'development' ? '-minimize&' : '';

var config = {
    externals: {
        'react': reactExternal,
        'react-dom': reactDOMExternal
    },
    output: {
        library: 'ReactSheets',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: ['', '.js', '.css', '.json'],
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] },
            { test: /\.css$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract('style', 'css?' + cssMinimize + 'modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss')},
        ],
    },
    postcss(webpackInstance) {
        return [
            require('postcss-cssnext')(),
            require('precss')({}),
        ];
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(env)
        }),
        new ExtractTextPlugin(cssName, {allChunks: true})
    ],
};

if (env === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    })
  )
}

module.exports = config;
