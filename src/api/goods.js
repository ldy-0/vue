//平台登录请求的api
import request from '@/utils/request'

export function addGoods(data) {
	return request({
		url: '/api/v2/seller/goodscommon',
		method: 'post',
		data
	})
}

async function setGoods(id, data) {
	let res = await request({
				url: `/api/v2/seller/goodscommon/${id}`,
				method: 'put',
				data
			});

	return res;
}

async function changeGoods(data) {
	let res = await request({
				url: `/api/v2/seller/goodscommon/setting`,
				method: 'put',
				data
			});
	return res;
}

async function getGoods(id, data) {
	let res = await request({
				url: `/api/v2/seller/goodscommon/${id}`,
				method: 'get',
				params: data
			});

	return res;
}

async function deleteGoods(id, data) {
	let res = await request({
				url: `/api/v2/seller/goodscommon/${id}`,
				method: 'delete',
				data
			});

	return res;
}

async function getGoodsList(data) {
	let res = await request({
				url: '/api/v2/seller/goodscommon',
				method: 'get',
				params: data
			});

	return res;
}

/**
 * 
 * vip特惠
 * 
 */

async function getVipSpecialList(data) {
	let res = await request({
				url: '/api/v2/seller/bargains',
				method: 'get',
				params: data
			});

	return res;
}

async function addSpecial(data) {
	return request({
		url: '/api/v2/seller/bargains',
		method: 'post',
		data
	})
}

async function deleteSpecial(id, data) {
	let res = await request({
				url: `/api/v2/seller/bargains/${id}`,
				method: 'delete',
				data
			});

	return res;
}

async function setSpecial(id, data) {
	let res = await request({
				url: `/api/v2/seller/bargains/${id}`,
				method: 'put',
				data
			});

	return res;
}

async function changeSpecial(data) {
	let res = await request({
				url: `/api/v2/seller/bargains/setting`,
				method: 'put',
				data
			});
	return res;
}

/**
 * 
 * VIP解读
 * 
 */

async function getVipReadList(data) {
	let res = await request({
				url: '/api/v2/seller/goodsexplain',
				method: 'get',
				params: data
			});

	return res;
}

async function addRead(data) {
	return request({
		url: '/api/v2/seller/goodsexplain',
		method: 'post',
		data
	})
}

async function setRead(id, data) {
	let res = await request({
				url: `/api/v2/seller/goodsexplain/${id}`,
				method: 'put',
				data
			});

	return res;
}

async function deleteRead(id, data) {
	let res = await request({
				url: `/api/v2/seller/goodsexplain/${id}`,
				method: 'delete',
				data
			});

	return res;
}

export default {
	addGoods,
	setGoods,
	getGoods,
	deleteGoods,
	getGoodsList,
  changeGoods,

  getVipSpecialList,
  addSpecial,
  setSpecial,
  deleteSpecial,
  changeSpecial,

  getVipReadList,
  addRead,
  setRead,
  deleteRead,
}