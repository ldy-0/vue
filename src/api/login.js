import request from '@/utils/request'

export function loginByUsername(data) {
  console.log('---------- /api/login.js load ---------')
  return request({
    // url: '/api/v1/seller/login',
    url: '/api/v2/seller/login',
    method: 'post',
    data
  })
}
export function loginByAdminname(data) {
  return request({
    url: '/api/v1/admin/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/api/v1/admin/logout',
    method: 'get'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

