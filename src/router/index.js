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
    meta: { title: 'goods', icon: "goods", roles: "goods", desc: '商品管理', },
    children: [
      {
        path: "index",
        component: () => import("@/views/goods/index"),
        name: "goods",
        meta: { roles: 'goods_list', title: "goods", noCache: true, desc: '商品列表', },
      },
      {
        path: "preAuth",
        component: () => import("@/views/goods/common"),
        name: "preAuth",
        meta: { roles: 'goods_pre_auth', title: "goodsPreAuth", noCache: true, desc: '预审核', },
      },
      {
        path: "auth",
        component: () => import("@/views/goods/auth"),
        name: "sellGoodsAuth",
        meta: { roles: 'goods_auth', title: "goodsAuth", noCache: true, desc: '商品审核', },
      },
    ]
  },
  {
    path: "/order", // 订单
    component: Layout,
    redirect: "/order/index",
    meta: { roles: "order", title:'订单列表',icon:'order', desc: '订单列表', },
    children: [
      {
        path: "index",
        component: () => import("@/views/order/index"),
        name: "index",
        meta: { roles: 'order_normal', title: "普通订单", noCache: true, desc: "普通订单", }
      },
      {
        path: "porder",
        component: () => import("@/views/order/porder"),
        name: "porder",
        meta: { roles: 'order_dScore', title: "德分订单", noCache: true, desc: "德分订单", },
      },
      {
        path: "gorder",
        component: () => import("@/views/order/gorder"),
        name: "gorder",
        meta: { roles: 'order_group', title: "团购订单", noCache: true, desc: "团购订单", },
      },
      {
        path: "border",
        component: () => import("@/views/order/border"),
        name: "border",
        meta: { roles: 'order_bargain', title: "砍价订单", noCache: true, desc: "砍价订单", },
      },
      {
        path: "corder",
        component: () => import("@/views/order/corder"),
        name: "corder",
        meta: { roles: 'order_seckill', title: "秒杀订单", noCache: true, desc: "秒杀订单", },
      },
      {
        path: "newOrder",
        component: () => import("@/views/order/newOrder"),
        name: "newOrder",
        meta: { roles: 'order_newPeople', title: "新人订单", noCache: true, desc: "新人订单", },
      },
      {
        path: "storeOrder",
        component: () => import("@/views/order/storeOrder"),
        name: "storeOrder",
        meta: { roles: 'order_store', title: "商家订单", noCache: true, desc: "商家普通订单", }
      },
    ]
  },
  {
    path: '/afterSale', // 售后 
    component: Layout,
    meta: { roles: 'afterSale', desc: '售后', },
    redirect: '/afterSale/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/afterSale/index'),
        name: 'afterSale',
        meta: { roles: 'afterSale_list', title: '售后列表', icon: 'orderlist', noCache: true, desc: '售后列表', },
      }
    ],
  },

  {
    path: '/comment', // 评论 
    component: Layout,
    meta: { roles: 'comment', desc: '评论', },
    redirect: '/comment/index',
    children: [{
      path: 'index',
      component: () => import('@/views/comment/index'),
      name: 'comment',
      meta: { roles: 'comment_list', title: '评论列表', icon: 'commint', noCache: true, desc: '评论列表', },
    }]
  },
  
  {
    path: '/withDraw', // 提现 
    component: Layout,
    meta: { title: 'withdraw', roles: 'withDraw', icon: 'withdraw', desc: '提现', },
    redirect: '/withDraw/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/withDraw/index'),
        name: 'withDraw',
        meta: { roles: 'withDraw_normal', title: 'balanceWithdraw',  noCache: true, desc: '普通提现', },
      },
      {
        path: 'd_score',
        component: () => import('@/views/withDraw/common'),
        name: 'dscore',
        meta: { roles: 'withDraw_dScore', title: 'dscoreWithdraw',  noCache: true, desc: '德分提现', },
      },
      {
        path: 'seller',
        name: 'seller',
        component: () => import('@/views/withDraw/common'),
        meta: { roles: 'withDraw_seller', title: 'sellerWithdraw', noCache: true, desc: '商家提现',  },
      },
    ],
  },

  {
    path: '/news', // 资讯 
    component: Layout,
    meta: { roles: 'news', desc: '资讯', },
    redirect: '/news/index',
    children: [{
      path: 'index',
      component: () => import('@/views/news/index'),
      name: 'news',
      meta: { roles: 'news_list', title: '资讯列表', icon: 'message', noCache: true, desc: '资讯列表', },
    }]
  },
  {
    path: '/case', // 案例
    component: Layout,
    meta: { roles: 'case', desc: '案例', },
    redirect: '/case/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/case/index'),
        name: 'case',
        meta: { roles: 'case_list', title: '案例列表', icon: 'notice', noCache: true, desc: '案例列表', },
      }
    ],
  },

  {
    path: '/coupon',//优惠券
    component: Layout,
    meta: { roles: 'coupon', desc: '优惠券', },
    redirect: '/coupon/index',
    children: [{
      path: 'index',
      component: () => import('@/views/coupon/index'),
      name: 'coupon',
      meta: { roles: 'coupon_list', title: 'coupon', icon: 'money', noCache: true, desc: '优惠券列表', },
    }]
  },

  {
    path: '/user', // 用户列表
    component: Layout,
    meta: { roles: 'user', desc: '用户', },
    redirect: '/user/index',
    children: [{
      path: 'index',
      component: () => import('@/views/distribution/index'),
      name: 'user',
      meta: { roles: 'user_list', title: 'distribute', icon: 'fenxiao', noCache: true, desc: '用户列表', },
    }]
  },
  {
    path: "/memberList", //会员列表
    component: Layout,
    meta: { title: "memberList", icon: "user", roles: "member", desc: '会员', },
    children: [
      {
        path: "list",
        component: () => import("@/views/member/list/index"),
        name: "memberList",
        meta: { roles: 'member_list', title: "会员列表", noCache: true, icon: "user", desc: "会员列表", },
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
    meta: { title: "infoManagement", icon: "guide", roles: "infoManagement", desc: '运营', },
    children: [
      {
        path: "classify", //分类信息
        component: () => import("@/views/operate/classify/index"),
        name: "classify",
        meta: { roles: 'classify_normal', title: "分类", noCache: true, desc: '分类' }
      },
      {
        path: "customClass", // 自定义分类信息
        component: () => import("@/views/operate/customClass/index"),
        name: "customClass",
        meta: { roles: 'classify_custom', title: "自定义分类", noCache: true, desc: "自定义分类", },
      },
      {
        path: "newsClass", // 新闻分类信息
        component: () => import("@/views/operate/newsClass/index"),
        name: "newsClass",
        meta: { roles: 'classify_news', title: "新闻分类", noCache: true, desc: "新闻分类", },
      },
      {
        path: "freight", // 运费 
        component: () => import("@/views/operate/freight/index"),
        name: "freight",
        meta: { roles: 'freight', title: 'freight', noCache: true, desc: '运费' },
      },

      {
        path: "special", // VIP特惠
        component: () => import("@/views/operate/special/index"),
        name: "special",
        meta: { roles: 'special', title: "special", noCache: true, desc: 'VIP特惠', },
      },
      {
        path: "read", // VIP解读
        component: () => import("@/views/operate/read/index"),
        name: "read",
        meta: { roles: 'read', title: "read", noCache: true, desc: 'VIP解读', },
      },
      {
        path: "rainPackage", // 红包雨
        component: () => import("@/views/operate/rainPackage/index"),
        name: "rainPackage",
        meta: { roles: 'rainPackage', title: "rainPackage", noCache: true, desc: '红包雨', },
      },
      {
        path: "sign", // 签到 
        component: () => import("@/views/operate/sign/index"),
        name: "sign",
        meta: { roles: 'sign', title: "sign", noCache: true, desc: '签到', },
      },
      {
        path: "groupBuying",
        component: () => import("@/views/groupBuying/groupBuying"),
        name: "groupBuying",
        meta: { roles: 'groupBuy', title: "groupBuying", noCache: true, desc: '团购', },
      },
      {
        path: "killPrice",
        component: () => import("@/views/killPrice/index"),
        name: "killPrice",
        meta: { roles: 'seckill', title: "killPrice", noCache: true, desc: '秒杀', },
      },
      {
        path: "bargain",
        component: () => import("@/views/bargain/index"),
        name: "bargain",
        meta: { roles: 'bargain', title: "bargain", noCache: true, desc: '砍价', },
      },
      {
        path: "newPeople", // 新人专享
        component: () => import("@/views/operate/activity/newPeople/index"),
        name: "newPeople",
        meta: { roles: 'newPeople', title: "newPeople", noCache: true, desc: '新人专享', },
      },
      
      {
        path: "recommended", //精品推荐
        component: () => import("@/views/infoManagement/recommended"),
        name: "recommended",
        meta: { roles: 'recommend', title: "recommended", noCache: true, desc: '精品推荐', },
      },
      {
        path: "banner", //首页轮播
        component: () => import("@/views/infoManagement/banner"),
        name: "banner",
        meta: { roles: 'banner', title: "banner", noCache: true, desc: '首页轮播', },
      },
      {
      	path: 'attractMain', // 招商
      	component: () => import('@/views/operate/attractMain/index'),
      	name: 'attractMain',
      	meta: { roles: 'attract_main', title: '招商(总商城)', noCache: true, desc: '招商(总商城)' },
      },
      {
      	path: 'attractMain2', // 招商
      	component: () => import('@/views/operate/attractMain/card'),
      	name: 'attractMain2',
      	meta: { roles: 'attract_card', title: '招商(名片商城)', noCache: true, desc: '招商(名片商城)', },
      },
      {
      	path: 'about', //关于公司
      	component: () => import('@/views/operate/about/index'),
      	name: 'about',
      	meta: { roles: 'about', title: '关于健德', noCache: true, desc: '关于健德', },
      },
      {
      	path: 'address', 
      	component: () => import('@/views/operate/address/index'),
      	name: 'address',
      	meta: { roles: 'address', title: '退货地址', noCache: true, desc: '退货地址', },
      },
      {
      	path: 'business', 
      	component: () => import('@/views/operate/business/index'),
      	name: 'business',
      	meta: { roles: 'business', title: 'business', noCache: true, desc: '招商申请', },
      },
      {
      	path: 'home', // 首页设置
      	component: () => import('@/views/operate/home/index'),
      	name: 'hoem',
      	meta: { roles: 'setting_home', title: 'home', noCache: true, desc: '首页设置', },
      },
      {
      	path: 'share', //  app分享活动
      	component: () => import('@/views/operate/activity/common'),
      	name: 'share',
      	meta: { roles: 'setting_share', title: 'share', noCache: true, desc: 'APP分享活动设置', }
      },
      {
      	path: 'dScore', // 德分活动 
      	component: () => import('@/views/operate/activity/common'),
      	name: 'dScore',
      	meta: { roles: 'setting_dScore', title: 'dScore', noCache: true, desc: '德分活动设置', },
      },
      {
      	path: 'setting', // 设置
      	component: () => import('@/views/operate/setting/index'),
      	name: 'setting',
      	meta: { roles: 'setting_normal', title: 'setting', noCache: true, desc: '设置', },
      },
      {
      	path: 'asset', // 资产配置
      	component: () => import('@/views/operate/setting/index'),
      	name: 'asset',
      	meta: { roles: 'setting_asset', title: 'asset', noCache: true, desc: '资产设置', },
      },
      {
        path: "poster", // 海报
        component: () => import("@/views/operate/poster/index"),
        name: "poster",
        meta: { roles: 'setting_poster', title: "poster", noCache: true, desc: '海报设置', },
      },
      {
      	path: 'rebate', // 返利设置
      	component: () => import('@/views/operate/setting/global'),
      	name: 'rebate',
      	meta: { roles: 'setting_rebate', title: 'rebate', noCache: true, desc: '返利设置', },
      },
    ]
  },

  {
    path: "/authority", //权限管理
    component: Layout,
    redirect: "/authority/index",
    meta: { roles: "authorityManagement", desc: '权限', },
    children: [
      {
        path: "index",
        component: () => import("@/views/authority/index"),
        name: "authorityManagement",
        meta: { roles: 'auth_list', title: "authorityManagement", icon: "auth", noCache: true, desc: '权限列表', }
      }
    ]
  },

  {
    path: '/finance',
    component: Layout,
    meta: { title: 'finance', roles: 'finance', icon: 'money', desc: '财务', },
    children: [
      {
        path: 'deal',
        name: 'deal',
        component: () => import('@/views/finance'),
        meta: { roles: 'finance_deal', title: 'deal', noCache: true, desc: '交易明细', },
      },
      {
        path: 'reward',
        name: 'reward',
        component: () => import('@/views/finance'),
        meta: { roles: 'finance_reward', title: 'reward', noCache: true, desc: '奖励明细', },
      },
    ]
  },

  {
    path: '/store',
    component: Layout,
    meta: { title: 'sellerStore', roles: 'sellerStore', icon: 'money', desc: '商家',  },
    children: [
      {
        path: 'list',
        name: 'all',
        component: () => import('@/views/store/common'),
        meta: { roles: 'sellerStore_list', title: 'storeList', noCache: true, desc: '商家列表', },
      },
      {
        path: 'check',
        name: 'check',
        component: () => import('@/views/store/common'),
        meta: { roles: 'sellerStore_check', title: 'storeCheck', noCache: true, desc: '商家审核', },
      },
      {
        path: 'recommend',
        name: 'recommend',
        component: () => import('@/views/store/common'),
        meta: { roles: 'sellerStore_recommend', title: 'storeRecommend', noCache: true, desc: '商家推荐', },
      },
    ]
  },

];

export let routeList = JSON.parse(JSON.stringify(asyncRouterMapSeller));
