import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/views/layout/Layout";
//isAdmin为true时，平台路由
export let asyncRouterMapAdmin = [];
export const constantRouterMap = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/authredirect",
    component: () => import("@/views/login/authredirect"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/errorPage/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/views/errorPage/401"),
    hidden: true
  },
  // 首页
  {
    path: "",
    component: Layout,
    redirect: "home",
    children: [
      {
        path: "home",
        component: () => import("@/views/home/index"),
        name: "home",
        meta: {
          title: "home",
          icon: "dashboard",
          noCache: true
        }
      }
    ]
  }
];

export default new Router({
  mode: "hash", // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
});

//isAdmin为false时，商家路由
export let asyncRouterMapSeller = [
  {
    path: "/goods", // 商品管理
    component: Layout,
    redirect: "/goods/index",
    meta: { roles: "goods" },
    children: [
      {
        path: "index",
        component: () => import("@/views/goods/index"),
        name: "goods",
        meta: { title: "goods", icon: "goods", noCache: true }
      }
    ]
  },
  {
    path: "/order", // 订单
    component: Layout,
    redirect: "/order/index",
    meta: { roles: "order",title:'订单列表',icon:'order'},
    children: [
      {
        path: "index",
        component: () => import("@/views/order/index"),
        name: "index",
        meta: { title: "普通订单", noCache: true }
      },
      {
        path: "porder",
        component: () => import("@/views/order/porder"),
        name: "porder",
        meta: { title: "德分订单",noCache: true }
      },
      {
        path: "gorder",
        component: () => import("@/views/order/gorder"),
        name: "gorder",
        meta: { title: "团购订单",noCache: true }
      },
      {
        path: "border",
        component: () => import("@/views/order/border"),
        name: "border",
        meta: { title: "砍价订单", noCache: true }
      },
      {
        path: "corder",
        component: () => import("@/views/order/corder"),
        name: "corder",
        meta: { title: "秒杀订单",noCache: true }
      },
    ]
  },
  {
    path: '/afterSale', // 售后 
    component: Layout,
    meta: { roles: 'afterSale' },
    redirect: '/afterSale/index',
    children: [{
      path: 'index',
      component: () => import('@/views/afterSale/index'),
      name: 'afterSale',
      meta: { title: '售后列表', icon: 'orderlist', noCache: true }
    }]
  },
  {
    path: '/comment', // 评论 
    component: Layout,
    meta: { roles: 'comment' },
    redirect: '/comment/index',
    children: [{
      path: 'index',
      component: () => import('@/views/comment/index'),
      name: 'comment',
      meta: { title: '评论列表', icon: 'commint', noCache: true }
    }]
  },
  {
    path: '/distribution', // 分销 
    component: Layout,
    meta: { roles: 'distribution' },
    redirect: '/distribution/index',
    children: [{
      path: 'index',
      component: () => import('@/views/distribution/index'),
      name: 'distribution',
      meta: { title: 'distribute', icon: 'fenxiao', noCache: true }
    }]
  },
  {
    path: '/withDraw', // 提现 
    component: Layout,
    meta: { roles: 'withDraw' },
    redirect: '/withDraw/index',
    children: [{
      path: 'index',
      component: () => import('@/views/withDraw/index'),
      name: 'withDraw',
      meta: { title: '提现列表', icon: 'withdraw', noCache: true }
    }]
  },
  {
    path: '/news', // 资讯 
    component: Layout,
    meta: { roles: 'news' },
    redirect: '/news/index',
    children: [{
      path: 'index',
      component: () => import('@/views/news/index'),
      name: 'news',
      meta: { title: '资讯列表', icon: 'message', noCache: true }
    }]
  },
  {
    path: '/case', // 案例
    component: Layout,
    meta: { roles: 'case' },
    redirect: '/case/index',
    children: [{
      path: 'index',
      component: () => import('@/views/case/index'),
      name: 'case',
      meta: { title: '案例列表', icon: 'notice', noCache: true }
    }]
  },
  {
    path: '/coupon',//优惠券
    component: Layout,
    meta: { roles: 'coupon' },
    redirect: '/coupon/index',
    children: [{
      path: 'index',
      component: () => import('@/views/coupon/index'),
      name: 'coupon',
      meta: { title: 'coupon', icon: 'money', noCache: true }
    }]
  },
  {
    path: "/memberList", //会员列表
    component: Layout,
    meta: { title: "memberList", icon: "user", roles: "memberList" },
    children: [
      {
        path: "list",
        component: () => import("@/views/member/list/index"),
        name: "memberList",
        meta: { title: "会员列表", noCache: true, icon: "user" }
      }
    ]
  },
  // {
  //   path: "/memberAuth", //会员审核列表
  //   component: Layout,
  //   meta: { title: "memberAuth", icon: "user", roles: "memberAuth" },
  //   children: [
  //     {
  //       path: "auth",
  //       component: () => import("@/views/member/auth/index"),
  //       name: "memberAuth",
  //       meta: { title: "会员审核列表", noCache: true, icon: "application" }
  //     }
  //   ]
  // },
  {
    path: "/infoManagement", //运营
    component: Layout,
    meta: {
      title: "infoManagement",
      icon: "guide",
      roles: "infoManagement"
    },
    children: [
      {
        path: "classify", //分类信息
        component: () => import("@/views/operate/classify/index"),
        name: "classify",
        meta: { title: "分类", noCache: true }
      },
      {
        path: "customClass", // 自定义分类信息
        component: () => import("@/views/operate/customClass/index"),
        name: "customClass",
        meta: { title: "自定义分类", noCache: true }
      },
      {
        path: "newsClass", // 新闻分类信息
        component: () => import("@/views/operate/newsClass/index"),
        name: "newsClass",
        meta: { title: "新闻分类", noCache: true }
      },
      {
        path: "special", // VIP特惠
        component: () => import("@/views/operate/special/index"),
        name: "special",
        meta: { title: "special", noCache: true }
      },
      {
        path: "read", // VIP解读
        component: () => import("@/views/operate/read/index"),
        name: "read",
        meta: { title: "read", noCache: true }
      },
      {
        path: "rainPackage", // 红包雨
        component: () => import("@/views/operate/rainPackage/index"),
        name: "rainPackage",
        meta: { title: "rainPackage", noCache: true }
      },
      {
        path: "freight", // 运费 
        component: () => import("@/views/operate/freight/index"),
        name: "freight",
        meta: { title: 'freight', noCache: true }
      },
      {
        path: "groupBuying",
        component: () => import("@/views/groupBuying/groupBuying"),
        name: "groupBuying",
        meta: {
          title: "groupBuying",
          noCache: true
        }
      },
      {
        path: "killPrice",
        component: () => import("@/views/killPrice/index"),
        name: "killPrice",
        meta: {
          title: "killPrice",
          noCache: true
        }
      },
      {
        path: "bargain",
        component: () => import("@/views/bargain/index"),
        name: "bargain",
        meta: {
          title: "bargain",
          noCache: true
        }
      },
      
      {
        path: "recommended", //精品推荐
        component: () => import("@/views/infoManagement/recommended"),
        name: "recommended",
        meta: {
          title: "recommended",
          noCache: true
        }
      },
      {
        path: "banner", //首页轮播
        component: () => import("@/views/infoManagement/banner"),
        name: "benner",
        meta: {
          title: "banner",
          noCache: true
        }
      },
      {
      	path: 'attractMain', // 招商
      	component: () => import('@/views/operate/attractMain/index'),
      	name: 'attractMain',
      	meta: { title: '招商(总商城)', noCache: true }
      },
      {
      	path: 'attractMain2', // 招商
      	component: () => import('@/views/operate/attractMain/card'),
      	name: 'attractMain2',
      	meta: { title: '招商(名片商城)', noCache: true }
      },
      {
      	path: 'about', //关于公司
      	component: () => import('@/views/operate/about/index'),
      	name: 'about',
      	meta: { title: '关于健德', noCache: true }
      },
      {
      	path: 'address', 
      	component: () => import('@/views/operate/address/index'),
      	name: 'address',
      	meta: { title: '退货地址', noCache: true }
      },
      {
      	path: 'business', 
      	component: () => import('@/views/operate/business/index'),
      	name: 'business',
      	meta: { title: 'business', noCache: true }
      },
      {
      	path: 'setting', // 设置
      	component: () => import('@/views/operate/setting/index'),
      	name: 'setting',
      	meta: { title: 'setting', noCache: true }
      },
    ]
  },

  {
    path: "/authorityManagement", //权限管理
    component: Layout,
    redirect: "/authorityManagement/index",
    meta: {
      roles: "authorityManagement"
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/authorityManagement/index"),
        name: "authorityManagement",
        meta: {
          title: "authorityManagement",
          icon: "auth",
          noCache: true
        }
      }
    ]
  },
];
