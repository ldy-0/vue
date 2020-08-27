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
    path: '/banner', // 轮播图
    component: Layout,
    meta: { roles: 'banner', desc: '轮播图', },
    redirect: '/banner/index',
    children: [{
      path: "banner",
      component: () => import("@/views/banner/index"),
      name: "banner",
      meta: { roles: 'banner', title: "banner", noCache: true, desc: '轮播图', icon: 'list', },
    }],
  },

  {
    path: '/company', // 企业介绍
    component: Layout,
    meta: { roles: 'company', desc: '企业介绍', },
    redirect: '/company/index',
    children: [{
      path: 'company',
      name: 'company',
      component: () => import('@/views/setting/company/index'),
      meta: { roles: 'company', title: 'company', noCache: true, desc: '企业介绍', icon: 'message', },
    }],
  },

  {
    path: '/classify', // 产品类目
    component: Layout,
    meta: { roles: 'classify', desc: '产品类目', },
    redirect: '/banner/index',
    children: [{
      path: "classify", // 分类信息
      component: () => import("@/views/classify/index"),
      name: "classify",
      meta: { roles: 'classify_normal', title: "分类", noCache: true, desc: '分类', icon: 'categroy', }
    }],
  },

  {
    path: '/news', // 新闻资讯 
    component: Layout,
    meta: { roles: 'news', desc: '资讯', },
    redirect: '/news/index',
    children: [{
      path: 'index',
      component: () => import('@/views/news/index'),
      name: 'news',
      meta: { roles: 'news_list', title: 'news', icon: 'notice', noCache: true, desc: '新闻资讯', },
    }],
  },

  {
    path: '/contact', // 联系我们
    component: Layout,
    meta: { roles: 'contact', desc: '联系我们', },
    redirect: '/contact/index',
    children: [{
      path: 'contact',
      name: 'contact',
      component: () => import('@/views/setting/contact/index'),
      meta: { roles: 'contact', title: 'contact', noCache: true, desc: '联系我们', icon: 'email', },
    }],
  },

  {
    path: '/app', // 设置
    component: Layout,
    meta: { roles: 'news', desc: '设置', },
    redirect: '/app/index',
    children: [{
      path: 'setting', 
      name: 'setting',
      component: () => import('@/views/setting/app/index'),
      meta: { roles: 'setting_normal', title: 'app', noCache: true, desc: 'APPLOGO', icon: 'form', },
    }],
  },

  // {
  //   path: "/authority", //权限管理
  //   component: Layout,
  //   redirect: "/authority/index",
  //   meta: { roles: "authorityManagement", desc: '权限', },
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/views/authority/index"),
  //       name: "authorityManagement",
  //       meta: { roles: 'auth_list', title: "authorityManagement", icon: "auth", noCache: true, desc: '权限列表', }
  //     }
  //   ]
  // },

];

export let routeList = JSON.parse(JSON.stringify(asyncRouterMapSeller));
