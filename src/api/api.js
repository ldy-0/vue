import request from '@/utils/request'

// class 
async function setClass(data, _this) {
  let res = await request({
    url: '/api/v2/seller/storegc',
    method: 'post',
    data,
  });
  console.log('res ', res);
  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error }) : _this.$notify.success({ title: '提示', message: '添加成功' })// res.data; 
}

async function updateClass(id, data, _this) {
  let res = await request({
    url: `/api/v2/seller/storegc/${id}`,
    method: 'put',
    data,
  });
  console.log('update address', res);
  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error }) : _this.$notify.success({ title: '提示', message: '更新成功' })// res.data; 
}

async function deleteClass(id, data, _this) {
  let res = await request({
    url: `/api/v2/seller/storegc/${id}`,
    method: 'DELETE',
    data
  });
  console.log('delete address', res);
  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error }) : _this.$notify.success({ title: '提示', message: '删除成功' })
}

async function getClassList(params, _this) {
  let res = await request({
    url: '/api/v2/seller/storegc',
    methods: 'get',
    params,
  });

  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error, }) : res; 
}

async function setGoods(data, _this){
  let res = await request({
    url: '/api/v2/seller/goodscommon',
    method: 'post',
    data,
  });
  console.log('res ', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '添加成功' })// res.data; 
}

async function getGoodsList(params, _this){
  let res = await request({
    url: '/api/v2/seller/goodscommon',
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data; 
}

async function getGoods(id, params, _this){
  let res = await request({
    url: `/api/v2/seller/goodscommon/${id}`,
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data.data; 
}

async function updateGoods(id, data, _this){
  let res = await request({
    url: `/api/v2/seller/goodscommon/${id}`,
    method: 'put',
    data,
  });
  console.log('update address', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '更新成功' })// res.data; 
}

async function deleteGoods(id, data, _this){
  let res = await request({
    url: `/api/v2/seller/goodscommon/${id}`,
    method: 'DELETE',
    data,
  });
  console.log('delete address', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '删除成功' })// res.data; 
}

async function setGoodsStatus(data, _this){
  let res = await request({
    url: `/api/v2/seller/goodscommon/setting`,
    method: 'PUT',
    data,
  });
  console.log('上下架', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '修改成功' })// res.data; 
}

// 设计师+易居学院
async function setAcademy(data, _this){
  let res = await request({
    url: '/api/v2/seller/academy',
    method: 'post',
    data,
  });
  console.log('res ', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '添加成功' })// res.data; 
}

async function getAcademyList(params, _this){
  let res = await request({
    url: '/api/v2/seller/academy',
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data; 
}

async function updateAcademy(id, data, _this){
  let res = await request({
    url: `/api/v2/seller/academy/${id}`,
    method: 'put',
    data,
  });
  console.log('update address', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '更新成功' })// res.data; 
}

async function deleteAcademy(id, data, _this){
  let res = await request({
    url: `/api/v2/seller/academy/${id}`,
    method: 'DELETE',
    data,
  });
  console.log('delete address', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '删除成功' })// res.data; 
}

async function getAcademy(id, params, _this){
  let res = await request({
    url: `/api/v2/seller/academy/${id}`,
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data.data; 
}

// 半包
async function updateCustommade(data, _this){
  let res = await request({
    url: '/api/v2/seller/custommade',
    method: 'post',
    data,
  });
  console.log('res ', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '修改成功' })// res.data;
}

async function getCustommadeList(params, _this){
  let res = await request({
    url: '/api/v2/seller/custommade',
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data; 
}

async function setBanner(data, _this){
  let res = await request({
    url: '/api/v2/seller/banner',
    method: 'post',
    data,
  });
  console.log('res ', res);
  return res.data.error !== 'ok' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '添加成功' })// res.data; 
}

async function getBannerList(params, _this){
  let res = await request({
    url: '/api/v2/seller/banner',
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data; 
}

async function updateBanner(id, data, _this){
  let res = await request({
    url: `/api/v2/seller/banner/${id}`,
    method: 'put',
    data,
  });
  console.log('update address', res);
  return res.data.error !== '修改成功' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '更新成功' })// res.data; 
}

async function deleteBanner(id, data, _this){
  let res = await request({
    url: `/api/v2/seller/banner/${id}`,
    method: 'DELETE',
    data,
  });
  console.log('delete address', res);
  return res.data.error !== '删除成功' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '删除成功' })// res.data; 
}

// user
async function setUser(data, _this){
  let res = await request({
    url: '/api/v2/seller/seller',
    method: 'post',
    data,
  });
  console.log('res ', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '添加成功' })// res.data; 
}

async function getUserList(params, _this){
  let res = await request({
    url: '/api/v2/seller/seller',
    methods: 'get',
    params,
  });

  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error, }) : res; 
}

async function getUser(params, _this){
  let res = await request({
    url: `/api/v2/seller/seller`,
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data.data; 
}

async function updateUser(id, data, _this){
  let res = await request({
    url: `/api/v2/seller/seller/${id}`,
    method: 'put',
    data,
  });
  console.log('update address', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '更新成功' })// res.data; 
}

async function deleteUser(id, data, _this){
  let res = await request({
    url: `/api/v2/seller/seller/${id}`,
    method: 'DELETE',
    data,
  });
  console.log('delete address', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '删除成功' })// res.data; 
}

// 定金 depositscale
async function updateDepositscale(data, _this){
  let res = await request({
    url: `/api/v2/seller/depositscale`,
    method: 'POST',
    data,
  });
  console.log('update address', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '更新成功' })// res.data; 
}

async function getDepositscale(params, _this){
  let res = await request({
    url: `/api/v2/seller/depositscale`,
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data.data; 
}

// 服务费 extraservice  
async function updateExtraservice(id, data, _this){
  let res = await request({
    url: `/api/v2/seller/extraservice/${id}`,
    method: 'PUT',
    data,
  });
  console.log('update address', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '更新成功' })// res.data; 
}

async function getExtraservice(id, params, _this){
  let res = await request({
    url: `/api/v2/seller/extraservice/${id}`,
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data.data; 
}

// help
async function updateHelp(data, _this){
  let res = await request({
    url: `/api/v2/seller/help`,
    method: 'POST',
    data,
  });
  console.log('update address', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '更新成功' })// res.data; 
}

async function getHelp(params, _this){
  let res = await request({
    url: `/api/v2/seller/help`,
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data.data; 
}

// member
async function getMember(params, _this){
  let res = await request({
    url: `/api/v2/seller/member`,
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data; 
}

// banbao
async function getCustommadeinfo(params, _this){
  let res = await request({
    url: `/api/v2/seller/custommadeinfo`,
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data; 
}

async function deleteCustommadeinfo(id, data, _this){
  let res = await request({
    url: `/api/v2/seller/custommadeinfo/${id}`,
    method: 'DELETE',
    data,
  });
  console.log('delete address', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '删除成功' })// res.data; 
}

// order
async function getOrderList(params, _this){
  let res = await request({
    url: `/api/v2/seller/order`,
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data; 
}

async function getOrderDetail(id, params, _this){
  let res = await request({
    url: `/api/v2/seller/order/${id}`,
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data; 
}

async function updateOrder(id, data, _this){
  let res = await request({
    url: `/api/v2/seller/orderstate/${id}`,
    method: 'PUT',
    data,
  });
  console.log('update address', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '更新成功' })// res.data; 
}

// assess
async function getAssessList(params, _this){
  let res = await request({
    url: `/api/v2/seller/goodsevaluate`,
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data; 
}

async function getAssessDetail(id, params, _this){
  let res = await request({
    url: `/api/v2/seller/goodsevaluate/${id}`,
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data; 
}

async function deleteAssess(id, data, _this){
  let res = await request({
    url: `/api/v2/seller/goodsevaluate/${id}`,
    method: 'DELETE',
    data,
  });
  console.log('delete address', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '删除成功' })// res.data; 
}

async function auditingAssess(id, data, _this){
  let res = await request({
    url: `/api/v2/seller/goodsevaluate/${id}`,
    method: 'PUT',
    data,
  });
  console.log('update address', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '更新成功' })// res.data; 
}

// assess
async function getRefundList(params, _this){
  let res = await request({
    url: `/api/v2/seller/refundreturn`,
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data; 
}

async function getRefund(id, params, _this){
  let res = await request({
    url: `/api/v2/seller/refundreturn/${id}`,
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data; 
}

async function refund(id, data, _this){
  let res = await request({
    url: `/api/v2/seller/refundreturn/${id}`,
    method: 'PUT',
    data,
  });
  console.log('update address', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '更新成功' })// res.data; 
}

// specification
async function getSpecificationList(params, _this) {
  let res = await request({
    url: `/api/v2/seller/designrule`,
    methods: 'get',
    params,
  })

  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error }) : res 
}

async function getSpecification (id, params, _this) {
  let res = await request({
    url: `/api/v2/seller/designrule/${id}`,
    methods: 'get',
    params
  })

  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error }) : res.data
}

async function setSpecification(data, _this) {
  let res = await request({
    url: '/api/v2/seller/designrule',
    method: 'post',
    data,
  });
  console.log('res ', res);
  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error }) : _this.$notify.success({ title: '提示', message: '添加成功' })// res.data; 
}

async function updateSpecification(id, data, _this) {
  let res = await request({
    url: `/api/v2/seller/designrule/${id}`,
    method: 'put',
    data,
  });
  console.log('update address', res);
  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error }) : _this.$notify.success({ title: '提示', message: '更新成功' })// res.data; 
}

async function deleteSpecification(id, data, _this) {
  let res = await request({
    url: `/api/v2/seller/designrule/${id}`,
    method: 'DELETE',
    data
  });
  console.log('delete address', res);
  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error }) : _this.$notify.success({ title: '提示', message: '删除成功' })
}

// specification
async function getCouponList(params, _this) {
  let res = await request({
    url: `/api/v2/seller/coupon`,
    methods: 'get',
    params,
  })

  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error }) : res 
}

async function setCoupon(data, _this) {
  let res = await request({
    url: '/api/v2/seller/coupon',
    method: 'post',
    data,
  });
  console.log('res ', res);
  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error }) : _this.$notify.success({ title: '提示', message: '添加成功' })// res.data; 
}

async function updateCoupon(id, data, _this) {
  let res = await request({
    url: `/api/v2/seller/coupon/${id}`,
    method: 'put',
    data,
  });
  console.log('update address', res);
  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error }) : _this.$notify.success({ title: '提示', message: '更新成功' })// res.data; 
}

async function deleteCoupon(id, data, _this) {
  let res = await request({
    url: `/api/v2/seller/coupon/${id}`,
    method: 'DELETE',
    data
  });
  console.log('delete address', res);
  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error }) : _this.$notify.success({ title: '提示', message: '删除成功' })
}

export default {
  getClassList,
  setClass,
  updateClass,
  deleteClass,
  setGoods,
  getGoodsList,
  getGoods,
  updateGoods,
  deleteGoods,
  setGoodsStatus,
  setAcademy,
  getAcademyList,
  updateAcademy,
  deleteAcademy,
  getAcademy,
  updateCustommade,
  getCustommadeList,
  setBanner,
  getBannerList,
  updateBanner,
  deleteBanner,
  setUser,
  getUserList,
  getUser,
  updateUser,
  deleteUser,
  updateDepositscale,
  getDepositscale,
  updateExtraservice,
  getExtraservice,
  updateHelp,
  getHelp,
  getMember,
  getCustommadeinfo,
  deleteCustommadeinfo,
  getOrderList,
  getOrderDetail,
  updateOrder,
  getAssessList,
  getAssessDetail,
  deleteAssess,
  auditingAssess,
  getRefundList,
  getRefund,
  refund,
  getSpecificationList,
  getSpecification,
  setSpecification,
  updateSpecification,
  deleteSpecification,
  getCouponList,
  setCoupon,
  updateCoupon,
  deleteCoupon
}