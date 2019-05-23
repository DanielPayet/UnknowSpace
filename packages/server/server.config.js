const NodemonPlugin = require('nodemon-webpack-plugin')
const Webpack = require("webpack");
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
    entry: {
        server: './src/index.ts',
    },
    output: {
        path: __dirname + "../../../dist",
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader'
        }]
    },
    target: "node",
    node: {
        __dirname: false,
    },
    plugins: [
        new NodemonPlugin(),
        new Webpack.IgnorePlugin(/uws/),
        new OpenBrowserPlugin({ url: 'http://localhost:3000' })
    ],
    stats: {
        warnings: false
    }
}