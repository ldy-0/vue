import request from '@/utils/request'

async function addClass(data) {
	return request({
		url: '/api/v2/seller/classify',
		method: 'post',
		data
	})
}

async function getClassList(data) {
	let res = await request({
				url: '/api/v2/seller/classify',
				method: 'get',
				params: data
			});

	return res;
}

async function editClassList(id, data) {
	let res = await request({
				url: `/api/v2/seller/classify/${id}`,
				method: 'PUT',
				data
			});

	return res;
}

async function deleteClassList(data) {
	let res = await request({
				url: '/api/v2/seller/classify/'+data,
				method: 'delete',
			});

	return res;
}

export default {
	addClass,
	getClassList,
	editClassList,
	deleteClassList,
}