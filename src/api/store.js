import request from '@/utils/request';

// 店铺列表
export function getStoreList(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/store`,
        params,
      };
  
  return request(opt);
}

// 店铺详情
export function getStore(id, params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/store/${id}`,
        params,
      };
  
  return request(opt);
}

// 店铺分类列表
export function getClassList(id, params){
  let opt = {
        method: 'GET',
        url: `/api/v2/common/storeclass`,
        params,
      };
  
  return request(opt);
}

// 店铺关注
export function follow(data){
  let opt = {
        method: 'POST',
        url: `/api/v2/member/favorites`,
        data,
      };
  
  return request(opt);
}
// 店铺取消关注
export function cancelFollow(id, data){
  let opt = {
        method: 'DELETE',
        url: `/api/v2/member/favorites/${id}`,
        data,
      };
  
  return request(opt);
}