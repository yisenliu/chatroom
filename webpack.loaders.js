const isDev = process.env.NODE_ENV === 'development';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const miniCssExtractLoader = MiniCssExtractPlugin.loader;
const path = require('path');

module.exports = {
  cssLoader: {
    loader: 'css-loader',
    options: {
      importLoaders: 3,
      sourceMap: isDev,
    },
  },
  miniCssExtractLoader,
  postCssLoader: {
    loader: 'postcss-loader',
    options: {
      sourceMap: isDev,
      postcssOptions: {
        config: path.resolve(__dirname, 'postcss.config.js'),
      },
    },
  },
  resolveUrlLoader: {
    loader: 'resolve-url-loader',
    options: {
      sourceMap: isDev,
    },
  },
  sassLoader: {
    loader: 'sass-loader',
    options: {
      additionalData: `
        @use 'sass:math'
        @import '_global.sass'
      `,
      implementation: require('sass'),
      sourceMap: true,
      sassOptions: {
        includePaths: ['src/sass'],
        indentedSyntax: true,
        outputStyle: 'expanded',
        sourceMap: isDev,
      },
    },
  },
  scssLoader: {
    loader: 'sass-loader',
    options: {
      additionalData: `
        @use 'sass:math';
        @import '_global.sass';
      `,
      implementation: require('sass'),
      sourceMap: true,
      sassOptions: {
        includePaths: ['src/sass'],
        indentedSyntax: false,
        outputStyle: 'expanded',
        sourceMap: isDev,
      },
    },
  },
};
