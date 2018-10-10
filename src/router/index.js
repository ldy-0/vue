import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
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
  // 首页
  {
    path: '',
    component: Layout,
    redirect: 'home',
    children: [{
      path: 'home',
      component: () =>
        import('@/views/home/index'),
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

export let asyncRouterMapSeller = [{
    path: '/commodityManagement', //商品管理
    component: Layout,
    redirect: '/commodityManagement/index',
    meta: {
      roles: 'commodityManagement'
    },
    children: [{
      path: 'index',
      component: () =>
        import('@/views/commodityManagement/index'),
      name: 'commodityManagement',
      meta: {
        title: 'commodityManagement',
        icon: 'goods',
        noCache: true
      }
    }]
  }, {
    path: '/orderManagement', //订单管理
    component: Layout,
    redirect: '/orderManagement/index',
    meta: {
      title: 'orderManagement',
      icon: 'orderlist',
      roles: 'orderManagement'
    },
    children: [{
      path: 'index',
      component: () =>
        import('@/views/orderManagement/index'),
      name: 'orderManagement',
      meta: {
        title: 'orderManagement',
        noCache: true,
        icon: 'orderlist'
      }
    }]
  },
	{
	    path: '/memberList', //人员列表
	    component: Layout,
	    redirect: '/memberList/index',
	    meta: {
	      title: 'memberList',
	      icon: 'member',
	      roles: 'memberList'
	    },
	    children: [{
	      path: 'memberList',
	      component: () =>
	        import('@/views/memberList/index'),
	      name: 'memberList',
	      meta: {
	        title: 'memberList',
	        noCache: true,
	        icon: 'worker',
	      }
	    }]
	  },

  {
    path: '/authorityManagement', //权限管理
    component: Layout,
    redirect: '/authorityManagement/index',
    meta: {
      roles: 'authorityManagement'
    },
    children: [{
      path: 'index',
      component: () =>
        import('@/views/authorityManagement/index'),
      name: 'authorityManagement',
      meta: {
        title: 'authorityManagement',
        icon: 'auth',
        noCache: true,
      }
    }]
  },
  {
    path: '/infoManagement', //运营
    component: Layout,
    redirect: '/infoManagement/spec',
    meta: {
      title: 'infoManagement',
      icon: 'infoM',
      roles: 'infoManagement'
    },
    children: [{
        path: 'type', //分类信息
        component: () =>
          import('@/views/infoManagement/type'),
        name: 'type',
        meta: {
          title: 'type',
          noCache: true
        }
      },
      {
        path: 'recommended', //精品推荐
        component: () =>
          import('@/views/infoManagement/recommended'),
        name: 'recommended',
        meta: {
          title: 'recommended',
          noCache: true
        }
      },
      {
        path: 'banner', //首页轮播
        component: () =>
          import('@/views/infoManagement/banner'),
        name: 'benner',
        meta: {
          title: 'banner',
          noCache: true
        }
      },
 
      {
        path: 'caseShow', //案例推广
        component: () =>
          import('@/views/infoManagement/caseShow'),
        name: 'caseShow',
        meta: {
          title: 'caseShow',
          noCache: true
        }
      },
			{
				path: 'company', //关于公司
				component: () =>
					import('@/views/infoManagement/company'),
				name: 'company',
				meta: {
					title: 'company',
					noCache: true
				}
			},
			{
				path: 'news', //新闻咨询
				component: () =>
					import('@/views/infoManagement/news'),
				name: 'news',
				meta: {
					title: 'news',
					noCache: true
				}
			},

    ]
  },

]
