'use strict';
import path from 'path'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development';

const source = path.join(__dirname, 'src');
const output = path.join(__dirname);

export default {
  devtool: isDev ? 'source-map' : false,
  mode: env,
  context: source,
  resolve: {
    modules: ['node_modules', source],
    extensions: ['.js']
  },
  entry: './index.js',
  output: {
    path: output,
    filename: `dist/use-form${isDev ? '.js' : '.min.js'}`,
    library: 'useForm',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /(\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin(),
    ],
  },
};