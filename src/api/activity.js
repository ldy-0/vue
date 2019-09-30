//平台登录请求的api
import request from '@/utils/request'

async function getRainSwitch(params) {
	let res = await request({
				url: `/api/v2/seller/luckymoney/create`,
				method: 'GET',
			  params,	
      });

	return res;
}

async function setRainSwitch(data) {
	let res = await request({
				url: `/api/v2/seller/luckymoney/setting`,
				method: 'PUT',
			  data,	
      });

	return res;
}

async function getRainList(data) {
	let res = await request({
				url: '/api/v2/seller/luckymoney',
				method: 'get',
				params: data
			});

	return res;
}

async function getRain(id, data) {
	let res = await request({
				url: `/api/v2/seller/luckymoney/${id}`,
				method: 'get',
				params: data
			});

	return res;
}

async function addRain(data) {
	return request({
		url: '/api/v2/seller/luckymoney',
		method: 'post',
		data
	})
}

async function setRain(id, data) {
	let res = await request({
				url: `/api/v2/seller/luckymoney/${id}`,
				method: 'put',
				data
			});

	return res;
}

async function changeRain(id, data) {
	let res = await request({
				url: `/api/v2/seller/luckymoney/${id}/edit`,
				method: 'get',
				params: data
			});

	return res;
}

async function deleteRain(id, data) {
	let res = await request({
				url: `/api/v2/seller/luckymoney/${id}`,
				method: 'delete',
				data
			});

	return res;
}

export default {
  getRainList,
  addRain,
  setRain,
  getRain,
  changeRain,
  deleteRain,
  getRainSwitch,
  setRainSwitch,
}