import request from '@/utils/request';

export function getCouponList(){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/coupon/search`,
      };
  
  return request(opt);
}

export function getStoreCouponList(id, params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/coupon/${id}`,
        params,
      };
  
  return request(opt);
}

export function receiveCoupon(data){
  let opt = {
        method: 'POST',
        url: `/api/v2/member/coupon`,
        data,
      };
  
  return request(opt);
}