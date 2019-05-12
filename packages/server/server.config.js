const NodemonPlugin = require('nodemon-webpack-plugin')
const Webpack = require("webpack");

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
        new Webpack.IgnorePlugin(/uws/)
    ],
    stats: {
        warnings: false
    }
}