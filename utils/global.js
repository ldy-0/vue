// 授权
export const LOGIN = 'login';
export const REGISTER = 'register';

// 商品
export const NORMAL_GOODS = 1;
export const VIP_GOODS = 2;
export const NEW_GOODS = 3;
export const SECKILL_GOODS = 4;
export const GROUP_GOODS = 5;
export const BARGAIN_GOODS = 6;

export const USE_COUPON = 1;
export const NO_COUPON = 0;

export const COLLECT = 1;
export const NO_COLLECT = 0;

// 订单
export const NORMAL_ORDER = 1;
export const VIP_ORDER = 10;
export const GROUP_ORDER = 6;
export const SECKILL_ORDER = 7;
export const BARGAIN_ORDER = 9;
// 订单状态
export const ORDER_CANCEL = 0;
export const ORDER_UN_PAY = 10;
export const ORDER_PAYED = 20;
export const ORDER_SEND = 30;
export const ORDER_RECEIVE = 40;
export const ORDER_UN_COMMENT = 50;
export const ORDER_DONE = 80;
export const ORDER_CLOSE = 100;

export const ORDER_DETAIL = 1;
export const AFTERSALE_DETAIL = 2;
// 售后状态
export const REFUND = 0;
export const REFUNDING = 1;
export const REFUNDED = 3;
// 退款类型
export const RETURN_MONEY = 1;
export const RETURN_GOODS = 2;

// 团购状态
export const GROUPING = 0;
export const GROUPED = 1;
export const NO_GROUP = 2;

// 砍价状态
export const NO_BARGAIN = 0; // 失败
export const BARGAINING = 1;
export const BARGAINED = 2;

// 店铺
export const MAIN_STORE = 1;

// 获取用户信息
export function getUser() {
  var user;

  try{
    user = JSON.parse(localStorage.getItem('user'));
  }catch(err){
    console.error(err.message);
  }

  return user;
}

// 获取用户信息
export function isRegister() {
  var user = getUser();

  return user.inviter_id != 0;
}