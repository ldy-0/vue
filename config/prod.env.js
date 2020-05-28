let isProd = /prod$/.test(process.env.npm_lifecycle_event);

module.exports = {
  //正式服上线配置以实际项目为准
  NODE_ENV: '"production"',
  ENV_CONFIG: '"prod"',
  BASE_API: isProd ? '"https://www.healthplatform.xyz/"' : '"https://test17.healthsource.com.cn/"',
  ITEM_NAME: '"健德购购管理平台"', //登录页项目名称
  SMS_close: '"2"' //是否使用短信验证码更改密码 1为使用
};
