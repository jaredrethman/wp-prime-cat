/* eslint-disable no-console */

/** Generic */
const webpack = require('webpack');
const path = require('path');

/** Config commons */
const merge = require('webpack-merge');

/** Plugins */

const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = new Promise((resolve, reject) => {
  common
    .then((data) => {
      resolve(
        merge(data, {
          mode: 'production',
          externals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            lodash: 'lodash',
          },
          devtool: '(none)',
          module: {
            rules: [
              /** SASS */
              {
                test: /\.scss$/,
                use: [
                  MiniCssExtractPlugin.loader,
                  'css-loader',
                  'postcss-loader',
                  {
                    loader: 'sass-loader',
                    options: {
                      includePaths: ['./node_modules'],
                      sourceMap: true,
                    },
                  },
                ],
              },
              {
                test: /\.css$/,
                use: [
                  'vue-style-loader',
                  MiniCssExtractPlugin.loader,
                  'css-loader',
                ],
              },
            ],
          },
          optimization: {
            minimizer: [
              new UglifyJsPlugin({
                cache: true,
                parallel: true,
              }),
              new OptimizeCSSAssetsPlugin({}),
            ],
          },
          plugins: [
            new MiniCssExtractPlugin({
              filename: '[name].css',
              chunkFilename: '[id].css',
            }),
            // new webpack.IgnorePlugin(/react/),
          ],
        }) // eslint-disable-line comma-dangle
      );
    })
    .catch(e => {
      console.log(e);
      reject();
    });
});
