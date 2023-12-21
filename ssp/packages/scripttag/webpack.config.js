const path = require('path');
const Dotenv = require('dotenv-webpack');

const isProduction = process.env.NODE_ENV === 'production';
const environmentPath = !process.env.ENVIRONMENT ? '.env' : `.env.${process.env.ENVIRONMENT}`;

/**
 * @link https://stackoverflow.com/questions/47830273/babel-plugin-preset-files-are-not-allowed-to-export-objects-only-functions
 * @link https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined
 */
module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, '../../static/scripttag'),
    filename: 'test-notifications.js'
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, '../../packages/assets/src/')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        options: {presets: ['@babel/env', '@babel/preset-react']}
      },
      /**
       * Config to use react-toastify lib in react, which bundle to .esm.mjs
       * Error: Can't import the named export 'XXX' from non EcmaScript module (only default export is available)
       *  line 32:  add this to bundle not only src but also node_modules
       *  line 34:  add this to auto 'recognize' JS modules
       */
      {
        test: /\.mjs$/,
        include: /node_modules/,
        loader: 'babel-loader',
        type: 'javascript/auto'
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: isProduction ? false : 'eval-source-map',
  plugins: [
    new Dotenv({
      safe: false,
      defaults: '.env.example',
      systemvars: true,
      path: path.resolve(__dirname, environmentPath)
    })
  ]
};
