import request from '@/utils/request'

export function loginByUsername(data) {
  console.log('----------login api ---------')
  return request({
    url: '/api/v1/seller/login',
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

//获取改密验证码
export function getVerificationCode(data) {
  return request({
    url: '/api/v1/notify/code',
    method: 'post',
    data
  })
}

//重置密码
export function resetPassword(data) {
  return request({
    url: '/api/v1/notify/reset',
    method: 'put',
    data
  })
}

