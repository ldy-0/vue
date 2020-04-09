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

// sign
function getSignSwitch(params) {
  let opt = {
				url: `/api/v2/seller/signin/create`,
				method: 'GET',
			  params,	
      };

	return request(opt);
}

function setSignSwitch(data) {
  let opt = {
				url: `/api/v2/seller/signin/setting`,
				method: 'PUT',
			  data,	
      };

	return request(opt);
}

function getSignList(params) {
  let opt = {
				url: `/api/v2/seller/signin`,
				method: 'GET',
			  params,	
      };

	return request(opt);
}

function getSign(id, params) {
  let opt = {
				url: `/api/v2/seller/signin/${id}`,
				method: 'GET',
			  params,	
      };

	return request(opt);
}

function addSign(data) {
  let opt = {
				url: `/api/v2/seller/signin`,
				method: 'POST',
			  data,	
      };

	return request(opt);
}

function setSign(id, data) {
  let opt = {
				url: `/api/v2/seller/signin/${id}`,
				method: 'PUT',
			  data,	
      };

	return request(opt);
}

async function changeSign(id, data) {
	let res = await request({
				url: `/api/v2/seller/signin/${id}/edit`,
				method: 'get',
				params: data
			});

	return res;
}

function deleteSign(id, params) {
  let opt = {
				url: `/api/v2/seller/signin/${id}`,
				method: 'DELETE',
			  params,	
      };

	return request(opt);
}

// share poster
function getPosterList(params) {
  let opt = {
				url: `/api/v2/seller/poster`,
				method: 'GET',
			  params,	
      };

	return request(opt);
}

function addPoster(data) {
  let opt = {
				url: `/api/v2/seller/poster`,
				method: 'POST',
			  data,	
      };

	return request(opt);
}

function setPoster(id, data) {
  let opt = {
				url: `/api/v2/seller/poster/${id}`,
				method: 'PUT',
			  data,	
      };

	return request(opt);
}

function deletePoster(id, params) {
  let opt = {
				url: `/api/v2/seller/poster/${id}`,
				method: 'DELETE',
			  params,	
      };

	return request(opt);
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

  getSign,
  getSignList,
  getSignSwitch,
  setSignSwitch,
  addSign,
  setSign,
  changeSign,
  deleteSign,

  getPosterList,
  addPoster,
  setPoster,
  deletePoster,
}