const path = require("path")
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "static/js/main.js",
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader",
                ]
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ]
            },
            {
                test: /\.styl$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "stylus-loader",
                ]
            },
            {
                test: /\.(png|jpe?g|gif|webp|svg)$/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024
                    }
                },
                generator: {
                    filename: "static/images/[hash:10][enx][query]"
                }
            },
            {
                test: /\.(ttf|woff2?|map3|map4|avi)$/,
                type: "asset/resource",
                generator: {
                    filename: "static/media/[hash:10][enx][query]"
                }
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
              }
        ]
    },
    plugins: [new ESLintPlugin(
        { context: path.resolve(__dirname, "src") }
    )],
    mode: "development"
}