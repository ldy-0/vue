import request from '@/utils/request'

// test
export function test2(data) {
	return request({
		url: '/api/v2/seller/storeinfo',
		method: 'put',
		data
	})
}
export function test(data) {
	return request({
		url: '/api/v2/seller/school',
		method: 'get',
		params: {
			limit: 0
		}
	})
}
// sellerGoods
//添加商品
export function addGoods_api(data) {
	return request({
		url: '/api/v2/seller/goodscommon',
		method: 'post',
		data
	})
}
//获取商品列表
export function getGoodsList_api(data) {
	return request({
		url: '/api/v2/seller/goodscommon',
		method: 'get',
		params: data
	})
}
export function editGoods_api(data) {
	return request({
		url: '/api/v2/seller/goodscommon',
		method: 'put',
		data
	})
}
//获取商品详情
export function getGoods_api(data) {
	//console.log(data)
	return request({
		url: '/api/v2/seller/goodscommon/' + data,
		method: 'get',
		// params: data
	})
}
export function getSchoolList_api(data) { //获取校区列表
	console.log('inner getPostionList_api')
	return request({
		url: '/api/v2/seller/school',
		method: 'get',
		params: data
	})
}
//上下架商品
export function upDownGoods_api(data) {
	return request({
		url: '/api/v2/seller/goodscommon',
		method: 'put',
		data
	})
}
//删除单个商品
export function deleGoods_api(data) {
	return request({
		url: '/api/v2/seller/goodscommon/' + data.goods_commonid,
		method: 'delete',
		data
	})
}



// order => rOrder
export function changeROrder_api(data) {
	return request({
		url: '/api/v2/seller/orderstate?order_id=' + data.order_id,
		method: 'put',
		data
	})
}
//获取订单列表
export function getROrderList_api(data) {
	return request({
		url: '/api/v2/seller/order',
		method: 'get',
		params: data
	})
}
export function getROrder_api(data) {
	//console.log(data)
	return request({
		url: '/api/v2/seller/order/' + data,
		method: 'get',
	})
}
export function rOrderState_api(data) {
	return request({
		url: '/api/v2/seller/orderstate',
		method: 'put',
		data: data
	})
}
//派单
export function pushWoker_api(data) {
	return request({
		url: '/api/v2/seller/workerorder',
		method: 'post',
		data: data
	})
}

//coupon => coupon
export function getCouponList_api(data) {
	return request({
		url: '/api/v2/seller/fullreductionvoucher',
		method: 'get',
		params: data
	})
}
export function addCoupon_api(data) {
	return request({
		url: '/api/v2/seller/fullreductionvoucher',
		method: 'post',
		data
	})
}

export function deleCoupon_api(data) {
	return request({
		url: '/api/v2/seller/discountCoupon',
		method: 'delete',
		data
	})
}

// appointment
export function getAppointmentList_api(data) {
	return request({
		url: '/api/v2/seller/appointment',
		method: 'get',
		params: data
	})
}


//获取商品分类信息
export function getEntryList_api(data) {
	return request({
		url: '/api/v2/seller/storegc',
		method: 'get',
		params: data
	})
}
export function editEntry_api(data) {
	return request({
		url: '/api/v2/seller/storegc',
		method: 'put',
		data
	})
}
//商品推荐设置
export function setting_api(data) {
	return request({
		url: '/api/v2/seller/goodscommon/setting',
		method: 'put',
		data
	})
}
// 商品修改
export function editRec_api(data) {
	return request({
		url: '/api/v2/seller/goodscommon/' + data.goods_commonid,
		method: 'put',
		data
	})
}
//server => Activity =>dis
export function getActivityList_api(data) {
	return request({
		url: '/api/v2/seller/distribution',
		method: 'get',
		params: data
	})
}
export function addActivity_api(data) {
	return request({
		url: '/api/v2/seller/distribution',
		method: 'post',
		data
	})
}
export function deleteActivity_api(data) {
	return request({
		url: '/api/v2/seller/distribution?distribution_id=' + data.distribution_id,
		method: 'delete',
	})
}
//server => Activity => vote
export function getVoteList_api(data) {
	return request({
		url: '/api/v2/seller/vote',
		method: 'get',
		params: data
	})
}
export function addVote_api(data) {
	return request({
		url: '/api/v2/seller/vote',
		method: 'post',
		data
	})
}
export function deleteVote_api(data) {
	return request({
		url: '/api/v2/seller/vote?vote_id=' + data.vote_id,
		method: 'delete',
	})
}
//server => school
// this.getSchoolList() 已存在
export function deleteSchool_api(id) {
	return request({
		url: '/api/v2/seller/school?school_id=' + id,
		method: 'delete',
	})
}
export function addSchool_api(data) {
	return request({
		url: '/api/v2/seller/school',
		method: 'post',
		data
	})
}
export function editSchool_api(data) {
	return request({
		url: '/api/v2/seller/school?school_id=' + data.school_id,
		method: 'put',
		data
	})
}
//获取轮播图列表
export function getBannerList_api(data) {
	return request({
		url: '/api/v2/seller/banner',
		method: 'get',
		params: data
	})
}

export function deleteBanner_api(id) {
	return request({
		url: '/api/v2/seller/banner/' + id,
		method: 'delete',
	})
}
//增加轮播图
export function addBanner_api(data) {
	return request({
		url: '/api/v2/seller/banner',
		method: 'post',
		data
	})
}

export function editBanner_api(data) {
	  console.log(data)
	return request({
		url: '/api/v2/seller/banner/'+data.banner_id,
		method: 'put',
		data
	})
}
//会员管理
export function getMember_api(data) {
	return request({
		url: '/api/v2/seller/member',
		method: 'get',
		params: data
	})
}
//评价管理
export function goodEvaluate_api(data) {
	return request({
		url: '/api/v2/seller/goodsevaluate',
		method: 'get',
		params: data
	})
}
//工人管理
export function getWorker_api(data) {
	return request({
		url: '/api/v2/seller/worker',
		method: 'get',
		params: data
	})
}

export function deleteWorker_api(data) {
	console.log(data)
	return request({
		url: '/api/v2/seller/worker/' + data.workerId,
		method: 'DELETE',
		params: data
	})
}
export function addWorker_api(data) {

	return request({
		url: '/api/v2/seller/worker',
		method: 'post',
		data
	})
}
export function WorkerDetail_api(data) {

	return request({
		url: '/api/v2/seller/workerorder',
		method: 'get',
		params: data
	})
}
export function WorkerOrderDetail_api(data) {

	return request({
		url: '/api/v2/seller/workerorder/'+data,
		method: 'get',
		//params: data
	})
}
//以下为案例推广
export function deleAct_api(data) {
	return request({
		url: '/api/v2/seller/dynamic/' + data.dynamic_id,
		method: 'delete',
	})
}
export function addAct_api(data) {
	return request({
		url: '/api/v2/seller/dynamic',
		method: 'post',
		data
	})
}
export function getActList_api(data) {
	return request({
		url: '/api/v2/seller/dynamic',
		method: 'get',
		params: data
	})
}
// server => shop
export function editShopText_api(data) {
	return request({
		url: '/api/v2/seller/storeinfo',
		method: 'put',
		data
	})
}

export function getIntroForm_api(data) {
	return request({
		url: '/api/v2/seller/storeinfo',
		method: 'get',
		params: data
	})
}
// auth
export function getAuthList_api(data) {
	return request({
		url: '/api/v2/seller/seller',
		method: 'get',
		params: data
	})
}
export function deleteAuth_api(data) {
	return request({
		url: '/api/v2/seller/seller',
		method: 'delete',
		data: data
	})
}
export function addAuth_api(data) {
	return request({
		url: '/api/v2/seller/seller',
		method: 'post',
		data: data
	})
}
export function editAuth_api(data) {
	console.log("data===>",data)
	return request({
		url: '/api/v2/seller/seller/'+data.seller_id,
		method: 'put',
		data: data
	})
}
// -----creditShop =>  section---------------

export function getCreditSection_api(data) {
	return request({
		url: '/api/v2/seller/integralsubsection',
		method: 'get',
		params: data
	})
}
export function addCreditSection_api(data) {
	return request({
		url: '/api/v2/seller/integralsubsection',
		method: 'post',
		data: data
	})
}
export function deleCreditSection_api(data) {
	return request({
		url: '/api/v2/seller/integralsubsection',
		method: 'delete',
		data: data
	})
}
export function editCreditSection_api(data) {
	return request({
		url: '/api/v2/seller/integralsubsection',
		method: 'put',
		data: data
	})
}

//————————sales =>sales-------
// export function getSales_api(data){
//   return request({
//     url:'/api/v2/seller/saler',
//     method: 'get',
//     params:data
//   })
// }

export function getChild_api(data) {
	return request({
		url: '/api/v2/saler/getSalerInfo',
		method: 'get',
		params: data
	})
}


export function addSales_api(data) {
	return request({
		url: '/api/v2/seller/saler',
		method: 'post',
		data: data
	})
}

export function deleteSales_api(data) {
	return request({
		url: '/api/v2/seller/saler',
		method: 'delete',
		data: data
	})
}
export function deleteChildSales_api(data) {
	return request({
		url: '/api/v2/seller/salerlevel',
		method: 'delete',
		data: data
	})
}



//——————————infomation => infomation--------
export function getInfo_api(data) {
	return request({
		url: '/api/v2/wxtitle/wxtitle',
		method: 'get',
		params: data
	})
}

export function addInfo_api(data) {
	return request({
		url: '/api/v2/wxtitle/wxtitle',
		method: 'post',
		data: data
	})
}

export function deleteInfo_api(data) {
	return request({
		url: '/api/v2/wxtitle/wxtitle',
		method: 'delete',
		data: data
	})
}

//修改资讯
// export function editInfo_api(data) {
//   return request({
//     url:'/api/v2/wxtitle/wxtitle',
//     method: 'put',
//     data: data
//   })
// }


//---------------cresitShop => creditShop----

export function addCreditGoods_api(data) {
	return request({
		url: '/api/v2/seller/integralstore',
		method: 'post',
		data
	})
}
export function getCreditGoodsList_api(data) {
	return request({
		url: '/api/v2/seller/integralstore',
		method: 'get',
		params: data
	})
}
export function editCreditGoods_api(data) {
	return request({
		url: '/api/v2/seller/integralstore',
		method: 'put',
		data
	})
}
export function getCreditGoods_api(data) {
	return request({
		url: '/api/v2/seller/integralstore',
		method: 'get',
		params: data
	})
}

export function upDownCreditGoods_api(data) {
	return request({
		url: '/api/v2/seller/integralsoldout',
		method: 'get',
		params: data
	})
}
export function upDownCreditGoods_api2(data) {
	return request({
		url: '/api/v2/seller/integralbatchsoldout',
		method: 'put',
		data
	})
}

export function deleCreditGoods_api(data) {
	return request({
		url: '/api/v2/seller/integralstore',
		method: 'delete',
		data
	})
}


//----------setting => payType--------
export function getCheckList_api(data) {
	return request({
		url: '/api/v2/seller/payment',
		method: 'get',
		params: data
	})
}

export function putCheckList_api(data) {
	return request({
		url: '/api/v2/seller/payment',
		method: 'put',
		data
	})
}


// -----------setting => goodsType---------
//获取自定义分类
export function getIndustryList_api(data) {
	return request({
		url: '/api/v2/seller/storegc',
		method: 'get',
		params: data
	})
}
//添加分类（各级）
export function addIndustry_api(data) {
	return request({
		url: '/api/v2/seller/storegc',
		method: 'post',
		data
	})
}
export function deleteIndustry_api(id) {
	return request({
		url: '/api/v2/seller/storegc/' + id,
		method: 'delete',
	})
}

export function editIndustry_api(data) {
	return request({
		url: '/api/v2/seller/storegc',
		method: 'put',
		data
	})
}

// -----------setting => credit---------
export function getCredit_api(data) {
	return request({
		url: '/api/v2/seller/getintegrate',
		method: 'get',
		params: data
	})
}
export function editCredit_api(data) {
	return request({
		url: '/api/v2/seller/getintegrate',
		method: 'put',
		data
	})
}


//---------------user-------


export function addUser_api(data) {
	return request({
		url: '/api/v2/seller/member',
		method: 'post',
		data
	})
}

//-------------comment => comment-----------
export function getComment_api(data) {
	return request({
		url: '/api/v2/seller/getpcomments',
		method: 'get',
		params: data
	})
}

export function getCommentItem_api(data) {
	return request({
		url: '/api/v2/seller/getpcomments',
		method: 'get',
		params: data
	})
}

export function deleteComment_api(data) {
	return request({
		url: '/api/v2/seller/getpcomments',
		method: 'get',
		params: data
	})
}

// export function changeStatus_api(data) {
//   return request({
//     url: '/api/v2/seller/getpcomments',
//     method: 'get',
//     params: data
//   })
// }


//=================玉秀发api======================================================
//申请列表


export function changeStatus_api(data) {
	return request({
		url: '/api/v2/seller/salestatus',
		method: 'put',
		data
	})
}

export function deleteApplication_api(data) {
	return request({
		url: '/api/v2/seller/sale',
		method: 'delete',
		data
	})
}

//首页分类------------
//热门推荐商品（废弃）
export function getIndustryList2_api(data) {
	return request({
		url: '/api/v2/seller/indexclass',
		method: 'get',
		params: data
	})
}

export function addIndustry2_api(data) {
	return request({
		url: '/api/v2/seller/indexclass',
		method: 'post',
		data
	})
}
export function deleteIndustry2_api(data) {
	return request({
		url: '/api/v2/seller/indexclass',
		method: 'delete',
		data
	})
}


//==============================便利店========================================
//--------分销中心--------------------
//--------分销统计-------
export function getSales_api(data) {
	return request({
		url: '/api/v2/seller/saler',
		method: 'get',
		params: data
	})
}
export function getSalecount_api(data) {
	return request({
		url: '/api/v2/seller/salercount',
		method: 'get',
		params: data
	})
}

//----------分销设置-------------------
export function getSaleConfig_api(data) {
	return request({
		url: '/api/v2/seller/saleconfig',
		method: 'get',
		params: data
	})
}
export function editSaleConfig_api(data) {
	return request({
		url: '/api/v2/seller/saleconfig',
		method: 'put',
		data
	})
}

//-------------会员管理---------------
export function getUser_api(data) {
	return request({
		url: '/api/v2/seller/member',
		method: 'get',
		params: data
	})
}
export function getSaleChild_api(data) {
	return request({
		url: '/api/v2/seller/membersaler',
		method: 'get',
		params: data
	})
}
export function changeRanks_api(data) {
	return request({
		url: '/api/v2/seller/rank',
		method: 'put',
		data
	})
}

//=====================分销提现================
export function getWithdraw_api(data) {
	return request({
		url: '/api/v2/seller/withdraw',
		method: 'get',
		params: data
	})
}

export function changeWithdraw_api(data) {
	return request({
		url: '/api/v2/seller/withdraw',
		method: 'put',
		data
	})
}
export function deleteWithdra_api(data) {
	return request({
		url: '/api/v2/seller/withdraw',
		method: 'delete',
		data
	})
}

export function getWithdrawRecord_api(data) {
	return request({
		url: '/api/v2/seller/withdrawinfo',
		method: 'get',
		params: data
	})
}



//

// return => rReturn======================================
// export function getReturnList(data) {
//   return request({
//     url: '/api/v2/seller/refundreturn',
//     method: 'get',
//     params:data,
//   })
// }
// export function editReturnList(data) {
//   return request({
//     url: '/api/v2/seller/refundreturn',
//     method: 'put',
//     data,
//   })
// }
