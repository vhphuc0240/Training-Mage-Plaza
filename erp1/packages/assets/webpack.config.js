/* tslint:disable */
const path = require('path');
const workboxPlugin = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const {WebpackPluginServe} = require('webpack-plugin-serve');
const fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';
const environmentPath = !process.env.ENVIRONMENT ? '.env' : `.env.${process.env.ENVIRONMENT}`;
const wpsPort = process.env.WPS_PORT || 45100;

const [sslKey, sslCert] = ['ssl.key', 'ssl.crt'].map(file => {
  try {
    return fs.readFileSync(path.resolve(__dirname, '../../../ssl/' + file), 'utf8');
  } catch (e) {
    return null;
  }
});
const isHotReloadEnabled = sslKey && sslCert && !isProduction;

const plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve('webpack/html/index.html'),
    inject: true,
    hash: true,
    meta: {
      'theme-color': '#4285f4',
      description: 'AVADA Commerce CRM'
    }
  }),
  new Dotenv({
    safe: false,
    defaults: '.env.example',
    path: path.resolve(__dirname, environmentPath)
  }),
  new CopyPlugin([{from: 'webpack/copy', to: '.'}])
];

if (isHotReloadEnabled) {
  plugins.push(
    new CleanWebpackPlugin({
      verbose: true,
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: ['**/*', '!index.html*', '!css/**', '!auth/**', '!scripttag/**']
    }),
    new WebpackPluginServe({
      // client: {silent: true},
      compress: true,
      historyFallback: true,
      hmr: 'refresh-on-failure',
      // progress: 'minimal',
      host: 'localhost',
      port: wpsPort,
      https: {key: sslKey, cert: sslCert},
      static: path.resolve(__dirname, '../../static'),
      status: false
    }),
    new ReactRefreshWebpackPlugin({
      overlay: {
        sockIntegration: 'wps'
      }
    })
  );
}

if (isProduction) {
  plugins.push(
    new FaviconsWebpackPlugin({
      logo: path.resolve('webpack/icons/icon.png'),
      favicons: {
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: true,
          favicons: true,
          firefox: true,
          windows: true,
          yandex: true
        }
      }
    }),
    new workboxPlugin.GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true
    }),
    new WebpackPwaManifest({
      filename: 'manifest.json',
      inject: true,

      start_url: '.',
      orientation: 'portrait',
      display: 'standalone',
      fingerprints: true,
      name: 'Mageplaza PDF Invoice',
      short_name: 'MageplazaPDFInvoice',
      description: 'An Shopify Application for generate PDF Invoice',
      background_color: '#ffffff',
      icons: [
        {
          src: path.resolve('webpack/icons/icon.png'),
          sizes: [96, 128, 192, 256, 384, 512],
          destination: path.join('icons')
        },
        {
          src: path.resolve('webpack/icons/icon-large.png'),
          size: '1024x1024',
          destination: path.join('icons')
        }
      ]
    })
  );
}

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    main: [
      path.resolve(__dirname, 'src/index.js'),
      isHotReloadEnabled && 'webpack-plugin-serve/client'
    ].filter(Boolean)
  },
  output: {
    path: path.resolve(__dirname, '../../static'),
    filename: `js/[name]~[${isHotReloadEnabled ? 'hash' : 'contenthash'}].js`,
    chunkFilename: 'js/[name]~[contenthash].chuck.js',
    publicPath: '/',
    pathinfo: false
  },
  devtool: isProduction ? false : 'eval-source-map',
  performance: {
    hints: isProduction ? 'warning' : false
  },
  plugins,
  optimization: {
    minimize: isProduction,
    runtimeChunk: {
      name: 'runtime'
    },
    splitChunks: {
      chunks: 'all'
    }
  },
  devServer: {
    contentBase: path.join(__dirname, 'static'),
    historyApiFallback: true,
    compress: true,
    port: 9000,
    open: true,
    public: '0.0.0.0:9000',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [isHotReloadEnabled && 'react-refresh/babel'].filter(Boolean)
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff(2)?)$/i,
        use: [
          {
            loader: 'file-loader'
          }
        ]
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
  }
};
