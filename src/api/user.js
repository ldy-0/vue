import request from '@/utils/request';

// 登陆 
export function login(data){
  let opt = {
        method: 'POST',
        url: `/api/v2/member/login`,
        data,
      };
  
  return request(opt);
}

// 推荐码
export function getSystemInviter(){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/inviter`,
      };
  
  return request(opt);
}

// 用户
export function getUser(){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/memberinfo`,
      };
  
  return request(opt);
}

// 获取积分预收益
export function getPoint(){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/point/1`,
      };
  
  return request(opt);
}

export function getPointList(params, type){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/point`,
        params,
      };

  if(type === 'pre') opt.url = `/api/v2/member/point/1/edit`; 

  return request(opt);
}

// 获取资产预收益
export function getAsset(){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/assets/1`,
      };
  
  return request(opt);
}

// 资产明细
export function getAssetList(params, type){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/assets`,
        params,
      };

  if(type === 'pre') opt.url = `/api/v2/member/assets/create`;
  
  return request(opt);
}

// 获取余额预收益
export function getDistribution(){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/memberwithdraw/1`,
      };
  
  return request(opt);
}

// 余额收益/预收益明细
export function getDistributionList(params, type){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/memberwithdraw/create`,
        params,
      };

  if(type === 'pre') opt.url = `/api/v2/member/memberwithdraw/search`; 

  return request(opt);
}

// 下级列表
export function getChildren(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/memberwithdraw/1/edit`,
        params,
      };

  return request(opt);
}

// 获取提现信息
export function getWithdraw(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/memberwithdraw/1`,
        params,
      };

  return request(opt);
}

// 获取余额提现列表
export function getDistributionWithdrawList(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/memberwithdraw`,
        params,
      };

  return request(opt);
}

//////////////////////////////////////////////////////////////// 会员
// 申请会员
export function applyMember(data){
  let opt = {
        method: 'POST',
        url: `/api/v2/member/apply`,
        data,
      };
  
  return request(opt);
}

// 获取邀请码
export function getInviter(id){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/telephone/${id}`,
      };
  
  return request(opt);
}

// 充值德分
export function refill(){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/rcbalance/1/edit`,
      };
  
  return request(opt);
}

// 设置德分密码
export function setDscorePwd(data){
  let opt = {
        method: 'POST',
        url: `/api/v2/member/paypwd`,
        data,
      };
  
  return request(opt);
}

// 签到
export function getSign(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/signin`,
        params,
      };
  
  return request(opt);
}

export function sign(params){
  let opt = {
        method: 'POST',
        url: `/api/v2/member/signin`,
        params,
      };
  
  return request(opt);
}

// 获取微信token
export function getWxCode(params){
  let opt = {
        method: 'GET',
        url: `https://open.weixin.qq.com/connect/oauth2/authorize`,
        params,
      };
  
  return request(opt);
}