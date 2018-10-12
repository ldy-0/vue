import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','user']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  // 首页
  {
    path: '',
    component: Layout,
    redirect: 'home',
    children: [{
      path: 'home',
      component: () => import('@/views/aahome/index'),
      name: 'home',
      meta: { title: 'home', icon: 'dashboard', noCache: true }
    }]
  },
  //maijia
  //pt
]

export default new Router({
  mode: 'hash', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export let asyncRouterMapAdmin = [
  // {
  //   path: '/goods',
  //   component: Layout,
  //   redirect: '/goods/index',
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/aagoods/index'),
  //     name: 'goods',
  //     meta: { title: 'goods', icon: 'goods', noCache: true }
  //   }]
  // },
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/index',
    meta: {roles:['affiche']},
    children: [{
      path: 'index',
      component: () => import('@/views/aanotice/index'),
      name: 'notice',
      meta: { title: 'notice', icon: 'notice', noCache: true ,roles:['affiche']}
    }]
  },
  {
    path: '/manageShop',
    component: Layout,
    redirect: '/manageShop/index',
    meta: {roles:['store']},
    children: [{
      path: 'index',
      component: () => import('@/views/aamanageShop/index'),
      name: 'manageShop',
      meta: { title: 'manageShop', icon: 'notice', noCache: true,roles:['store']} 
    }]
  },
  {
    path: '/manageSevice',
    component: Layout,
    redirect: '/manageSevice/shopServer',
    name:'manageSevice',
    meta: { title: 'manageSevice', icon: 'notice',roles:['manage']},
    children: [
      {
        path: 'shopServer', 
        component: () => import('@/views/aamanageSevice/shopServer'),
        name: 'shopServer',
        meta: { title: 'shopServer', noCache: true }
      },{
        path: 'flowPackages', 
        component: () => import('@/views/aamanageSevice/flowPackages'),
        name: 'flowPackages',
        meta: { title: 'flowPackages', noCache: true }
      },{
        path: 'industryList', 
        component: () => import('@/views/aamanageSevice/industryList'),
        name: 'industryList',
        meta: { title: 'industryList', noCache: true }
      }
    ]
  },
  {
    path: '/auth',
    component: Layout,
    redirect: '/auth/index',
    meta: { roles:['auth']},
    children: [{
      path: 'index',
      component: () => import('@/views/aaauth/index'),
      name: 'auth',
      meta: { title: 'auth', icon: 'notice' ,roles:['auth']}
    }]
  },
  // { path: '*', redirect: '/404', hidden: true }
]

export let asyncRouterMapSeller = [
  // {
  //   path: '/sellerGoods',
  //   component: Layout,
  //   redirect: '/sellerGoods/index',
  //   meta:{roles:'goods'},
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/absellerGoods/index'),
  //     name: 'sellerGoods',
  //     meta: { title: 'sellerGoods', icon: 'goods', noCache: true }
  //   }]
  // },
  // {
  //   path: '/order',
  //   component: Layout,
  //   redirect: '/order/rOrder',
  //   meta: { title: 'order', icon: 'goods',roles:'order'},
  //   children: [{
  //     path: 'rOrder',
  //     component: () => import('@/views/aborder/rOrder'),
  //     name: 'rOrder',
  //     meta: { title: 'rOrder', noCache: true }
  //   },{
  //     path: 'vOrder',
  //     component: () => import('@/views/aborder/vOrder'),
  //     name: 'vOrder',
  //     meta: { title: 'vOrder', noCache: true }
  //   }]
  // },
  // {
  //   path: '/return',
  //   component: Layout,
  //   redirect: '/return/rReturn',
  //   meta: { title: 'return', icon: 'goods'},
  //   children: [{
  //     path: 'rReturn', 
  //     component: () => import('@/views/abreturn/rReturn'),
  //     name: 'rReturn',
  //     meta: { title: 'rReturn', noCache: true }
  //   },{
  //     path: 'vReturn',
  //     component: () => import('@/views/abreturn/vReturn'),
  //     name: 'vReturn',
  //     meta: { title: 'vReturn', noCache: true }
  //   }]
  // },
  // {
  //   path: '/appointment',
  //   component: Layout,
  //   redirect: '/appointment/index',
  //   meta: { roles:'appointment'},
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/abappointment/index'),
  //     name: 'appointment',
  //     meta: { title: 'appointment', icon: 'goods', noCache: true }
  //   }]
  // },
  // {
  //   path: '/coupon',
  //   component: Layout,
  //   meta: { roles:'coupon'},
  //   redirect: '/coupon/index',
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/abcoupon/index'),
  //     name: 'coupon',
  //     meta: { title: 'coupon', icon: 'goods', noCache: true }
  //   }]
  // },
  // {
  //   path: '/server',
  //   component: layout,
  //   redirect: '/server/serverbanner',
  //   meta: { title: 'server', icon: 'goods',roles:'manage'},
  //   children: [{
  //     path: 'serverbanner',
  //     component: () => import('@/views/abserver/serverbanner'),
  //     name: 'serverbanner',
  //     meta: { title: 'serverbanner',  nocache: true }
  //   },{
  //     path: 'serverenrty',
  //     component: () => import('@/views/abserver/serverenrty'),
  //     name: 'serverenrty',
  //     meta: { title: 'serverenrty',  nocache: true }
  //   },{
  //     path: 'serverrec',
  //     component: () => import('@/views/abserver/serverrec'),
  //     name: 'serverrec',
  //     meta: { title: 'serverrec',  nocache: true }
  //   },{
  //     path: 'serveract',
  //     component: () => import('@/views/abserver/serveract'),
  //     name: 'serveract',
  //     meta: { title: 'serveract',  nocache: true }
  //   },{
  //     path: 'servershop',
  //     component: () => import('@/views/abserver/servershop'),
  //     name: 'servershop',
  //     meta: { title: 'servershop',  nocache: true }
  //   },{
  //     path: 'serverallbuy',
  //     component: () => import('@/views/abserver/serverallbuy'),
  //     name: 'serverallbuy',
  //     meta: { title: 'serverallbuy',  nocache: true }
  //   },{
  //     path: 'serverkill',
  //     component: () => import('@/views/abserver/serverkill'),
  //     name: 'serverkill',
  //     meta: { title: 'serverkill',  nocache: true }
  //   },{
  //     path: 'serverschool',
  //     component: () => import('@/views/abserver/serverSchool'),
  //     name: 'serverSchool',
  //     meta: { title: 'serverSchool',  noCache: true }
  //   },{
  //     path: 'serverGetFlow',
  //     component: () => import('@/views/abserver/serverGetFlow'),
  //     name: 'serverGetFlow',
  //     meta: { title: 'serverGetFlow',  noCache: true }
  //   },{
  //     path: '/serverActivity',
  //     component: () => import('@/views/abserver/serverActivity/index'),
  //     meta: { title: 'serverActivity' },
  //     children: [{
  //       path: 'distribution',
  //       component: () => import('@/views/abserver/serverActivity/distribution'),
  //       name: 'distribution',
  //       meta: { title: 'distribution', noCache: true }
  //     },{
  //       path: 'vote',
  //       component: () => import('@/views/abserver/serverActivity/vote'),
  //       name: 'vote',
  //       meta: { title: 'vote', noCache: true }
  //     }]
  //   }]
  // },
  // {
  //   path: '/sellerAuth',
  //   component: Layout,
  //   redirect: '/sellerAuth/index',
  //   meta: { roles:'auth'},
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/absellerAuth/index'),
  //     name: 'sellerAuth',
  //     meta: { title: 'sellerAuth', icon: 'goods', noCache: true }
  //   }]
  // },
  {
    path: '/design',
    component: Layout,
    // redirect: '/sellerAuth/index',
    meta: { title:'design', icon: 'goods', roles: 'design' },
    children: [{
        path: 'design',
        // component: () => import('@/views/design/design'),
        component: () => import('@/views/goodsList/list'),
        name: 'designList',
        meta: { title: 'designList', category: '设计师', noCache: true }
      },
      {
        path: 'yijuxueyuan',
        component: () => import('@/views/design/yiju'),
        // component: () => import('@/views/goodsList/list'),
        name: 'yijuxueyuan',
        meta: { title: 'design_yijuxueyuan', category: '设计师+', noCache: true }
      },
      {
        path: 'class',
        component: () => import('@/views/classify/class'),
        name: 'class',
        meta: { title: 'classSet', category: '设计师+', noCache: true }
      }
    ]
  },
  {
    path: '/banbao',
    component: Layout,
    // redirect: '/sellerAuth/index',
    meta: { title:'banbao', icon: 'goods', roles: 'bb' },
    children: [{
        path: 'list',
        component: () => import('@/views/banbao/list'),
        name: 'list',
        meta: { title: 'banbao', noCache: true }
      },
      {
        path: 'detail',
        component: () => import('@/views/banbao/detail'),
        name: 'detail',
        meta: { title: 'banbaoDetail', noCache: true }
      },
    ]
  },
  {
    path: '/yijuguanjia',
    component: Layout,
    // redirect: '/sellerAuth/index',
    meta: { title:'yijuguanjia', icon: 'goods', roles: 'gj' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/goodsList/list'),
        name: '易居管家-list',
        meta: { title: 'yijuguanjia', category: '易居管家', noCache: true }
      },
      {
        path: 'class',
        component: () => import('@/views/classify/class'),
        name: '易居管家-class',
        meta: { title: 'classset', category: '易居管家', noCache: true }
      },
    ]
  },
  {
    path: '/zhengju',
    component: Layout,
    // redirect: '/sellerAuth/index',
    meta: { title:'zhengju', icon: 'goods', roles: 'zj' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/goodsList/list'),
        name: '整居定制-list',
        meta: { title: 'zhengju', category: '整居定制', noCache: true }
      },
      {
        path: 'class',
        component: () => import('@/views/classify/class'),
        name: '整居定制-class',
        meta: { title: 'classset', category: '整居定制', noCache: true }
      },
    ]
  },
  {
    path: '/jicheng',
    component: Layout,
    // redirect: '/sellerAuth/index',
    meta: { title:'jicheng', icon: 'goods', roles: 'jc' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/goodsList/list'),
        name: '集成暖通-list',
        meta: { title: 'jicheng', category: '集成暖通', noCache: true }
      },
      {
        path: 'class',
        component: () => import('@/views/classify/class'),
        name: '集成暖通-class',
        meta: { title: 'classset', category: '集成暖通', noCache: true }
      },
      {
        path: 'setting',
        component: () => import('@/views/setting/form'),
        name: '集成暖通-setting',
        meta: { title: 'dingjin', category: '集成暖通', noCache: true }
      },
    ]
  },
  {
    path: '/zhucai',
    component: Layout,
    // redirect: '/sellerAuth/index',
    meta: { title:'zhucai', icon: 'goods', roles: 'zc' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/goodsList/list'),
        name: '主材选购-list',
        meta: { title: 'zhucai', category: '主材选购', noCache: true }
      },
      {
        path: 'class',
        component: () => import('@/views/classify/class'),
        name: '主材选购-class',
        meta: { title: 'classset', category: '主材选购', noCache: true }
      },
      {
        path: 'setting',
        component: () => import('@/views/setting/form'),
        name: '主材选购-setting',
        meta: { title: 'serverSetting', category: '主材选购', noCache: true }
      },
    ]
  },
  {
    path: '/jiaju',
    component: Layout,
    // redirect: '/sellerAuth/index',
    meta: { title:'jiaju', icon: 'goods', roles: 'jj' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/goodsList/list'),
        name: '家具选购-list',
        meta: { title: 'jiaju', category: '家具选购', noCache: true }
      },
      {
        path: 'class',
        component: () => import('@/views/classify/class'),
        name: '家具选购-class',
        meta: { title: 'classset', category: '家具选购', noCache: true }
      },
      {
        path: 'setting',
        component: () => import('@/views/setting/form'),
        name: '家具选购-setting',
        meta: { title: 'serverSetting', category: '家具选购', noCache: true }
      },
    ]
  },
  {
    path: '',
    component: Layout,
    // redirect: '/sellerAuth/index',
    meta: { title:'haiwai', icon: 'goods', roles: 'hw' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/goodsList/list'),
        name: '易居海外-list',
        meta: { title: 'haiwai', category: '易居海外', noCache: true }
      },
      {
        path: 'class',
        component: () => import('@/views/classify/class'),
        name: '易居海外-class',
        meta: { title: 'classset', category: '易居海外', noCache: true }
      },
    ]
  },
  {
    path: '/order',
    component: Layout,
    // redirect: '/sellerAuth/index',
    meta: { title:'order', icon: 'goods', roles: 'order' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/list/list'),
        name: 'orderList',
        meta: { title: 'orderList', icon: 'goods', category: 'order', noCache: true }
      },
    ]
  },
  {
    path: '/afterService',
    component: Layout,
    // redirect: '/sellerAuth/index',
    meta: { title:'afterService', icon: 'goods', roles: 'afterService' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/list/list'),
        name: 'afterService',
        meta: { title: 'afterService', icon: 'goods', category: 'afterService', noCache: true }
      },
    ]
  },
  {
    path: '/user',
    component: Layout,
    // redirect: '/sellerAuth/index',
    meta: { title:'user', icon: 'goods', roles: 'user' },
    children: [
      {
        path: 'user',
        component: () => import('@/views/list/list'),
        name: 'userList',
        meta: { title: 'userList', icon: 'goods', category: 'user', noCache: true }
      },
    ]
  },
  {
    path: '/assess',
    component: Layout,
    // redirect: '/sellerAuth/index',
    meta: { title:'assess', icon: 'goods', roles: 'assess' },
    children: [
      {
        path: 'assess',
        component: () => import('@/views/list/list'),
        name: 'assessList',
        meta: { title: 'assessList', icon: 'goods', category: 'assess', noCache: true }
      },
      // {
      //   path: 'auditing',
      //   component: () => import('@/views/list/list'),
      //   name: 'auditing',
      //   meta: { title: 'auditing', category: 'auditing', noCache: true }
      // },
    ]
  },
  {
    path: '/server',
    component: Layout,
    redirect: '/server/serverBanner',
    meta: { title: 'server', icon: 'goods', roles:'server'},
    children: [
      {
        path: 'serverBanner',
        component: () => import('@/views/server/banner/banner'),
        name: 'serverBanner',
        meta: { title: 'serverBanner',  noCache: true }
      },
      {
        path: 'setting',
        component: () => import('@/views/setting/form'),
        name: 'help',
        meta: { title: 'help', category: 'help', noCache: true }
      },
      {
        path: 'authorize',
        component: () => import('@/views/list/list'),
        name: 'authorize',
        meta: { title: 'authorize', category: 'authorize', noCache: true }
      },
    ]
  },
  // {
  //   path: '/signIn',
  //   component: Layout,
  //   // redirct: '/signIn/index',
  //   meta: { title: 'signIn', icon: 'goods' },
  //   children: [
  //     {
  //       path: 'coulse',
  //       component: () => import('@/views/signIn/coulse'),
  //       name: 'coulse',
  //       meta: { title: 'coulse', }
  //     },
  //     { path: 'signin',
  //       component: () => import('@/views/signIn/signin'),
  //       name: 'signin',
  //       meta: { title: 'signin' }
  //     },
  //     { path: 'address',
  //       component: () => import('@/views/signIn/address'),
  //       name: 'address',
  //       meta: { title: 'address' }
  //     },
  //     {
  //       path: 'student',
  //       component: () => import('@/views/signIn/student'),
  //       // name: 'studen',
  //       meta: { title: 'student' }
  //     },
  //     { path: 'appointment',
  //       component: () => import('@/views/signIn/appointment'),
  //       name: 'signIn_appointment',
  //       meta: { title: 'appointment' }
  //     },
  //     { path: 'addGoods',
  //       component: () => import('@/views/signIn/goods'),
  //       name: 'appointment',
  //       meta: { title: 'addGoods' }
  //     },
  //   ]
  // }
]
  // {
  //   path: '/dashboard',
  //   component: Layout,
  //   redirect: '/dashboard/index',
  //   children: [{
  //     path: 'dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     name: 'dashboard',
  //     meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
  //   }]
  // },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   redirect: '/documentation/index',
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/documentation/index'),
  //     name: 'documentation',
  //     meta: { title: 'documentation', icon: 'documentation', noCache: true }
  //   }]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/guide/index'),
  //     name: 'guide',
  //     meta: { title: 'guide', icon: 'guide', noCache: true }
  //   }]
  // },
  // //---------------------------------------------------------------------------------
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/index',
  //   alwaysShow: true, // will always show the root menu
  //   meta: {
  //     title: 'permission',
  //     icon: 'lock',
  //     roles: ['admin', 'user'] // you can set roles in root nav
  //   },
  //   children: [{
  //     path: 'page',
  //     component: () => import('@/views/permission/page'),
  //     name: 'pagePermission',
  //     meta: {
  //       title: 'pagePermission',
  //       roles: ['admin'] // or you can only set roles in sub nav
  //     }
  //   }, {
  //     path: 'directive',
  //     component: () => import('@/views/permission/directive'),
  //     name: 'directivePermission',
  //     meta: {
  //       title: 'directivePermission'
  //       // if do not set roles, means: this page does not require permission
  //     }
  //   }]
  // },

  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/svg-icons/index'),
  //     name: 'icons',
  //     meta: { title: 'icons', icon: 'icon', noCache: true }
  //   }]
  // },

  // {
  //   path: '/components',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'component-demo',
  //   meta: {
  //     title: 'components',
  //     icon: 'component'
  //   },
  //   children: [
  //     { path: 'tinymce', component: () => import('@/views/components-demo/tinymce'), name: 'tinymce-demo', meta: { title: 'tinymce' }},
  //     { path: 'markdown', component: () => import('@/views/components-demo/markdown'), name: 'markdown-demo', meta: { title: 'markdown' }},
  //     // { path: 'json-user', component: () => import('@/views/components-demo/jsonuser'), name: 'jsonuser-demo', meta: { title: 'jsonuser' }},
  //     { path: 'splitpane', component: () => import('@/views/components-demo/splitpane'), name: 'splitpane-demo', meta: { title: 'splitPane' }},
  //     { path: 'avatar-upload', component: () => import('@/views/components-demo/avatarUpload'), name: 'avatarUpload-demo', meta: { title: 'avatarUpload' }},
  //     { path: 'dropzone', component: () => import('@/views/components-demo/dropzone'), name: 'dropzone-demo', meta: { title: 'dropzone' }},
  //     { path: 'sticky', component: () => import('@/views/components-demo/sticky'), name: 'sticky-demo', meta: { title: 'sticky' }},
  //     { path: 'count-to', component: () => import('@/views/components-demo/countTo'), name: 'countTo-demo', meta: { title: 'countTo' }},
  //     { path: 'mixin', component: () => import('@/views/components-demo/mixin'), name: 'componentMixin-demo', meta: { title: 'componentMixin' }},
  //     { path: 'back-to-top', component: () => import('@/views/components-demo/backToTop'), name: 'backToTop-demo', meta: { title: 'backToTop' }},
  //     { path: 'drag-dialog', component: () => import('@/views/components-demo/dragDialog'), name: 'dragDialog-demo', meta: { title: 'dragDialog' }},
  //     { path: 'dnd-list', component: () => import('@/views/components-demo/dndList'), name: 'dndList-demo', meta: { title: 'dndList' }},
  //     { path: 'drag-kanban', component: () => import('@/views/components-demo/dragKanban'), name: 'dragKanban-demo', meta: { title: 'dragKanban' }}
  //   ]
  // },

  // {
  //   path: '/charts',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'charts',
  //   meta: {
  //     title: 'charts',
  //     icon: 'chart'
  //   },
  //   children: [
  //     { path: 'keyboard', component: () => import('@/views/charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
  //     { path: 'line', component: () => import('@/views/charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
  //     { path: 'mixchart', component: () => import('@/views/charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
  //   ]
  // },

  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/tab/index'),
  //     name: 'tab',
  //     meta: { title: 'tab', icon: 'tab' }
  //   }]
  // },

  // {
  //   path: '/table',
  //   component: Layout,
  //   redirect: '/table/complex-table',
  //   name: 'table',
  //   meta: {
  //     title: 'Table',
  //     icon: 'table'
  //   },
  //   children: [
  //     { path: 'dynamic-table', component: () => import('@/views/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: 'dynamicTable' }},
  //     { path: 'drag-table', component: () => import('@/views/table/dragTable'), name: 'dragTable', meta: { title: 'dragTable' }},
  //     { path: 'inline-edit-table', component: () => import('@/views/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'inlineEditTable' }},
  //     { path: 'tree-table', component: () => import('@/views/table/treeTable/treeTable'), name: 'treeTableDemo', meta: { title: 'treeTable' }},
  //     { path: 'custom-tree-table', component: () => import('@/views/table/treeTable/customTreeTable'), name: 'customTreeTableDemo', meta: { title: 'customTreeTable' }},
  //     { path: 'complex-table', component: () => import('@/views/table/complexTable'), name: 'complexTable', meta: { title: 'complexTable' }}
  //   ]
  // },

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'example',
  //   meta: {
  //     title: 'example',
  //     icon: 'example'
  //   },
  //   children: [
  //     { path: 'create', component: () => import('@/views/example/create'), name: 'createArticle', meta: { title: 'createArticle', icon: 'edit' }},
  //     { path: 'edit/:id(\\d+)', component: () => import('@/views/example/edit'), name: 'editArticle', meta: { title: 'editArticle', noCache: true }, hidden: true },
  //     { path: 'list', component: () => import('@/views/example/list'), name: 'articleList', meta: { title: 'articleList', icon: 'list' }}
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/bar/profile',
  //   name: 'nested',
  //   meta: {
  //     title: 'nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: '/nested/bar', // Must write the full path
  //       component: () => import('@/views/nested/bar/index'), // Parent router-view
  //       name: 'bar',
  //       meta: { title: 'bar' },
  //       children: [
  //         {
  //           path: 'profile',
  //           component: () => import('@/views/nested/bar/profile'),
  //           name: 'bar-profile',
  //           meta: { title: 'barProfile' }
  //         },
  //         {
  //           path: 'posts',
  //           component: () => import('@/views/nested/bar/posts'),
  //           name: 'bar-posts',
  //           meta: { title: 'barPosts' }
  //         }
  //       ]
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'errorPages',
  //   meta: {
  //     title: 'errorPages',
  //     icon: '404'
  //   },
  //   children: [
  //     { path: '401', component: () => import('@/views/errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
  //     { path: '404', component: () => import('@/views/errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [{ path: 'log', component: () => import('@/views/errorLog/index'), name: 'errorLog', meta: { title: 'errorLog', icon: 'bug' }}]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'excel',
  //   meta: {
  //     title: 'excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     { path: 'export-excel', component: () => import('@/views/excel/exportExcel'), name: 'exportExcel', meta: { title: 'exportExcel' }},
  //     { path: 'export-selected-excel', component: () => import('@/views/excel/selectExcel'), name: 'selectExcel', meta: { title: 'selectExcel' }},
  //     { path: 'upload-excel', component: () => import('@/views/excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'uploadExcel' }}
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   meta: { title: 'zip', icon: 'zip' },
  //   children: [{ path: 'download', component: () => import('@/views/zip/index'), name: 'exportZip', meta: { title: 'exportZip' }}]
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [{ path: 'index', component: () => import('@/views/theme/index'), name: 'theme', meta: { title: 'theme', icon: 'theme' }}]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [{ path: 'index', component: () => import('@/views/clipboard/index'), name: 'clipboardDemo', meta: { title: 'clipboardDemo', icon: 'clipboard' }}]
  // },

  // {
  //   path: '/i18n',
  //   component: Layout,
  //   children: [{ path: 'index', component: () => import('@/views/i18n-demo/index'), name: 'i18n', meta: { title: 'i18n', icon: 'international' }}]
  // },

