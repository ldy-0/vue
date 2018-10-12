import request from '@/utils/request'

// test
  export function test2(data) {
    return request({
      url: '/api/v1/seller/storeinfo',
      method: 'put',
      data
    })
  }
  export function test(data) {
    return request({
      url: '/api/v1/seller/school',
      method: 'get',
      params: {
        limit:0
      }
    })
  }
// sellerGoods
  export function addGoods_api(data) {
    return request({
      url: '/api/v1/seller/goodscommon',
      method: 'post',
      data
    })
  }
  export function getGoodsList_api(data) {
    return request({
      url: '/api/v1/seller/goodscommon',
      method: 'get',
      params: data
    })
  }
  export function editGoods_api(data) {
    return request({
      url: '/api/v1/seller/goodscommon',
      method: 'put',
      data
    })
  }
  export function getGoods_api(data) {
    return request({
      url: '/api/v1/seller/goodscommon',
      method: 'get',
      params: data
    })
  }
  export function getSchoolList_api(data) { //获取门店列表
    console.log('inner getPostionList_api')
    return request({
      url: '/api/v1/seller/school',
      method: 'get',
      params: data
    })
  }
  export function upDownGoods_api(data) {
    return request({
      url: '/api/v1/seller/goodscommon',
      method: 'put',
      data
    })
  }
  
  
// order => rOrder
  export function changeROrder_api(data) {
    return request({
      url: '/api/v1/seller/orderstate?order_id='+data.order_id,
      method: 'put',
      data
    })
  }
  export function getROrderList_api(data) {
    return request({
      url: '/api/v1/seller/order',
      method: 'get',
      params: data
    })
  }
  export function getROrder_api(data) {
    return request({
      url: '/api/v1/seller/order',
      method: 'get',
      params: data
    })
  }

// order => VOrder
  export function changeVOrder_api(data) {
    return request({
      url: '/api/v1/seller/vrorder?order_id='+data.order_id,
      method: 'put',
      data
    })
  }
  export function getVOrderList_api(data) {
    return request({
      url: '/api/v1/seller/vrorder',
      method: 'get',
      params: data
    })
  }
  export function getVOrder_api(data) {
    return request({
      url: '/api/v1/seller/vrorder',
      method: 'get',
      params: data
    })
  }
// return => rReturn
  export function getReturnList(data) {
    return request({
      url: '/api/v1/seller/refundreturn',
      method: 'get',
      params:data,
    })
  }
  export function editReturnList(data) {
    return request({
      url: '/api/v1/seller/refundreturn',
      method: 'put',
      data,
    })
  }
  
// appointment
  export function getAppointmentList_api(data) {
    return request({
      url: '/api/v1/seller/appointment',
      method: 'get',
      params: data
    })
  }
  export function changeAppointmentList_api(data) {
    return request({
      url: '/api/v1/seller/appointment',
      method: 'put',
      params: data,
      data
    })
  }
// Coupon
  export function getCouponList_api(data) {
    return request({
      url: '/api/v1/seller/discountCoupon',
      method: 'get',
      params: data
    })
  }
  export function addCoupon_api(data) {
    return request({
      url: '/api/v1/seller/discountCoupon',
      method: 'post',
      data
    })
  }
  export function deleteCoupon_api(data){
    return request ({
      url:'/api/v1/seller/discountCoupon',
      method:'delete',
      data
    })
  }
//server => entry
  export function getEntryList_api(data) {
    return request({
      url: '/api/v1/seller/storegc',
      method: 'get',
      params: data
    })
  }
  export function editEntry_api(data) {
    return request({
      url: '/api/v1/seller/storegc',
      method: 'put',
      data
    })
  }
//server => rec
  //获取推荐列表 这里和 getGoodsList_api 共用一个接口 goods_commend 0 1
    // export function getGoodsList_api(data) {
    //   return request({
    //     url: '/api/v1/seller/goodscommon',
    //     method: 'get',
    //     params: data
    //   })
    // }

  // 编辑 goods_commonid:id type:"recommend", "notrecommend"
  export function editRec_api(data) { 
    return request({
      url: '/api/v1/seller/goodscommon',
      method: 'put',
      data
    })
  }
//server => Activity =>dis
  export function getActivityList_api(data) {
    return request({
      url: '/api/v1/seller/distribution',
      method: 'get',
      params: data
    })
  }
  export function addActivity_api(data) { 
    return request({
      url: '/api/v1/seller/distribution',
      method: 'post',
      data
    })
  }
  export function deleteActivity_api(data) { 
    return request({
      url: '/api/v1/seller/distribution?distribution_id='+data.distribution_id,
      method: 'delete',
    })
  }
//server => Activity => vote
  export function getVoteList_api(data) {
    return request({
      url: '/api/v1/seller/vote',
      method: 'get',
      params: data
    })
  }
  export function addVote_api(data) { 
    return request({
      url: '/api/v1/seller/vote',
      method: 'post',
      data
    })
  }
  export function deleteVote_api(data) { 
    return request({
      url: '/api/v1/seller/vote?vote_id='+data.vote_id,
      method: 'delete',
    })
  }
//server => school
  // this.getSchoolList() 已存在
  export function deleteSchool_api(id) { 
    return request({
      url: '/api/v1/seller/school?school_id='+id,
      method: 'delete',
    })
  }
  export function addSchool_api(data) { 
    return request({
      url: '/api/v1/seller/school',
      method: 'post',
      data
    })
  }
  export function editSchool_api(data) { 
    return request({
      url: '/api/v1/seller/school?school_id='+data.school_id,
      method: 'put',
      data
    })
  }
//server => banner
  export function getBannerList_api(data) {
    return request ({
      url:'/api/v1/seller/banner',
      method:'get',
      data
    })
  }

  export function deleteBanner_api(id){
    return request ({
      url:'/api/v1/seller/banner?banner_id='+ id,
      method:'delete',
    })
  }

  export function addBanner_api(data){
    return request({
      url:'/api/v1/seller/banner',
      method:'post',
      data
    })
  }

  export function editBanner_api(data){
    return request({
      url:'/api/v1/seller/banner',
      method:'put',
      data
    })
  }
//server => act
  export function deleAct_api(data) {
    return request({
      url: '/api/v1/seller/dynamic',
      method: 'delete',
      data: data
    })
  }
  export function addAct_api(data) {
    return request({
      url: '/api/v1/seller/dynamic',
      method: 'post',
      data
    })
  }
  export function getActList_api(data) {
    return request({
      url: '/api/v1/seller/dynamic',
      method: 'get',
      params: data
    })
  }
// server => shop
  export function editShopText_api(data){
    return request({
      url:'/api/v1/seller/storeinfo',
      method:'put',
      data
    })
  }

  export function getIntroForm_api(data){
    return request({
      url:'/api/v1/seller/storeinfo',
      method:'get',
      params:data
    })
  }
// server => glow
  export function getFlowList_api(data){
    return request({
      url:'/api/v1/seller/flowpackage',
      method:'get',
      params:data
    })
  }
  export function buyFlow_api(data){
    return request({
      url:'/api/v1/seller/floworder',
      method:'post',
      params:data,
      data
    })
  }
  export function buyFlowState_api(data){
    return request({
      url:'/api/v1/seller/floworder',
      method:'get',
      params:data
    })
  }
// server => kill
export function getKillList_api(data){
  return request({
    url:'/api/v1/seller/cutprice',
    method:'get',
    params:data
  })
}
export function addKillBuy_api(data){
  return request({
    url:'/api/v1/seller/cutprice',
    method:'post',
    params:data,
    data
  })
}
export function deleteKill_api(data){
  return request({
    url:'/api/v1/seller/cutprice',
    method:'delete',
    params:data,
    data
  })
}
// server => allBuy
export function getAllBuyList_api(data){
  return request({
    url:'/api/v1/seller/groupbuying',
    method:'get',
    params:data
  })
}
export function addAllBuy_api(data){
  return request({
    url:'/api/v1/seller/groupbuying',
    method:'get',
    params:data
  })
}
export function deleteAllBuy_api(data){
  return request({
    url:'/api/v1/seller/groupbuying',
    method:'get',
    params:data
  })
}
export function editAllBuy_api(data){
  return request({
    url:'/api/v1/seller/groupbuying',
    method:'post',
    params:data,
    data
  })
}

// auth
  export function getAuthList_api(data) {
    return request({
      url: '/api/v1/seller/seller',
      method: 'get',
      params: data
    })
  }
  export function deleteAuth_api(data) {
    return request({
      url: '/api/v1/seller/seller',
      method: 'delete',
      data: data
    })
  }
  export function addAuth_api(data) {
    return request({
      url: '/api/v1/seller/seller',
      method: 'post',
      data: data
    })
  }
  export function editAuth_api(data) {
    return request({
      url: '/api/v1/seller/seller',
      method: 'put',
      data: data
    })
  }
// ----------------------------------------------
// class 
async function setClass(data, _this){
  let res = await request({
    url: '/api/v2/seller/storegc',
    method: 'post',
    data,
  });
  console.log('res ', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '添加成功' })// res.data; 
}

async function updateClass(id, data, _this){
  let res = await request({
    url: `/api/v2/seller/storegc/${id}`,
    method: 'put',
    data,
  });
  console.log('update address', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '更新成功' })// res.data; 
}

async function deleteClass(id, data, _this){
  let res = await request({
    url: `/api/v2/seller/storegc/${id}`,
    method: 'DELETE',
    data,
  });
  console.log('delete address', res);
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '删除成功' })// res.data; 
}

async function getClassList(params, _this){
  let res = await request({
    url: '/api/v2/seller/storegc',
    methods: 'get',
    params,
  });

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data; 
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

async function deleteGoods(data, _this){
  let res = await request({
    url: `/api/v1/seller/goodscommon`,
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
  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : _this.$notify.success({ title: '提示', message: '添加成功' })// res.data;
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

  return res.data.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.data.error, }) : res.data; 
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
}