const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const BundleTracker = require('webpack-bundle-tracker');
const {VueLoaderPlugin} = require('vue-loader');
const WriteFilePlugin = require('write-file-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev;
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const getFilename = ext => isProd ? `[name].[hash].${ext}` : `[name].${ext}`

const getLoaders = (extra) => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true
            }
        },
        'css-loader',
    ]

    if (extra) {
        loaders.push(extra)
    }

    return loaders
}

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimize = true;
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserPlugin({
                exclude: /node_modules/
            })
        ]
    }

    return config
}

module.exports = {
    context: path.resolve(__dirname, "src"),
    entry: {
        app: './index.js'
    },
    output: {
        filename: 'js/' + getFilename('js'),
    },
    plugins: [
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        new BundleTracker({
            path: path.resolve(__dirname, "dist"),
            filename: './webpack-stats.json',
        }),
        new WriteFilePlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/' + getFilename('css'),
        }),
    ],
    devServer: {
        port: 9000,
        compress: true,
        hot: true,
        noInfo: true,
        overlay: true,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        contentBase: '/frontend/dist',
    },
    devtool: isDev ? 'source-map' : '',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: getLoaders(),
                exclude: /node_modules/
            },
            {
                test: /\.(s[ac]ss)$/,
                use: getLoaders('sass-loader'),
                exclude: /node-modules/
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: {
                    loader: "file-loader",
                    options: {
                        publicPath: '/static/dist/images/',
                        outputPath: 'images',
                        name: getFilename('[ext]'),
                    }
                }
            }
        ]
    },
    optimization: optimization(),
    resolve: {
        extensions: ['*', '.js', '.vue', '.json']
    }
}