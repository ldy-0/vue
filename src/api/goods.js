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

async function UpDownGoods(data) {
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

export default {
	addGoods,
	setGoods,
	getGoods,
	deleteGoods,
	getGoodsList,
	UpDownGoods
}