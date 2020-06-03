const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin') 
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry: {
        app: ['./src/client/index.js',  'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',],
    },
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        hotUpdateChunkFilename: '.hot/hot-update.js',
        hotUpdateMainFilename: '.hot/hot-update.json',        
    },
    devServer: {
        contentBase: "dist",
        overlay: true,
        inline: true,
        hot: true
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
        new webpack.HotModuleReplacementPlugin(),
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