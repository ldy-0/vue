//平台登录请求的api
import request from '@/utils/request'

export function addClass(data) {
	return request({
		url: '/api/v2/seller/storegc',
		method: 'post',
		data
	})
}

async function getClassList(data) {
	let res = await request({
				url: '/api/v2/seller/storegc',
				method: 'get',
				params: data
			});

	return res;
}
async function editClassList(data) {
	let res = await request({
				url: '/api/v2/seller/storegc/'+data.storegc_id,
				method: 'put',
				data
			});

	return res;
}
async function deleteClassList(data) {
	let res = await request({
				url: '/api/v2/seller/storegc/'+data,
				method: 'delete',
			});

	return res;
}

export default {
	addClass,
	getClassList,
	editClassList,
	deleteClassList
}