const { plugins, baseWebpackConfig } = require('./webpack.base');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {
  return merge(baseWebpackConfig, {
    devtool: false,
    plugins: [
      plugins.Dotenv(),
      plugins.DefinePlugin(),
      plugins.EnvironmentPlugin(),
      plugins.WebpackProvidePlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        // chunkFilename: 'css/[name]_chunk.css',
        ignoreOrder: true,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public/js',
            to: 'js',
            info: { minimized: true },
          },
          {
            from: 'public/data',
            to: 'data',
            info: { minimized: true },
          },
        ],
      }),
      ...plugins.MultiHtmlWebpackPlugins(),
    ],
    target: 'browserslist',
  });
};
