const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin') 
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry: './src/client/index.js',
    output: {
        filename: 'bundle.js',
        publicPath: '/',
        path: path.join(__dirname, 'dist'),
    },
    devServer: {
        contentBase: './',
        inline: true,
        hot: false,
    },
    devtool: 'source-map',
    resolve: {
        extensions: [ '.js', '.jsx', '.json' ],
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(css)$/,
                exclude: /node_modules/,
                use:  [ MiniCssExtractPlugin.loader, 'css-loader' ]
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/client/index.html',
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        })
    ],
};