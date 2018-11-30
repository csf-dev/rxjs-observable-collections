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
    devtool: 'source-map'
}