export default {
    entry: {
        'blurify': [
            './src/index.js',
        ],
        'blurify.min': [
            './src/index.js',
        ],
    },
    output: {
        path: './dist',
        filename: '[name].js?[hash:8]',
    },
    module: {
        loaders: [{
            test: /\.(js|es6)$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
        }],
    },
    resolve: {
        extensions: ['.js', '.es6', '.scss', '.css'],
    },
};
