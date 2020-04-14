# 使用说明

## 目录结构
* 本项目已经为你生成了一个完整的开发框架，提供了涵盖中后台开发的各类功能和坑位，下面是整个项目的目录结构
```
├── build                      // 构建相关
├── config                     // 配置相关
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题 字体等静态资源
│   ├── components             // 全局公用组件
│   ├── directive              // 全局指令
│   ├── filters                // 全局 filter
│   ├── icons                  // 项目所有 svg icons
│   ├── lang                   // 国际化 language
│   ├── mock                   // 项目mock 模拟数据
│   ├── router                 // 路由
│   ├── store                  // 全局 store管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── vendor                 // 公用vendor
│   ├── views                  // views 所有页面
│   ├── App.vue                // 入口页面
│   ├── main.js                // 入口文件 加载组件 初始化等
│   └── permission.js          // 权限管理
├── static                     // 第三方不打包资源
│   └── Tinymce                // 富文本
├── .babelrc                   // babel-loader 配置
├── .eslintrc.js               // eslint 配置项
├── .gitignore                 // git 忽略项
├── .travis.yml                // 自动化CI配置
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json
```

## 安装
* 安装依赖 `npm install`
  > 强烈建议不要用直接使用 cnpm 安装，会有各种诡异的 bug，可以通过重新指定 registry 来解决 npm 安装速度慢的问题。[解决方案](https://github.com/PanJiaChen/vue-element-admin/issues/24)
  * `npm install --registry=https://registry.npm.taobao.org`

## running 
 - 本地运行: `npm run dev`
 - 构建: `npm run build:prod`
> 构建包时修改以下文件
> 1. config/prod.env.js 修改域名

## doc

[版本信息](http://118.31.48.192/minivictory/Health/tree/admin/dev/doc/version.md)

## 快速开发须知
> 开发本项目时需根据设计稿提前确定好所需的业务模块 ，配置相应的业务权限
* [配置文档](https://docs.qq.com/doc/DUkZzR3FKYWxZRkN1)

## 发布项目&更新线上代码
 * 执行`npm run build:prod` 命令后在项目目录中会生成一个dist文件，该dist文件中的内容即是我们发布线上的代码包
 * 通过ftp方式上传代码包到服务器上[教程文档](https://docs.qq.com/doc/Dc3RMUEZjY2xrQXNv)

平台账号：P00008
平台密码：123456789