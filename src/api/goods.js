import request from '@/utils/request';

// 商品列表
export function getGoodsList(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/goodscommon`,
        params,
      };
  
  return request(opt);
}
export function getGoods(id, params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/goodscommon/${id}`,
        params,
      };
  
  return request(opt);
}

// 获取商品Id
export function getGoodsId(id, params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/goodscommon/${id}/edit`,
        params,
      };
  
  return request(opt);
}

// 分类列表
export function getClassList(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/storegc`,
        params,
      };
  
  return request(opt);
}

// vip解读列表
export function getReadGoodsList(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/goodsexplain`,
        params,
      };
  
  return request(opt);
}
// 记录查看vip解读
export function recordReadView(id, params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/goodsexplain/${id}`,
        params,
      };
  
  return request(opt);
}
// 记录分享vip解读
export function recordReadShare(id, params){
  let opt = {
        method: 'PUT',
        url: `/api/v2/member/goodsexplain/${id}`,
        params,
      };
  
  return request(opt);
}

// 秒杀
export function getSeckillList(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/seckill`,
        params,
      };
  
  return request(opt);
}

// 团购
export function getGroupList(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/goodsgroupbuy/1/edit`,
        params,
      };
  
  return request(opt);
}

// 砍价
export function getBargainList(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/cutgoods`,
        params,
      };
  
  return request(opt);
}

// 评论
export function getCommentList(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/goodsevaluate`,
        params,
      };
  
  return request(opt);
}

// 收藏
export function collectGoods(data){
  let opt = {
        method: 'POST',
        url: `/api/v2/member/enshrine`,
        data,
      };
  
  return request(opt);
}
// 取消收藏
export function unCollectGoods(id, data){
  let opt = {
        method: 'DELETE',
        url: `/api/v2/member/enshrine/${id}`,
        data,
      };
  
  return request(opt);
}

// 购物车
export function getShoppingCartList(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/cart`,
        params,
      };
  
  return request(opt);
}
export function addCart(data){
  let opt = {
        method: 'POST',
        url: `/api/v2/member/cart`,
        data,
      };
  
  return request(opt);
}
export function changeCart(id, data){
  let opt = {
        method: 'PUT',
        url: `/api/v2/member/cart/${id}`,
        data,
      };
  
  return request(opt);
}
export function deleteCart(id, data){
  let opt = {
        method: 'DELETE',
        url: `/api/v2/member/cart/${id}`,
        data,
      };
  
  return request(opt);
}