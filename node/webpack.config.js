const webpack = require('webpack'),
    path = require('path'),
    htmlWebpackPlugin = require('html-webpack-plugin'),
    BUILD_DIR = path.resolve(__dirname, 'client/public'),
    CLIENT_DIR = path.resolve(__dirname, 'client'),
    APP_DIR = `${CLIENT_DIR}/app`,
    VendorChunkPlugin = require('webpack-vendor-chunk-plugin');

const config = {
    entry: {
        app: APP_DIR + '/index.jsx',
        vendor: [
            'react-dom',
            'react'
        ]
    },
    output: {
        path: BUILD_DIR,
        filename: "[name].[chunkhash].bundle.js",
        chunkFilename: "[id].[chunkhash].bundle.js"
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /.png$/,
                loader: 'file'
            },
            {
                test: /.svg$/,
                loader: 'file'
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            title: 'Knockt',
            template: APP_DIR + '/index.template.html'
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor', '[name].[hash].js'),
        new VendorChunkPlugin('vendor')
    ]
};

module.exports = config;