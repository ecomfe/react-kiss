const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    mode: 'development',
    context: __dirname,
    entry: {
        index: path.join(__dirname, 'index.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js'],
        modules: ['node_modules', 'demo'],
        alias: {
            'react-kiss': path.join(__dirname, '..', 'src')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({title: 'react-kiss'})
    ],
    devServer: {
        port: 9012,
        open: true,
        compress: true,
        inline: true,
        hot: false
    }
};
