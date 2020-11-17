"use strict";

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackIconfontPluginNodejs = require('webpack-iconfont-plugin-nodejs');
const fs = require('fs');


const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist'),
    assets: 'assets/'
};

const PAGES_DIR = `${PATHS.src}`;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.html'));

module.exports = {

    externals: {
        paths: PATHS
    },
    entry: {
        // точки входа
        app: PATHS.src,
        // modules: `${PATHS.src}/index.js`
    },
    output: {
        // filename: `${PATHS.assets}js/[name].[hash].js`,
        path: PATHS.dist, // path.resolve(__dirname, 'dist')
        publicPath: ''
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
            // js Babel
            {
                test: /\.js$/,// настройка Babel
                loader: 'babel-loader',
                exclude: '/node_modules'// исключил обработку библиотек
            },
            // Fonts
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            // images / icons
            {
                test: /\.(png|jpg|gif|svg)$/,// настройка картинок
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            // Scss Style
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: { path: `./postcss.config.js` },
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    }
                ]

            },
            // Css style
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: { path: `./postcss.config.js` },
                        }
                    },
                ]
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `${PATHS.assets}css/[name].[hash].css`,
        }),
        new CopyWebpackPlugin({
            patterns: [
                // Img
                {
                    from: `${PATHS.src}/${PATHS.assets}img`,
                    to: `${PATHS.assets}img`
                },
                // {
                //     from: `${PATHS.src}/${PATHS.assets}icons`,
                //     to: `${PATHS.assets}icons`
                // },
                // Fonts:
                {
                    from: `${PATHS.src}/${PATHS.assets}fonts`,
                    to: `${PATHS.assets}fonts`
                },
                {
                    from: `${PATHS.src}/static`,
                    to: `${PATHS.assets}static`
                }
            ]
        }),
        ...PAGES.map(page => new HtmlWebpackPlugin({
            template: `${PAGES_DIR}/${page}`,
            filename: `./${page}`
        })),
        new HtmlWebpackPlugin({
            template: `${PATHS.src}/${PATHS.assets}html/index.html`, // PAGES_DIR
            filename: './index.html',
            inject: true
        }),
        new WebpackIconfontPluginNodejs({
            fontName: 'my-icons',
            cssPrefix: 'ico',
            svgs: `${PATHS.src}/${PATHS.assets}icons/*.svg`, // взял иконки 
            // template: `${PATHS.src}/${PATHS.assets}scss/utils/fonts.scss`,
            fontsOutput: `${PATHS.src}/${PATHS.assets}fonts`, //тут ложу сами иконочные шрифты к шрифтам
            cssOutput: `${PATHS.src}/${PATHS.assets}css/fonts.css`,
            // htmlOutput: `${PATHS.src}/${PATHS.assets}fonts/_font-preview.html`,
            // jsOutput: `${PATHS.src}index.js`,
            // formats: ['ttf', 'woff', 'svg', 'woff2'],
        }),
    ],
};