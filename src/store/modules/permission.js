import { asyncRouterMapAdmin,asyncRouterMapSeller, constantRouterMap } from '@/router'
import { getNames } from '@/utils/auth'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

// 过滤店铺无权限模块 2018/11/13
function filterStoreAuth(asyncRouterMap, storeAuthList){
  let authList = ['class_sign'],
      // 店铺无权限列表
      roles = storeAuthList.length ? storeAuthList.filter(v => { let arr = v.split('|'); return arr[1] == 1 ? false : true; }).map(v => v.split('|')[0]) : authList;

  console.log(storeAuthList, roles);

  return asyncRouterMap.filter(v => {
    let route = v.meta.roles;
    return roles.length ? route.indexOf(roles) === -1 ? true : false : true;
  });
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters = []
        //平台管理员
        if (roles.indexOf('admin') >= 0) {
          accessedRouters = asyncRouterMapAdmin
        } 
        else if(roles.indexOf('admin2') >= 0){
          console.log('---------------',roles)
          accessedRouters = filterAsyncRouter(asyncRouterMapAdmin,roles)
          // let authIndex = -1
          // for(let i=0,len=asyncRouterMapAdmin.length;i<len;i++){
          //   try{
          //     if(asyncRouterMapAdmin[i].path=='/auth'){
          //       authIndex = i
          //       asyncRouterMapAdmin.splice(authIndex,1)
          //       accessedRouters = asyncRouterMapAdmin
          //     }
          //   }catch(e){
          //     console.error(i,e,'GenerateRoutes')
          //   }
          // }
        }
        //商家
        else if (roles.indexOf('seller') >= 0) {
          accessedRouters = asyncRouterMapSeller// filterStoreAuth(asyncRouterMapSeller, roles[roles.length - 1])
        } 
        else if(roles.indexOf('seller2') >= 0){
          console.log('---------------',roles, data)
            accessedRouters = filterAsyncRouter(asyncRouterMapSeller, roles) //filterStoreAuth(asyncRouterMapSeller, roles[roles.length - 1])
            //   let authIndex = -1
            // for(let i=0,len=asyncRouterMapSeller.length;i<len;i++){
            // hbs:make some diff
            // try{
            //   if(asyncRouterMapAdmin[i].path=='/sellerAuth'){
            //     authIndex = i
            //     asyncRouterMapAdmin.splice(authIndex,1)
            //     accessedRouters = asyncRouterMapAdmin
            //   }
            // }catch(e){
            //   console.error(i,e,'GenerateRoutes')
            // }
            
            // }
        }
        // accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        console.log('accessedRouters---------------',accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
