import request from '@/utils/request';

export function getAddressList(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/address`,
        params,
      };
  
  return request(opt);
}

export function addAddress(data){
  let opt = {
        method: 'POST',
        url: `/api/v2/member/address`,
        data,
      };
  
  return request(opt);
}

export function editAddress(id, data){
  let opt = {
        method: 'PUT',
        url: `/api/v2/member/address/${id}`,
        data,
      };
  
  return request(opt);
}

export function deleteAddress(id, data){
  let opt = {
        method: 'DELETE',
        url: `/api/v2/member/address/${id}`,
        data,
      };
  
  return request(opt);
}

export function getArea(params){
  let opt = {
        method: 'GET',
        url: `/api/v2/member/area`,
        params,
      };
  
  return request(opt);
}