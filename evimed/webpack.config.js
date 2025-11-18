const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = (env, argv) => {
  // Get REACT_APP_API_URL from environment or use default
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  
  return {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new Dotenv({
      path: './.env',
      safe: false,
      allowEmptyValues: true,
      systemvars: true,
      silent: true,
      defaults: false
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_API_URL': JSON.stringify(apiUrl),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: {
      index: '/index.html',
    },
    open: true,
    client: {
      logging: 'none',
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: false,
    },
    devMiddleware: {
      stats: 'errors-warnings',
    },
    onListening: function(devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      // Подавляем вывод сообщений о запуске
    },
  },
  stats: 'errors-warnings',
  mode: 'development',
  };
};

