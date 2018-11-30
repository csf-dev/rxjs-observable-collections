const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: { loader: 'babel-loader' }
            }
        ]
    },
    output: {
        library: 'rxjs-observable-collections',
        libraryTarget: 'umd'
    },
    externals: {
        rxjs: 'rxjs'
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        minimizer: [new UglifyJsPlugin({ parallel: true })]
    },
    devtool: 'source-map'
}