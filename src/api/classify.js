//平台登录请求的api
import request from '@/utils/request'

async function addClass(data) {
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

// 自定义分类
async function getCustomClassList(data) {
	let res = await request({
				url: '/api/v2/seller/customcatalog',
				method: 'get',
				params: data
			});

	return res;
}

async function addCustomClass(data) {
	return request({
		url: '/api/v2/seller/customcatalog',
		method: 'post',
		data
	})
}

async function editCustomClass(data) {
	let res = await request({
				url: '/api/v2/seller/customcatalog/'+data.storegc_id,
				method: 'put',
				data
			});

	return res;
}

async function deleteCustomClass(id, data){
	let res = await request({
				url: `/api/v2/seller/customcatalog/${id}`,
        method: 'delete',
        data,
			});

	return res;
}

async function getClassGoodsList(id, data) {
	let res = await request({
				url: `/api/v2/seller/customcataloggoods/${id}`,
				method: 'get',
				params: data
			});

	return res;
}

async function addGoods(data) {
	return request({
		url: '/api/v2/seller/customcataloggoods',
		method: 'post',
		data
	})
}

async function deleteGoods(id, data){
	let res = await request({
				url: `/api/v2/seller/customcataloggoods/${id}`,
        method: 'delete',
        data,
			});

	return res;
}

// 新闻分类
async function getNewsClassList(data) {
	let res = await request({
				url: '/api/v2/seller/informationclass',
				method: 'get',
				params: data
			});

	return res;
}

async function addNewsClass(data) {
	return request({
		url: '/api/v2/seller/informationclass',
		method: 'post',
		data
	})
}

async function editNewsClass(id, data) {
	let res = await request({
				url: `/api/v2/seller/informationclass/${id}`,
				method: 'put',
				data
			});

	return res;
}

async function deleteNewsClass(id, data){
	let res = await request({
				url: `/api/v2/seller/informationclass/${id}`,
        method: 'delete',
        data,
			});

	return res;
}

export default {
	addClass,
	getClassList,
	editClassList,
  deleteClassList,
  getCustomClassList,
  addCustomClass,
  editCustomClass,
  deleteCustomClass,
  getClassGoodsList,
  addGoods,
  deleteGoods,
  getNewsClassList,
  addNewsClass,
  editNewsClass,
  deleteNewsClass,
}