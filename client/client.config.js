const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        "public/client": './src/index.ts',
    },
    output: {
        path: __dirname + "../../dist",
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                use: [
                    {
                        loader: 'tslint-loader',
                        options: { /* Loader options go here */ }
                    }
                ]
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    },
    plugins: [
        new CopyPlugin([
            { from: 'src/index.html', to: './public' },
            { from: 'src/assets/', to: './public' }
        ]),
    ],
    stats: {
        warnings: false
    },
    devServer: {
        open: true,
    },
}