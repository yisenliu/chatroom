const Dotenv = require('dotenv-webpack');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const myPackage = require('./package.json');
const path = require('path');
const resolve = file_or_dir => path.resolve(__dirname, file_or_dir);
const PATHS = {
  html: resolve('public'),
};
const webpack = require('webpack');

// generate multiple HtmlWebpackPlugins
let htmlFiles = fs.readdirSync(`${PATHS.html}`).filter(file => {
  if (file.indexOf('.htm') !== -1 && file.charAt(0) !== '_') return file;
});
const pages = htmlFiles.map(file => {
  const basename = file.split('.')[0];
  return basename;
});

const plugins = {
  Dotenv: () => {
    // 必須透過 process.env.KEY 取得變數值
    return new Dotenv();
  },
  // webpack 使用 DefinePlugin 或 EnvironmentPlugin 來設置全局變量，但這兩個 Plugin 撰寫的全局變量都是屬於顯性的，代表任何人都能從所撰寫的位置得知這一個全局變量, 因為 DefinePlugin 有著不直覺的設計，這才有了後來的 EnvironmentPlugin 出現
  DefinePlugin: () => {
    // 建議透過 JSON.stringify() 來完成予值, 直接使用 KEY 取得變數值
    return new webpack.DefinePlugin({
      API_URL: JSON.stringify('http://localhost:3000'),
      development: isDev,
    });
  },
  EnvironmentPlugin: () => {
    // 不用透過 JSON.stringify() 來完成予值, 必須透過 process.env.KEY 取得變數值
    return new webpack.EnvironmentPlugin({
      development: isDev,
      breakpoints: myPackage.config.breakpoints,
    });
  },
  MultiHtmlWebpackPlugins: () => {
    return htmlFiles.map(file => {
      const name = file.split('.')[0];
      return new HtmlWebpackPlugin({
        chunks: [name],
        filename: `${file}`,
        inject: 'body',
        minify: false,
        scriptLoading: 'blocking',
        template: `${PATHS.html}/${file}`,
      });
    });
  },
  WebpackProvidePlugin: () => {
    return new webpack.ProvidePlugin({
      app: resolve('src/app.js'),
    });
  },
};

module.exports = {
  pages,
  plugins,
};
