import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/views/layout/Layout'

export const constantRouterMap = [{
    path: '/login',
    component: () =>
      import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/authredirect',
    component: () =>
      import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () =>
      import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () =>
      import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'home',
    children: [{
      path: 'home',
      component: () =>
        import('@/views/aahome/index'),
      name: 'home',
      meta: {
        title: 'home',
        icon: 'dashboard',
        noCache: true
      }
    }]
  },
]

export default new Router({
  mode: 'hash', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

export let asyncRouterMapAdmin = [{
    path: '/notice',
    component: Layout,
    redirect: '/notice/index',
    meta: {
      roles: ['affiche']
    },
    children: [{
      path: 'index',
      component: () =>
        import('@/views/aanotice/index'),
      name: 'notice',
      meta: {
        title: 'notice',
        icon: 'notice',
        noCache: true,
        roles: ['affiche']
      }
    }]
  },
  {
    path: '/manageShop',
    component: Layout,
    redirect: '/manageShop/index',
    meta: {
      roles: ['store']
    },
    children: [{
      path: 'index',
      component: () =>
        import('@/views/aamanageShop/index'),
      name: 'manageShop',
      meta: {
        title: 'manageShop',
        icon: 'notice',
        noCache: true,
        roles: ['store']
      }
    }]
  },
  {
    path: '/manageSevice',
    component: Layout,
    redirect: '/manageSevice/shopServer',
    name: 'manageSevice',
    meta: {
      title: 'manageSevice',
      icon: 'notice',
      roles: ['manage']
    },
    children: [{
      path: 'shopServer',
      component: () =>
        import('@/views/aamanageSevice/shopServer'),
      name: 'shopServer',
      meta: {
        title: 'shopServer',
        noCache: true
      }
    }, {
      path: 'industryList',
      component: () =>
        import('@/views/aamanageSevice/industryList'),
      name: 'industryList',
      meta: {
        title: 'industryList',
        noCache: true
      }
    }]
  },
  {
    path: '/auth',
    component: Layout,
    redirect: '/auth/index',
    meta: {
      roles: ['auth']
    },
    children: [{
      path: 'index',
      component: () =>
        import('@/views/aaauth/index'),
      name: 'auth',
      meta: {
        title: 'auth',
        icon: 'notice',
        roles: ['auth']
      }
    }]
  },
  // { path: '*', redirect: '/404', hidden: true }
]

export let asyncRouterMapSeller = [{
    path: '/sellerGoods', //商品管理
    component: Layout,
    redirect: '/sellerGoods/index',
    meta: {
      roles: 'goods'
    },
    children: [{
      path: 'index',
      component: () =>
        import('@/views/absellerGoods/index'),
      name: 'sellerGoods',
      meta: {
        title: 'sellerGoods',
        icon: 'goods',
        noCache: true
      }
    }]
  }, {
    path: '/order', //订单管理
    component: Layout,
    redirect: '/order/rOrder',
    meta: {
      title: 'order',
      icon: 'orderlist',
      roles: 'order'
    },
    children: [{
      path: 'rOrder',
      component: () =>
        import('@/views/aborder/rOrder'),
      name: 'rOrder',
      meta: {
        title: 'order',
        noCache: true,
        icon: 'orderlist'
      }
    }]
  },
	{
	    path: '/member', //人员列表
	    component: Layout,
	    redirect: '/member/index',
	    meta: {
	      title: 'member',
	      icon: 'member',
	      roles: 'user'
	    },
	    children: [{
	      path: 'member',
	      component: () =>
	        import('@/views/member/index'),
	      name: 'member',
	      meta: {
	        title: 'member',
	        noCache: true,
	        icon: 'worker',
	
	      }
	    }]
	  },

  {
    path: '/sellerAuth', //权限管理
    component: Layout,
    redirect: '/sellerAuth/index',
    meta: {
      roles: 'auth'
    },
    children: [{
      path: 'index',
      component: () =>
        import('@/views/sellerAuth/index'),
      name: 'sellerAuth',
      meta: {
        title: 'sellerAuth',
        icon: 'auth',
        noCache: true,
      }
    }]
  },
  {
    path: '/infoManage', //运营
    component: Layout,
    redirect: '/infoManage/spec',
    meta: {
      title: 'infoManage',
      icon: 'infoM',
      roles: 'setting'
    },
    children: [{
        path: 'type', //分类信息
        component: () =>
          import('@/views/abInfoManage/type'),
        name: 'type',
        meta: {
          title: 'type',
          noCache: true
        }
      },
      {
        path: 'serverRec', //精品推荐
        component: () =>
          import('@/views/abInfoManage/serverRec'),
        name: 'serverRec',
        meta: {
          title: 'serverRec',
          noCache: true
        }
      },
      {
        path: 'banner', //首页轮播
        component: () =>
          import('@/views/abInfoManage/banner'),
        name: 'benner',
        meta: {
          title: 'banner',
          noCache: true
        }
      },
 
      {
        path: 'material', //案例推广
        component: () =>
          import('@/views/abInfoManage/material'),
        name: 'material',
        meta: {
          title: 'material',
          noCache: true
        }
      },
			{
				path: 'company', //关于公司
				component: () =>
					import('@/views/abInfoManage/company'),
				name: 'company',
				meta: {
					title: 'company',
					noCache: true
				}
			},
			{
				path: 'news', //新闻咨询
				component: () =>
					import('@/views/abInfoManage/news'),
				name: 'news',
				meta: {
					title: 'news',
					noCache: true
				}
			},

    ]
  },

]
