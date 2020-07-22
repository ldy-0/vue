import request from '@/utils/request'

// 会员提现
async function getWithdrawList(data) {
  return request({
    url: "/api/v2/seller/memberwithdraw",
    method: "get",
    params:data
  });
}
async function changeStatus(data) {
  return request({
    url: "/api/v2/seller/memberwithdraw/" + data.id,
    method: "put",
    data
  });
}

async function getRemainSetting(data) {
  return request({
    url: "/api/v2/common/memberwithdraw",
    method: "get",
    params:data
  });
}

async function setRemainSetting(data) {
  return request({
    url: "/api/v2/seller/memberwithdraw",
    method: "POST",
    data
  });
}

// 商家提现 
async function getSellerWithdrawList(data) {
  return request({
    url: "/api/v2/seller/turnover",
    method: "get",
    params:data
  });
}
async function changeSellerWithdrawState(id, data) {
  let opt = {
    url: `/api/v2/seller/turnover/${id}`,
    method: "PUT",
    data,
  };

  return request(opt);
}

async function addSellerWithdrawRemark(id, data) {
  let opt = {
    url: `/api/v2/seller/turnover/${id}/edit`,
    method: "get",
    params:data
  };

  return request(opt);
}

// 商家发票
async function getStoreInvoice(data) {
  return request({
    url: "/api/v2/seller/turnover/1/edit",
    method: "get",
    params:data
  });
}
async function setStoreInvoice(data) {
  return request({
    url: "/api/v2/seller/turnover/setting",
    method: "PUT",
    data
  });
}

// 德分提现 
async function getDscoreWithdrawList(data) {
  return request({
    url: "/api/v2/seller/rcbcash",
    method: "get",
    params:data
  });
}
async function changeDscoreWithdrawState(id, data) {
  let opt = {
    url: `/api/v2/seller/rcbcash/${id}`,
    method: "PUT",
    data,
  };

  return request(opt);
}

async function getDscoreWithdraw(data) {
  return request({
    url: "/api/v2/common/rcbcash",
    method: "get",
    params:data
  });
}
async function setDscoreWithdraw(data) {
  let opt = {
    url: `/api/v2/seller/rcbcash`,
    method: "POST",
    data,
  };

  return request(opt);
} 

export default {
  getWithdrawList,
  changeStatus,
  getRemainSetting,
  setRemainSetting,

  getSellerWithdrawList,
  changeSellerWithdrawState,
  addSellerWithdrawRemark,

  getDscoreWithdrawList,
  changeDscoreWithdrawState,
  getDscoreWithdraw,
  setDscoreWithdraw,

  getStoreInvoice,
  setStoreInvoice,
}