import { param2Obj } from '@/utils'

const userMap = {
  admin: {
    code: 20000,
    roles: ['admin'],
    'X-token': 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  user: {
    roles: ['user'],
    token: 'user',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal user'
  }
}

export default {
  loginByAdminname: config => {
    return {
      status: 0,
      error: '',
      stack: null,
      data: {
        permission:['admin'],
        'X-token':'hbs-admin123-sessionID',
        is_admin:1 
      },
      pagination: {
    
      }
    }
  },
  loginByUsername: config => {
    return {
      status: 0,
      error: '',
      stack: null,
      data: {
        permission:['seller-wrong'],
        'X-token':'hbs-admin123-sessionID',
        is_admin:1 
      },
      pagination: {
    
      }
    }
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    if (userMap[token]) {
      return userMap[token]
    } else {
      return false
    }
  },
  logout: () => 'success'
}
