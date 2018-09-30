//  删除文件 第一个参数 ：文件或文件夹名
// 第二个参数: options配置项（可选）
// 第三个参数： funtion 删除文件的回调函数
const rm = require('rimraf')
rm('./willbedelete.md',function(){
  console.log('after delete !')
})