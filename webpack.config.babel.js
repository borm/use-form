'use strict';
import path from 'path';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development';

const source = path.join(__dirname, 'src');
const entry = ['./index.ts'];
const output = path.join(__dirname);

let externals;
if (typeof process.env.NODE_ENV === 'undefined') {
  entry.push('../example/index.js');
} else {
  externals = {
    react: 'React',
    'react-dom': 'ReactDOM',
  };
}

export default {
  devtool: isDev ? 'inline-source-map' : false,
  devServer: {
    contentBase: output,
    publicPath: '/',
    historyApiFallback: {
      index: '/example/index.html',
    },
  },
  mode: env,
  context: source,
  resolve: {
    modules: ['node_modules', source],
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  entry,
  output: {
    path: output,
    filename: `dist/use-form${isDev ? '.js' : '.min.js'}`,
    library: 'useForm',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  externals,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /(\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
      },
    ],
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
};
