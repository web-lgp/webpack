const os = require('os')
const path = require("path")//nodejs专门处理路径问题
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin")
const WorkboxPlugin = require('workbox-webpack-plugin');

const threads = os.cpus.length //获取电脑的cpu个数
console.log(threads);

//用来获取处理样式的loader
function getStyleLoader(pre) {
    return [
        MiniCssExtractPlugin.loader,
        "css-loader",
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        [
                            'postcss-preset-env'
                        ],
                    ],
                },
            },
        },
        pre
    ].filter(Boolean)
}
module.exports = {
    //入口
    entry: "./src/main.js",
    //输出
    output: {
        //所有文件的输出路径
        path: path.resolve(__dirname, "../dist"),
        //入口文件打包输出文件名
        filename: "static/js/[name].js",
        //自动清空上次打包的内容
        clean: true,
        //打包按需引入的文件名配置
        chunkFilename: "static/js/[name].chunk.js",
        //图片、字体等通过type:asset统一处理资源
        assetModuleFilename: "static/media/[hash:10][enx][query]"
    },
    //加载器，处理webpack不能识别的资源
    module: {
        //loader的配置
        rules: [
            {
                oneOf: [
                    {
                        test: /\.css$/,
                        use: getStyleLoader()
                    },
                    {
                        test: /\.less$/,
                        use: getStyleLoader("less-loader"),
                    },
                    {
                        test: /\.(sass|scss)$/,
                        use: getStyleLoader("sass-loader")
                    },
                    {
                        test: /\.styl$/,
                        use: getStyleLoader("stylus-loader")
                    },
                    {
                        test: /\.(png|jpe?g|gif|webp|svg)$/,
                        type: "asset",
                        parser: {
                            dataUrlCondition: {
                                maxSize: 10 * 1024
                            }
                        },
                        //output上统一处理了，这里图片打包输出后名称
                        // generator: {
                        //     filename: "static/images/[hash:10][enx][query]"
                        // }
                    },
                    {
                        test: /\.(ttf|woff2?|map3|map4|avi)$/,
                        type: "asset/resource",
                        //output上统一处理了，视频等打包输出后名称
                        // generator: {
                        //     filename: "static/media/[hash:10][enx][query]"
                        // }
                    },
                    {
                        test: /\.m?js$/,
                        include: path.resolve(__dirname, "../src"),
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
            exclude: "node_modules",
            cache: true,//开启缓存
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache/eslintcache"),
            threads,//开启多进程和进程数量
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html")
        }),
        new MiniCssExtractPlugin({
            filename: "static/css/[name].css",
            chunkFilename: "static/css/[name].chunk.css",
        }),
        new WorkboxPlugin.GenerateSW({
            // 这些选项帮助快速启用 ServiceWorkers
            // 不允许遗留任何“旧的” ServiceWorkers
            clientsClaim: true,
            skipWaiting: true,
        }),
    ],
    optimization: {
        //压缩操作
        minimizer: [
            //压缩CSS
            new CssMinimizerPlugin(),
            //压缩JS
            new TerserWebpackPlugin({
                parallel: threads, //开启多进程和进程数量
            })
        ],
        //代码分割，按需加载
        splitChunks: {
            chunks: "all"
        }
    },
    //开发服务器
    devServer: {
        host: "localhost",//服务器域名
        port: "3000",//端口号
        open: true//是否自动打开浏览器
    },
    mode: "production",
    //处理打包后的代码报错，并提示源码位置
    devtool: "source-map"
}