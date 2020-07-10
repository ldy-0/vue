import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/layout/index.vue';


const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)
const index = [
  {
    path: '/',
    redirect: "home",
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: { active: 0 }
      },
    ]
  },
  {
    path: '/classify',
    component: Layout,
    children: [
      {
        path: '/classify',
        name: 'classify',
        component: () => import('@/views/classify.vue'),
        meta: { active: 1 }
      },
    ]
  },
  {
    path: '/shoppingCar',
    component: Layout,
    children: [
      {
        path: '/shoppingCar',
        name: 'shoppingCar',
        component: () => import('@/views/shoppingCar.vue'),
        meta: { active: 2 }
      },
    ]
  },
  {
    path: '/infomation',
    component: Layout,
    children: [
      {
        path: '/infomation',
        name: 'infomation',
        component: () => import('@/views/infomation.vue'),
        meta: { active: 3 }
      },
    ]
  },
  {
    path: '/my',
    component: Layout,
    children: [
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my.vue'),
        meta: { active: 4 }
      }
    ]
  },
]
const pages = [
  {
    path: '/login',
    name: 'login',
    alias: ['/register'],
    component: () => import('@/views/login/login.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/bind',
    name: 'bind',  // 注册VIP
    component: () => import('@/views/login/bind.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/agreement',
    name: 'agreement',  // 协议
    component: () => import('@/views/login/agreement.vue'),
    meta: { isBack: false, },
  },

  // goods
  {
    path: '/goods/detail',
    name: 'goodsDetail',
    component: () => import('@/views/goods/detail.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/goods/vip',
    name: 'vipGoodsList', // 合作共赢
    component: () => import('@/views/goods/vipGoodsList.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/goods/public',
    name: 'publicGoodsList', // 购购商城
    component: () => import('@/views/goods/publicGoodsList.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/goods/class',
    name: 'classGoodsList',  // 分类商品列表
    component: () => import('@/views/goods/classGoodsList.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/goods/activity',
    name: 'activityGoodsList',  // 秒杀/拼团/砍价
    component: () => import('@/views/goods/activityGoodsList.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/goods/newPeople',
    name: 'newPeopleGoodsList',  // 新人专享
    component: () => import('@/views/goods/newGoodsList.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/goods/main',
    name: 'mainGoodsList', // 平台商品列表
    component: () => import('@/views/goods/mainGoodsList.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/goods/store',
    name: 'storeGoodsList', // 店铺商品列表
    component: () => import('@/views/store/goodsList.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/readDetail',
    name: 'readDetail', // vip解读
    component: () => import('@/views/activity/readDetail.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/coupon',
    name: 'couponList', // 优惠券列表
    component: () => import('@/views/activity/coupon.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/infoDetail',
    name: 'infoDetail',
    component: () => import('@/views/extra/infoDetail.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/extra/search.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/searchResult',
    name: 'searchResult',
    component: () => import('@/views/extra/searchResult.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/comment/list', // 评论列表
    name: 'commentList',
    component: () => import('@/views/goods/commentList.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/about/credit', // 众信验证
    name: 'credit',
    component: () => import('@/views/about/credit.vue'),
    meta: { isBack: false, },
  },

  //store
  {
    path: '/store',
    name: 'storeList', // 店铺列表
    component: () => import('@/views/store/list.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/store/class',
    name: 'classStoreList', // 分类店铺列表
    component: () => import('@/views/store/classStoreList.vue'),
    meta: { isBack: false, },
  },

  // order
  {
    path: '/order/submit',
    name: 'submitOrder',
    component: () => import('@/views/my/order/submit.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/order/done',
    name: 'orderDone',
    component: () => import('@/views/my/order/done.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/order/list',
    name: 'orderList',
    component: () => import('@/views/my/order/list.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/order/detail',
    name: 'orderDetail',
    component: () => import('@/views/my/order/detail.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/order/logistic', // 物流
    name: 'orderLogistic',
    component: () => import('@/views/my/order/logistic.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/order/eval',  // 评价
    name: 'orderEval',
    component: () => import('@/views/my/order/eval.vue'),
    meta: { isBack: false, },
  },
  // 售后
  {
    path: '/afterSale/list',
    name: 'afterSaleList',
    component: () => import('@/views/my/order/afterSale/list.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/afterSale/detail',
    name: 'afterSaleDetail',
    component: () => import('@/views/my/order/afterSale/detail.vue'),
    meta: { isBack: false, },
  },
  // 售后选择
  {
    path: '/afterSale/go',
    name: 'goRefund',
    component: () => import('@/views/my/order/afterSale/go.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/afterSale/refund',
    name: 'refund',
    component: () => import('@/views/my/order/afterSale/refund.vue'),
    meta: { isBack: false, },
  },
  // 秒杀
  {
    path: '/order/seckill/list',
    name: 'seckillOrderList',
    component: () => import('@/views/my/order/seckill/list.vue'),
    meta: { isBack: false, },
  },
  // 团购
  {
    path: '/order/group/list',
    name: 'groupOrderList',
    component: () => import('@/views/my/order/group/list.vue'),
    meta: { isBack: false, },
  },
  // 团详情
  {
    path: '/order/group/detail',
    name: 'groupDetail',
    component: () => import('@/views/my/order/group/detail.vue'),
    meta: { isBack: false, },
  },
  // 砍价
  {
    path: '/order/bargain/list',
    name: 'bargainOrderList',
    component: () => import('@/views/my/order/bargain/list.vue'),
    meta: { isBack: false, },
  },

  // user
  // 我的资产
  {
    path: '/asset',
    name: 'asset',
    component: () => import('@/views/my/asset.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/address/list',
    name: 'addressList',
    component: () => import('@/views/my/address/list.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/address/detail',
    name: 'addressDetail',
    component: () => import('@/views/my/address/detail.vue'),
    meta: { isBack: false, },
  },
  {
    path: '/dscore/pwd',
    name: 'dScorePwd', // 设置德分密码
    component: () => import('@/views/my/dscore/pwdSetting.vue'),
    meta: { isBack: false, },
  },
  // 我的积分
  {
    path: '/point',
    name: 'point',
    component: () => import('@/views/my/asset.vue'),
    meta: { isBack: false, },
  },
  // 分销中心
  {
    path: '/distribution',
    name: 'distribution',
    component: () => import('@/views/my/asset.vue'),
    meta: { isBack: false, },
  },
  // 我的下级
  {
    path: '/distribution/children',
    name: 'distributionChildren',
    component: () => import('@/views/my/distribution/children.vue'),
    meta: { isBack: false, },
  },
  // 收入/支出/预收益明细
  {
    path: '/record',
    name: 'recordList',
    component: () => import('@/views/my/recordList.vue'),
    meta: { isBack: false, },
  },
  // 立即提现
  {
    path: '/withdraw/go',
    name: 'goWithdraw',
    component: () => import('@/views/my/withdraw/go.vue'),
    meta: { isBack: false, },
  },
  // 提现
  {
    path: '/withdraw',
    name: 'withdraw',
    component: () => import('@/views/my/withdraw/withdraw.vue'),
    meta: { isBack: false, },
  },
  // 提现列表
  { path: '/withdraw/list',
    name: 'withdrawList',
    component: () => import('@/views/my/withdraw/list.vue'),
    meta: { isBack: false, },
  },

  // app
  {
    path: '/app',
    name: 'app',
    component: () => import('@/views/extra/app.vue'),
    meta: { isBack: false, },
  },

  // 图片
  {
    path: '/img',
    name: 'img',
    component: () => import('@/views/about/img.vue'),
    meta: { isBack: false, },
  },

  {
    path: '/extra/ticket', // 票务系统
    name: 'ticket',
    component: () => import('@/views/extra/ticket.vue'),
    meta: { isBack: false, },
  },
];

let routes = index.concat(pages);
const router = new VueRouter({
  // mode: 'history',
  routes,
  scrollBehavior,
});

let stack = [];
router.beforeEach(function (to, from, next){
  let len = stack.length;

  if(['home', 'classify', 'shoppingCar', 'infomation', 'my'].indexOf(to.name) != -1){
    from.meta.isBack = false;
    // this.options.routes.forEach(v => v.meta ? v.meta.isBack = false : null);
    len = stack.length = 0;
  }

  if(len && stack[len - 2] === to.path){
    from.meta.isBack = false;
    to.meta.isBack = true;
    stack.pop();
  }else{
    // from.meta.keepAlive = true;
    stack.push(to.path);
  }

  localStorage.setItem('length', stack.length);
  console.log(`${from.path} -> ${to.path}`, stack);
  next();
}.bind(router));

function scrollBehavior(to, from, savePosition) {
  // console.log(to.name, from.name, savePosition);
}

export default router;
