import request from '@/utils/request'

export function upFileToken_api(data) {
  return request({
    url: '/api/v1/admin/imgkey',
    method: 'get',
    params: data
  })
}
export function changePasswordForAdmin_api(data) {
  return request({
    url: '/api/v1/admin/password',
    method: 'post',
    data
  })
}
export function changePasswordForSeller_api(data) {
  return request({
    url: '/api/v1/seller/password',
    method: 'post',
    data
  })
}