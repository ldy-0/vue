import { asyncRouterMapAdmin,asyncRouterMapSeller, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.indexOf(route.meta.roles) !== -1;
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
  const accessedRouters = asyncRouterMap.filter((route, index) => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
	
        if(!route.children.length) return false;
      }

      return true
    }

    return false
  });

  return accessedRouters;
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    routeList: [],
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
      state.routeList = asyncRouterMapSeller;
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
          accessedRouters = filterAsyncRouter(asyncRouterMapAdmin,roles)
        }
        //商家
        else if (roles.indexOf('seller') >= 0) {
          accessedRouters = asyncRouterMapSeller
        } 
        else if(roles.indexOf('seller2') >= 0){
          accessedRouters = filterAsyncRouter(asyncRouterMapSeller,roles)
        }
        // accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
