const os = require('os')
const path = require("path")//nodejs专门处理路径问题
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const threads = os.cpus.length //获取电脑的cpu个数
console.log(threads);
module.exports = {
    //入口
    entry: "./src/main.js",
    //输出
    output: {
        //所有文件的输出路径
        path: undefined,
       //入口文件打包输出文件名
       filename: "static/js/[name].js",
       //打包按需引入的文件名配置
       chunkFilename:"static/js/[name].chunk.js",
       //图片、字体等通过type:asset统一处理资源
       assetModuleFilename:"static/media/[hash:10][enx][query]"
    },
    //加载器，处理webpack不能识别的资源
    module: {
        //loader的配置
        rules: [
           {
               oneOf:[
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
                    // generator: {
                    //     filename: "static/images/[hash:10][enx][query]"
                    // }
                },
                {
                    test: /\.(ttf|woff2?|map3|map4|avi)$/,
                    type: "asset/resource",
                    // generator: {
                    //     filename: "static/media/[hash:10][enx][query]"
                    // }
                },
                {
                    test: /\.m?js$/,
                    include:path.resolve(__dirname,"../src"),//只处理src下的文件，其他文件不处理
                    use: [
                        {
                            loader: "thread-loader", //开启多线程
                            options: {
                                works: threads  //进程数量
                            }
                        },
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,//开启babel缓存
                                cacheCompression: false //关闭缓存文件压缩
                            }
                        }
                    ]
                  }
               ]
           }
        ]
    },
    //插件
    plugins: [
        new ESLintPlugin({ 
            context: path.resolve(__dirname, "../src"),
            exclude:"node_modules",  //除了node_modules目录下的文件不处理，其他文件都处理
            cache: true,//开启缓存
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache/eslintcache"),
            threads,//开启多进程和进程数量
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