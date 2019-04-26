/**
 * WebPack Common
 * @type {webpack}
 */
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const path = require('path');

module.exports = new Promise((resolve, reject) => {
  resolve({
    entry: {
      'wp-prime-cat': './src/js/index.jsx',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '../dist'),
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.scss'],
      symlinks: false,
    },
    module: {
      rules: [
        /** JS/JSX */
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        /** SVG */
        {
          test: /\.svg$/,
          use: [{
            loader: 'html-loader',
            options: {
              minimize: true,
            },
          }],
        },
        /** Images */
        {
          test: /\.(png|ico|gif|jpe?g)(\?[a-z0-9]+)?$/,
          exclude: /node_modules/,
          loader: 'url-loader',
          options: {
            limit: 1000 /** Bytes */,
          },
        },
        /** Fonts */
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          exclude: /node_modules/,
          use: ['url-loader'],
        },
        /** Images */
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {},
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }),
    ],
  });
});
