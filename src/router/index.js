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
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/index',
    meta: { roles: ['affiche'] },
    children: [{
      path: 'index',
      component: () => import('@/views/aanotice/index'),
      name: 'notice',
      meta: { title: 'notice', icon: 'notice', noCache: true, roles: ['affiche'] }
    }]
  },
  {
    path: '/manageShop',
    component: Layout,
    redirect: '/manageShop/index',
    meta: { roles: ['store'] },
    children: [{
      path: 'index',
      component: () => import('@/views/aamanageShop/index'),
      name: 'manageShop',
      meta: { title: 'manageShop', icon: 'notice', noCache: true, roles: ['store'] }
    }]
  },
  {
    path: '/manageSevice',
    component: Layout,
    redirect: '/manageSevice/shopServer',
    name: 'manageSevice',
    meta: { title: 'manageSevice', icon: 'notice', roles: ['manage'] },
    children: [
      {
        path: 'shopServer',
        component: () => import('@/views/aamanageSevice/shopServer'),
        name: 'shopServer',
        meta: { title: 'shopServer', noCache: true }
      }, {
        path: 'flowPackages',
        component: () => import('@/views/aamanageSevice/flowPackages'),
        name: 'flowPackages',
        meta: { title: 'flowPackages', noCache: true }
      }, {
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
    meta: { roles: ['auth'] },
    children: [{
      path: 'index',
      component: () => import('@/views/aaauth/index'),
      name: 'auth',
      meta: { title: 'auth', icon: 'notice', roles: ['auth'] }
    }]
  },
  // {
  //   path: '/library',
  //   component: Layout,
  //   redirect: '/library/libraryList',
  //   name:'library',
  //   meta: { title: 'library', icon: 'notice',roles:['library']},
  //   children: [{
  //     path: 'libraryList',
  //     component: () => import('@/views/library/libraryList'),
  //     name: 'libraryList',
  //     meta: { title: 'libraryList', noCache: true}
  //   },
  //   {
  //     path: 'libraryClass',
  //     component: () => import('@/views/library/libraryClass'),
  //     name: 'libraryClass',
  //     meta: { title: 'library', noCache: true}
  //   }]
  // },
  // { path: '*', redirect: '/404', hidden: true }
]

export let asyncRouterMapSeller = [
  {
    path: '/sellerGoods',
    component: Layout,
    redirect: '/sellerGoods/index',
    meta: { roles: 'goods' },
    children: [{
      path: 'index',
      component: () => import('@/views/absellerGoods/index'),
      name: 'sellerGoods',
      meta: { title: 'sellerGoods', icon: 'goods', noCache: true }
    }]
  },
  // {
  //   path: '/order',
  //   component: Layout,
  //   redirect: '/order/rOrder',
  //   meta: { title: 'order', icon: 'goods', roles: 'order' },
  //   children: [{
  //     path: 'rOrder',
  //     component: () => import('@/views/aborder/rOrder'),
  //     name: 'rOrder',
  //     meta: { title: 'rOrder', noCache: true }
  //   }, {
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
  //   meta: { title: 'return', icon: 'goods',roles:'return'},
  //   children: [{
  //     path: 'rReturn',
  //     component: () => import('@/views/abreturn/rReturn'),
  //     name: 'rReturn',
  //     meta: { title: 'rReturn', noCache: true }
  //   }, {
  //     path: 'vReturn',
  //     component: () => import('@/views/abreturn/vReturn'),
  //     name: 'vReturn',
  //     meta: { title: 'vReturn', noCache: true }
  //   }]
  // },
  {
    path: '/appointment',
    component: Layout,
    redirect: '/appointment/index',
    meta: { roles: 'appointment' },
    children: [{
      path: 'index',
      component: () => import('@/views/abappointment/index'),
      name: 'appointment',
      meta: { title: 'appointment', icon: 'goods', noCache: true }
    }]
  },
	{
	    path: '/memberList', //人员列表
	    component: Layout,
	    redirect: '/memberList/index',
	    meta: {
	      roles: 'memberList'
	    },
	    children: [{
	      path: 'memberList',
	      component: () =>
	        import('@/views/memberList/index'),
	      name: 'memberList',
	      meta: {
	        title: '会员列表',
          noCache: true,
          icon: 'goods'
	      }
	    }]
    },
  {
	    path: '/authorize',
	    component: Layout,
	    // redirect: '/distribution',
	    meta: { title: 's', roles: 'authDistribution' },
	    children: [
        {
          path: 'distribution',
          component: () => import('@/views/authorize/distribution/index'),
          name: 'authDistribution',
          meta: { title: 'authDistribution', noCache: true, icon: 'goods' }
        },
        // {
        //   path: 'index',
        //   component: () => import('@/views/authorize/distribution/index'),
        //   name: 'a',
        //   meta: { title: 'authDistribution', noCache: true, icon: 'goods' }
        // },
      ]
  },
  {
    path: '/order',
    component: Layout,
    meta: { title: 'order', icon: 'goods', roles: 'order' },
    redirect: '/order/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/order/index'),
        name: 'order',
        meta: { title: 'order', noCache: true }
      },
      {
        path: 'refund',
        component: () => import('@/views/order/refund'),
        name: 'refund',
        meta: { title: 'refund', noCache: true }
      }
    ]
  },
  {
    path: '/authWorks',
    component: Layout,
    meta: { roles: 'authWorks' },
    redirect: '/authWorks/index',
    children: [{
      path: 'index',
      component: () => import('@/views/authWorks/index'),
      name: 'authWorks',
      meta: { title: 'authWorks', icon: 'goods', noCache: true }
    }]
  },
  {
    path: '/question',
    component: Layout,
    meta: { roles: 'question' },
    redirect: '/question/index',
    children: [{
      path: 'index',
      // component: () => import('@/views/abcoupon/index'),
      component: () => import('@/views/question/index'),
      name: 'question',
      meta: { title: 'question', icon: 'goods', noCache: true }
    }]
  },
  {
    path: '/coupon',
    component: Layout,
    meta: { roles: 'coupon' },
    redirect: '/coupon/index',
    children: [{
      path: 'index',
      // component: () => import('@/views/abcoupon/index'),
      component: () => import('@/views/coupon/index'),
      name: 'coupon',
      meta: { title: 'coupon', icon: 'goods', noCache: true }
    }]
  },
  {
    path: '/server',
    component: Layout,
    redirect: '/server/serverBanner',
    meta: { title: 'server', icon: 'goods', roles: 'manage' },
    children: [
      {
        path: 'serverBanner',
        // component: () => import('@/views/abserver/serverBanner'),
        component: () => import('@/views/server/banner/banner'),
        name: 'serverBanner',
        meta: { title: 'serverBanner', noCache: true }
      },
      {
        path: 'recommend',
        component: () => import('@/views/server/recommend/index'),
        name: 'recommend',
        meta: { title: 'recommend', noCache: true }
      },
      {
        path: 'classify',
        // component: () => import('@/views/abserver/serverBanner'),
        component: () => import('@/views/server/classify/index'),
        name: 'classify',
        meta: { title: 'classify', noCache: true }
      },
      {
        path: 'specification',
        component: () => import('@/views/server/specification/index'),
        name: 'specification',
        meta: { title: 'specification', noCache: true }
      },
    // {
    //   path: 'serverEnrty',
    //   component: () => import('@/views/abserver/serverEnrty'),
    //   name: 'serverEnrty',
    //   meta: { title: 'serverEnrty', noCache: true }
    // }, 
    // {
    //   path: 'serverRec',
    //   component: () => import('@/views/abserver/serverRec'),
    //   name: 'serverRec',
    //   meta: { title: 'serverRec', noCache: true }
    // }, 
    // {
    //   path: 'serverAct',
    //   component: () => import('@/views/abserver/serverAct'),
    //   name: 'serverAct',
    //   meta: { title: 'serverAct', noCache: true }
    // }, 
    // {
    //   path: 'serverShop',
    //   component: () => import('@/views/abserver/serverShop'),
    //   name: 'serverShop',
    //   meta: { title: 'serverShop', noCache: true }
    // }, 
    // {
    //   path: 'serverAllbuy',
    //   component: () => import('@/views/abserver/serverAllbuy'),
    //   name: 'serverAllbuy',
    //   meta: { title: 'serverAllbuy', noCache: true }
    // }, 
    // {
    //   path: 'serverKill',
    //   component: () => import('@/views/abserver/serverKill'),
    //   name: 'serverKill',
    //   meta: { title: 'serverKill', noCache: true }
    // }, 
    // {
    //   path: 'serverSchool',
    //   component: () => import('@/views/abserver/serverSchool'),
    //   name: 'serverSchool',
    //   meta: { title: 'serverSchool', noCache: true }
    // }, 
    // {
    //   path: 'serverGetFlow',
    //   component: () => import('@/views/abserver/serverGetFlow'),
    //   name: 'serverGetFlow',
    //   meta: { title: 'serverGetFlow', noCache: true }
    // }, 
    // {
    //   path: '/serverActivity',
    //   component: () => import('@/views/abserver/serverActivity/index'),
    //   meta: { title: 'serverActivity' },
    //   children: [{
    //     path: 'distribution',
    //     component: () => import('@/views/abserver/serverActivity/distribution'),
    //     name: 'distribution',
    //     meta: { title: 'distribution', noCache: true }
    //   }, {
    //     path: 'vote',
    //     component: () => import('@/views/abserver/serverActivity/vote'),
    //     name: 'vote',
    //     meta: { title: 'vote', noCache: true }
    //   }]
    // }
    ]
  },
  {
    path: '/sellerAuth',
    component: Layout,
    redirect: '/sellerAuth/index',
    meta: { roles: 'auth' },
    children: [{
      path: 'index',
      component: () => import('@/views/authorize/index'),
      name: 'sellerAuth',
      meta: { title: 'sellerAuth', icon: 'goods', noCache: true }
    }]
  },
  // {
  //   path: '/sellerAuth',
  //   component: Layout,
  //   redirect: '/sellerAuth/index',
  //   meta: { roles: 'auth' },
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/absellerAuth/index'),
  //     name: 'sellerAuth',
  //     meta: { title: 'sellerAuth', icon: 'goods', noCache: true }
  //   }]
  // },
  // {
  //   path: '/food',
  //   component: Layout,
  //   redirect: '/food/index',
  //   meta: { title: 'food', icon: 'goods', roles:'food'},
  //   children: [
  //   {
  //     path: 'index',
  //     component: () => import('@/views/food/desk'),
  //     name: 'desk',
  //     meta: { title: 'desk', noCache: true }
  //   },
  //   {
  //     path: 'order',
  //     component: () => import('@/views/food/orderList'),
  //     name: 'foodOrder',
  //     meta: { title: 'order', noCache: true }
  //   }]
  // },
  {
    path: '/signIn',
    component: Layout,
    // redirct: '/signIn/index',
    meta: { title: 'signIn', icon: 'goods', roles: 'class_sign' },
    children: [
      {
        path: 'teacher',
        component: () => import('@/views/signIn/index'),
        name: 'teacher',
        meta: { title: 'teacher', }
      },
      {
        path: 'course',
        component: () => import('@/views/signIn/course'),
        name: 'course',
        meta: { title: 'course', }
      },
      { path: 'signin',
        component: () => import('@/views/signIn/signin'),
        name: 'signin',
        meta: { title: 'signin' }
      },
      { path: 'address',
        component: () => import('@/views/signIn/address'),
        name: 'address',
        meta: { title: 'address' }
      },
      {
        path: 'student',
        component: () => import('@/views/signIn/student'),
        // name: 'studen',
        meta: { title: 'student' }
      },
      { path: 'appointment',
        component: () => import('@/views/signIn/appointment'),
        name: 'signIn_appointment',
        meta: { title: 'appointment' }
      },
      {
        path: 'edit',
        component: () => import('@/views/signIn/edit'),
        meta: { title: 'editname' }
      },
      // { path: 'addGoods',
      //   component: () => import('@/views/signIn/course_goods'),
      //   name: 'appointment',
      //   meta: { title: 'addGoods' }
      // },
    ]
  },
  // {
  //   path: '/library',
  //   component: Layout,
  //   redirect: '/library/libraryList',
  //   name: 'library',
  //   meta: { title: 'library', icon: 'notice', roles: ['library'] },
  //   children: [{
  //     path: 'libraryList',
  //     component: () => import('@/views/library/libraryList'),
  //     name: 'libraryList',
  //     meta: { title: 'libraryList', noCache: true }
  //   },
  //   {
  //     path: 'libraryClass',
  //     component: () => import('@/views/library/libraryClass'),
  //     name: 'libraryClass',
  //     meta: { title: 'libraryClass', noCache: true }
  //   }]
  // },
  // {
  //   path: '/answer',
  //   component: Layout,
  //   redirect: '/answer/answerList',
  //   name: 'answer',
  //   meta: { title: 'answer', icon: 'notice', roles: ['answer'] },
  //   children: [{
  //     path: 'answerList',
  //     component: () => import('@/views/answer/answerList'),
  //     name: 'answerList',
  //     meta: { title: 'answerList', noCache: true }
  //   },
  //   {
  //     path: 'answerLibrary',
  //     component: () => import('@/views/answer/answerLibrary'),
  //     name: 'answerLibrary',
  //     meta: { title: 'answerLibrary', noCache: true }
  //   },
  //   {
  //     path: 'memberList',
  //     component: () => import('@/views/answer/memberList'),
  //     name: 'memberList',
  //     meta: { title: 'memberList', noCache: true }
  //   },{
  //     path: 'bonusMode',
  //     component: () => import('@/views/answer/bonusMode'),
  //     name: 'bonusMode',
  //     meta: { title: 'bonusMode', noCache: true }
  //   },{
  //     path: 'paymentMode',
  //     component: () => import('@/views/answer/paymentMode'),
  //     name: 'paymentMode',
  //     meta: { title: 'paymentMode', noCache: true }
  //   },{
  //     path: 'payList',
  //     component: () => import('@/views/answer/payList'),
  //     name: 'payList',
  //     meta: { title: 'payList', noCache: true }
  //   },{
  //     path: 'answerHistory',
  //     component: () => import('@/views/answer/answerHistory'),
  //     name: 'answerHistory',
  //     meta: { title: 'answerHistory', noCache: true }
  //   },{
  //     path: 'music',
  //     component: () => import('@/views/answer/music'),
  //     name: 'music',
  //     meta: { title: 'music', noCache: true }
  //   }]
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

  //{
  //  path: '/icon',
  //  component: Layout,
  //  children: [{
  //    path: 'index',
  //    component: () => import('@/views/svg-icons/index'),
  //    name: 'icons',
  //    meta: { title: 'icons', icon: 'icon', noCache: true }
  //  }]
  //},

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

