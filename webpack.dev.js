const { pages, plugins, baseWebpackConfig } = require('./webpack.base');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

process.on('unhandledRejection', error => {
  console.error('unhandledRejection', error);
  process.exit(1); // To exit with a 'failure' code
});

module.exports = () => {
  return merge(baseWebpackConfig, {
    devtool: 'inline-source-map',
    devServer: {
      historyApiFallback: {
        rewrites: pages.map(name => {
          const routerFragment = name === 'index' ? '' : name;
          return {
            from: new RegExp('^\\/' + routerFragment + '$'),
            to: `/${name}.html`,
          };
        }),
      },
      hot: true,
      // host: 'local-ip',
      host: '0.0.0.0',
      open: false,
      port: 'auto',
      server: 'http',
      watchFiles: ['public/**/*'],
    },
    externals: {
      jquery: 'jQuery',
    },
    plugins: [
      // plugins.Dotenv(),
      // plugins.DefinePlugin(),
      plugins.EnvironmentPlugin(),
      plugins.WebpackProvidePlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        // chunkFilename: 'css/[name]_chunk.css',
        ignoreOrder: true,
      }),
      ...plugins.MultiHtmlWebpackPlugins(),
    ],
    target: 'web',
  });
};
