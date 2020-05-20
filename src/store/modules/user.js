import { loginByUsername,loginByAdminname, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, setStoreId, setNames, removeToken,setRoles } from '@/utils/auth'
import api from '@/api/seller'
import store from '@/store'
// import { setNames } from '../../utils/auth';

const user = {
  state: {
    // 用户身份 
    hasGetRole:'',
    hasAddRoute:false,
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    storeId: '' // 堂食 food storeId
  },

  mutations: {
    //hbs
    SET_hasAddRoute: (state, hasAddRoute) => {
      state.hasAddRoute = hasAddRoute
    },
    SET_HASGETROLE: (state, hasGetRole) => {
      state.hasGetRole = hasGetRole
    },

    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    // setStoreId(s, id){ s.storeId = id} // 堂食 food storeId 
  },

  actions: {
    addRoute({commit}){
      commit('SET_hasAddRoute', true)
    },
    // 平台登录
    /*LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          console.log('store ok', response)
          const data = response.data
          commit('SET_TOKEN', data.token)
          setToken(response.data.token)
          resolve()
        }).catch(error => {
          console.log('store no', error)
          reject(error)
        })
      })
    },
    */
    LoginByAdminname({ commit }, userInfo) {
      // const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByAdminname(userInfo).then(response => {
          const data = response
          if(data&&data.status===0){
            //把getuserinfo的事情做完
            const sessionID = data.data['token']
            commit('SET_TOKEN', sessionID)
            setToken(sessionID)
            let roles = data.data.permission
            if(data.data.is_admin===1){
              roles.push('admin')
            }else{
              roles.push('admin2')
            }
            setRoles(JSON.stringify(roles))
            resolve()
          }else{
            //接口ok，权限问题，提示登出
            return Promise.reject('error')
          }
        }).catch(error => {
          console.log('store no', error)
          reject(error)
        })
      })
    },
    // 用户名(卖家)登录
    LoginByUsername({ commit }, userInfo) {
      // const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo).then(async response => {
          const data = response
          console.log('login --', data)
          if(data&&data.status===0){
          // if(data&&data.status===200){
            //把getuserinfo的事情做完
            const sessionID = data.data['token']
            commit('SET_TOKEN', sessionID)
            // commit('setStoreId', data.data['store_id']) // 堂食 food storeId
            setToken(sessionID)
            // setStoreId(data.data['store_id']) // 存堂食 food storeId
            let roles = data.data.permission
            if(data.data.is_admin===1){
              roles.push('seller')
            }else{
              roles.push('seller2')
            }
            // roles.push(data.data.module_list); // 存店铺权限列表 2018/11/13
            setRoles(JSON.stringify(roles))
            
            // 签到模块名词修改
            // console.log('module_list : ', data.data.module_list, data.data.module_list.indexOf("class_sign|1"));
            // if( data.data.module_list.indexOf("class_sign|1") !== -1 ){
            //   let res = await api.getNames(null, this);
            //   console.log('sign edit name: ', res.data);
            //   setNames(res.data);
            // }


            resolve()
          }else{
            //接口ok，权限问题，提示登出
            return Promise.reject('error')
          }
        }).catch(error => {
          console.log('store no', error)
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data

          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }

          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
