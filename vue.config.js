const path = require('path');

module.exports = {
  publicPath: '/web',
  productionSourceMap: false,

  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
            args[0].title = '博伦科欣官方网站';
            return args;
        });
  },

  // configureWebpack: config => {
  //   config.plugins.push(
  //     new UglifyJsPlugin({
  //     uglifyOptions: {
  //       compress: {
  //       warnings: false,
  //       drop_debugger: true,
  //       drop_console: true,
  //       },
  //     },
  //     sourceMap: false,
  //     parallel: true,
  //     })
  //   );
  // },
}