import request from '@/utils/request'

export function loginByUsername(data) {
  console.log('----------login api ---------')
  return request({
    url: '/api/v2/seller/login',
    method: 'post',
    data
  })
}
export function loginByAdminname(data) {
  return request({
    url: '/api/v2/admin/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/api/v2/admin/logout',
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

export function getSellerAuth() {
  return request({
    url: '/api/v2/seller/auth',
    method: 'get',
  })
}
export function getAdminAuth() {
  return request({
    url: '/api/v2/admin/auth',
    method: 'get',
  })
}

