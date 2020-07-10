import request from '@/utils/request';

// 结算
export function checkout(data){
  let opt = {
        method: 'POST',
        url: `/api/v2/member/checkout`,
        data,
      };

  return request(opt);
}

// 提交
export function submit(data){
  let opt = {
        method: 'POST',
        url: `/api/v2/member/order`,
        data,
      };

  return request(opt);
}
// 修改
export function change(id, data){
  let opt = {
        method: 'PUT',
        url: `/api/v2/member/orderstate/${id}`,
        data,
      };

  return request(opt);
}
// 支付
export function pay(sn, data){
  let opt = {
        method: 'PUT',
        url: `/api/v2/member/order/${sn}`,
        data,
      };

  return request(opt);
}
// 评价
export function evaluate(data){
  let opt = {
        method: 'POST',
        url: `/api/v2/member/goodsevaluate`,
        data,
      };

  return request(opt);
}

// 普通订单列表
export function getOrderList(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/order`,
        params,
      };

  return request(opt);
}

// 获取订单详情
export function getOrder(id, params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/order/${id}`,
        params,
      };
  
  return request(opt);
}

// 获取物流
export function getLogistic(data){
  let opt = {
        method: 'POST',
        url: `/api/v2/member/shipping`,
        data,
      };

  return request(opt);
}

// 获取售后列表
export function getRefundList(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/refundreturn`,
        params,
      };

  return request(opt);
}
// 获取售后详情
export function getRefund(id, params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/refundreturn/${id}`,
        params,
      };

  return request(opt);
}
// 获取退货地址
export function getRefundAddress(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/refundreturn/create`,
        params,
      };

  return request(opt);
}
// 申请售后
export function refund(data){
  let opt = {
        method: 'POST',
        url: `/api/v2/member/refundreturn`,
        data,
      };

  return request(opt);
}
// 取消售后
export function cancelRefund(id, data){
  let opt = {
        method: 'PUT',
        url: `/api/v2/member/refundreturn/${id}`,
        data,
      };

  return request(opt);
}

// 秒杀订单
export function getSeckillList(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/myseckill`,
        params,
      };

  return request(opt);
}

// 团购订单
export function getGroupList(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/mygroupbuy`,
        params,
      };

  return request(opt);
}
// 团详情
export function getGroupDetail(id, params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/mygroupbuy/${id}`,
        params,
      };

  return request(opt);
}

// 砍价订单
export function getBargainList(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/cutprice`,
        params,
      };

  return request(opt);
}