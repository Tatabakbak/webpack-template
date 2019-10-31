const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist'),
    assets: 'assets/'
};

module.exports = {
    externals: {
        paths: PATHS //для доступа других конфигов к PATHS
    },

    //точка входа
    entry: {
        app: PATHS.src,// ищет в указанном пути index.js (может быть несколько точек входа)
        lk: `${PATHS.src}/js/lk.js`
    },
    //точка выхода
    output: {
        filename: `${PATHS.assets}js/[name].[hash].js`, //имя = ярлык точки входа ("app")
        path: PATHS.dist, //выходная директория
        publicPath: "/" //для dev-server'а
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendors',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },

    module: {
        rules: [
            {
                test: /\.js$/, //все js файлы
                loader: "babel-loader", // обрабатываются через babel-loader
                exclude: "/node_modules/" // кроме node_modules (они уже, скорее всего, конвертированы)
            },
            {
                test: /\.(png|jpg|gif|svg)$/, //все изображения
                loader: "file-loader", // обрабатываются через file-loader
                options: {
                    name:'[name].[ext]'
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, //все шрифты
                loader: "file-loader", // обрабатываются через file-loader
                options: {
                    name:'[name].[ext]'
                }
            },
            {
                test: /\.css$/, //все css файлы
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {sourceMap: true}
                    },
                    {
                        loader: "postcss-loader",
                        options: {sourceMap: true, config: {path: './postcss.config.js'}}
                    },
                ]
            },
            {
                test: /\.scss$/, //все scss файлы
                use: [
                    "style-loader",
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {sourceMap: true}
                    },
                    {
                        loader: "postcss-loader",
                        options: {sourceMap: true, config: {path: './postcss.config.js'}}
                    },
                    {
                        loader: "sass-loader",
                        options: {sourceMap: true}
                    }
                ]
            }]
    },
    resolve: {
        alias:{
            //jQuery
            '~': 'src' // usage in js (vue/react/etc) - import example from '~/components/Example.vue'
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            // This plugin extracts CSS into separate files.
            // It creates a CSS file per JS file which contains CSS. It supports On-Demand-Loading of CSS and SourceMaps.
            filename: `${PATHS.assets}css/[name].css`
        }),
        new CopyWebpackPlugin([
            // плагин для копирования статики из ресурсов в папку сборки
            // Copies individual files or entire directories, which already exist, to the build directory.
            {from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img`},
            {from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts`},
            {from: `${PATHS.src}/static`, to: ''}
        ]),
        new HtmlWebpackPlugin({
            // The plugin will generate an HTML5 file for you that includes all your webpack bundles in the body using script tags.
            // If you have multiple webpack entry points, they will all be included with <script> tags in the generated HTML.
            // If you have any CSS assets in webpack's output (for example, CSS extracted with the MiniCssExtractPlugin)
            // then these will be included with <link> tags in the <head> element of generated HTML.
            hash: false,
            template: `${PATHS.src}/index.html`,
            filename: "./index.html"
        })
    ]
};