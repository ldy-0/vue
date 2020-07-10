import request from '@/utils/request';

// 验证码
export function getSmsCode(data){
  let opt = {
        method: 'POST',
        url: `/api/v2/common/mobilecode`,
        data,
      };
  
  return request(opt);
}

// 颜色，图标配置
export function getConfig(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/common/indexconfig`,
        params,
      };
  
  return request(opt);
}

// 轮播图
export function getBanner(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/banner`,
        params,
      };
  
  return request(opt);
}

// 资产说明
export function getAsset(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/common/assets`,
        params,
      };
  
  return request(opt);
}

// 票务授权
export function getTicketAuth(data){
  let opt = {
        method: 'POST',
        url: `/api/v2/member/ticketauth`,
        data,
      };
  
  return request(opt);
}

// 获取七牛云凭证
export function getImgToken(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/common/imgkeyqiniu`,
        params,
      };
  
  return request(opt);
}

// 上传图片
export function uploadImg(data){
  let opt = {
        method: 'POST',
        url: `https://up-z2.qiniup.com/`,
        data,
      };
  
  return request(opt);
}