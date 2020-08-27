let isProd = /prod$/.test(process.env.npm_lifecycle_event);

module.exports = {
  //正式服上线配置以实际项目为准
  NODE_ENV: '"production"',
  ENV_CONFIG: '"prod"',
  BASE_API: isProd ? '"https://www.healthplatform.xyz/"' : '"https://test2.whweiya.cn/"',
  ITEM_NAME: '"官网后台管理"', //登录页项目名称
  SMS_close: '"2"' //是否使用短信验证码更改密码 1为使用
};
