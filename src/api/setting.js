
import request from '@/utils/request'

async function addVisitor(data) {
	return request({
		url: '/api/v2/seller/visitor',
		method: 'post',
		data
	})
}

async function getVisitor(data) {
	let res = await request({
				url: '/api/v2/common/visitor',
				method: 'get',
				params: data
			});

	return res;
}

async function addGif(data) {
	return request({
		url: '/api/v2/seller/gif',
		method: 'post',
		data
	})
}

async function getGif(data) {
	let res = await request({
				url: '/api/v2/common/gif',
				method: 'get',
				params: data
			});

	return res;
}

// async function editClassList(data) {
// 	let res = await request({
// 				url: '/api/v2/seller/storegc/'+data.storegc_id,
// 				method: 'put',
// 				data
// 			});

// 	return res;
// }

// async function deleteClassList(data) {
// 	let res = await request({
// 				url: '/api/v2/seller/storegc/'+data,
// 				method: 'delete',
// 			});

// 	return res;
// }


export default {
	addVisitor,
  getVisitor,
  addGif,
  getGif,
}