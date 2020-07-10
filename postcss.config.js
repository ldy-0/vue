
// module.exports = {
//   plugins: {
//     'autoprefixer': {
//       overrideBrowserslist: ['Android >= 4.0', 'iOS >= 7']
//     },
//     'postcss-pxtorem': {
//       rootValue: 75,
//       propList: ['*'],
//       minPixelValue: 2
//     }
//   }

// }

module.exports = ({ file }) => {
  let rootValue
  // vant 37.5 [link](https://github.com/youzan/vant/issues/1181)
  if (file && file.dirname && file.dirname.indexOf('vant') > -1) {
    rootValue = 37.5
  } else {
    rootValue = 75
  }
  return {
    plugins: {
      'autoprefixer': {
        overrideBrowserslist: ['Android >= 4.0', 'iOS >= 7']
      },
      'postcss-pxtorem': {
        rootValue: rootValue,
        propList: ['*'],
        minPixelValue: 2
      }
    }
  }
}