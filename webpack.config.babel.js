export default {
    entry: {
        'blurify': [
            './src/index.js',
        ],
    },
    output: {
        path: '../dist',
        // publicPath:'', // public path
        filename: 'js/[name].js?[hash:8]', // output file name
    },
    module: {
        loaders: [{
            test: /\.(js|es6)$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
        }, {
            test: /\.(woff|ttf|eot|svg|gif|jpg|png)$/,
            loader: 'url-loader?limit=5120&name=[path][name].[ext]?[hash:8]', // Images which less than 5K turn into base64.
        }, {
            test: /\.json$/,
            loader: 'json-loader',
        }],
    },
    resolve: {
        extensions: ['.js', '.es6', '.scss', '.css'],
    },
};
