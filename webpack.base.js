const { EsbuildPlugin } = require('esbuild-loader');
const { pages, plugins } = require('./webpack.plugins');
const isDev = process.env.NODE_ENV === 'development';
const loaders = require('./webpack.loaders');
const path = require('path');
const resolve = file_or_dir => path.resolve(__dirname, file_or_dir);
const svgToMiniDataURI = require('mini-svg-data-uri');
const TerserPlugin = require('terser-webpack-plugin');

console.log(`[${process.env.NODE_ENV} mode]`);

module.exports = {
  baseWebpackConfig: {
    entry: pages.reduce((config, page) => {
      config[page] = `./src/js/${page}.js`;
      return config;
    }, {}),
    module: {
      noParse: /jquery|lodash/,
      rules: [
        {
          test: /\.css$/,
          use: [
            // keep order
            loaders.miniCssExtractLoader,
            loaders.cssLoader,
            loaders.postCssLoader,
          ],
        },
        {
          test: /\.scss$/,
          use: [
            // keep order
            loaders.miniCssExtractLoader,
            loaders.cssLoader,
            loaders.postCssLoader,
            loaders.resolveUrlLoader,
            loaders.scssLoader,
          ],
        },
        {
          test: /\.sass$/,
          use: [
            // keep order
            isDev ? 'style-loader' : loaders.miniCssExtractLoader,
            // loaders.miniCssExtractLoader,
            loaders.cssLoader,
            loaders.postCssLoader,
            loaders.resolveUrlLoader,
            loaders.sassLoader,
          ],
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            // { loader: 'babel-loader' },
            {
              loader: 'esbuild-loader',
              options: {
                loader: 'jsx',
                target: 'es2015',
              },
            },
          ],
        },
        {
          test: /\.(jpe?g|png|webp)$/i,
          include: resolve('./src/assets/rwd/'),
          use: [
            {
              loader: 'responsive-loader',
              options: {
                adapter: require('responsive-loader/sharp'),
                name: '[name]-[width].[ext]',
                outputPath: 'assets',
              },
            },
          ],
          type: 'javascript/auto',
        },
        {
          test: /\.(jpe?g|png|webp|gif|svg)$/i,
          include: resolve('./src/assets/static/'),
          type: 'asset/resource',
          // generator: {
          //   filename: '[name][ext]',
          //   outputPath: 'assets/',
          //   publicPath: '../assets/',
          // },
        },
        {
          test: /\.(jpe?g|png|webp|gif|svg)$/i,
          include: resolve('./src/assets/static/'),
          resourceQuery: /root/,
          type: 'asset/resource',
          // generator: {
          //   filename: '[name][ext]',
          //   outputPath: 'assets/',
          //   publicPath: 'assets/',
          // },
        },
        {
          test: /\.(ogg|mp4|mp3|webm)$/i,
          include: resolve('./src/assets/media/'),
          type: 'asset/resource',
          // generator: {
          //   filename: '[name][ext]',
          //   outputPath: 'assets/media/',
          //   publicPath: '../assets/media/',
          // },
        },
        {
          test: /\.svg$/i,
          include: resolve('./src/assets/inline/'),
          type: 'asset/inline',
          generator: {
            dataUrl: content => {
              content = content.toString();
              return svgToMiniDataURI(content);
            },
          },
        },
        {
          test: /\.tpl$/i,
          include: resolve('./src/include'),
          loader: 'html-loader',
          options: {
            minimize: false,
          },
        },
      ],
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
        new EsbuildPlugin({
          target: 'es2015',
          css: true,
        }),
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          defaultVendors: {
            minChunks: 2,
            name: 'vendors',
            priority: 3,
            test: /[\\/]node_modules[\\/]|[\\/]src[\\/]components[\\/]/,
          },
          // 將共用的css抽出為commons.css
          commons: {
            minChunks: 2,
            name: 'commons',
            priority: 4,
            test: /\.(css|sass|scss)$/,
          },
        },
      },
    },
    output: {
      assetModuleFilename: 'assets/[name][ext]',
      chunkFilename: 'js/[name].js',
      clean: true,
      filename: 'js/[name].js',
      publicPath: 'auto',
    },
    resolve: {
      alias: {
        '@': resolve('src'),
        '@assets': resolve('src/assets'),
        '@components': resolve('src/components'),
        '@include': resolve('src/include'),
        '@lib': resolve('src/lib'),
        '@sass': resolve('src/sass'),
        '@utils': resolve('src/utils'),
      },
      extensions: ['.js', '.jsx'],
    },
    stats: 'minimal',
  },
  loaders,
  pages,
  plugins,
};
