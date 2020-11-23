'use strict';
import webpackConfigBase, { output } from './webpack.config.babel';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  ...webpackConfigBase,
  devServer: {
    contentBase: output,
    publicPath: '/',
    historyApiFallback: true,
  },
  entry: [...webpackConfigBase.entry, '../demo/index.js'],
  externals: {},
  plugins: [
    new HtmlWebpackPlugin({
      template: '../demo/index.html',
    }),
  ],
};
