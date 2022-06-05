const path = require("path")//nodejs专门处理路径问题
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    //入口
    entry: "./src/main.js",
    //输出
    output: {
        //所有文件的输出路径
        path: undefined,
        //入口文件打包输出文件名
        filename: "static/js/main.js",
        // //自动清空上次打包的内容
        // clean: true
    },
    //加载器，处理webpack不能识别的资源
    module: {
        //loader的配置
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
    //插件
    plugins: [
        new ESLintPlugin({ 
            context: path.resolve(__dirname, "../src") 
        }),
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,"../public/index.html")
        }),
    ],
    //开发服务器
    devServer:{
        host:"localhost",//服务器域名
        port:"3000",//端口号
        open:true,//是否自动打开浏览器
        hot:true  //开启热处理
    },
    mode: "development",
    //处理开发环境下代码报错，并提示源码位置快速定位
    devtool:"cheap-module-source-map"
}