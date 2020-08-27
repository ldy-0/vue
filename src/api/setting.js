
import request from '@/utils/request'

// appLogo
async function getApp(data) {
	let res = await request({
				url: '/api/v2/seller/app',
				method: 'get',
				params: data
			});

	return res;
}

async function setApp(data){
	return request({
		url: '/api/v2/seller/app',
		method: 'post',
		data
	})
}

// 公司简介
async function getCompany(data) {
	return request({
		url: '/api/v2/seller/company',
		method: 'get',
		params: data
	});
}

async function setCompany(data){
	return request({
		url: '/api/v2/seller/company',
		method: 'post',
		data
	})
}

// 联系我们
export async function getContact(data) {
	let res = await request({
				url: '/api/v2/seller/contact',
				method: 'get',
				params: data
			});

	return res;
}

export async function setContact(data) {
	let res = await request({
				url: '/api/v2/seller/contact',
				method: 'POST',
				data,
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

async function addApk(data){
	return request({
		url: '/api/v2/seller/androidversion',
		method: 'post',
		data
	})
}

async function getApk(data) {
	let res = await request({
				url: '/api/v2/common/androidversion',
				method: 'get',
				params: data
			});

	return res;
}

// app share
async function getShareList(data) {
	let res = await request({
				url: '/api/v2/seller/appactivity',
				method: 'get',
				params: data
			});

	return res;
}

async function addShare(data){
	return request({
		url: '/api/v2/seller/appactivity',
		method: 'post',
		data
	})
}

async function setShare(id, data){
	return request({
		url: `/api/v2/seller/appactivity/${id}`,
		method: 'put',
		data
	})
}

async function deleteShare(id, data){
	return request({
		url: `/api/v2/seller/appactivity/${id}`,
		method: 'delete',
		data
	})
}

async function changeShare(id, data){
	return request({
		url: `/api/v2/seller/appactivity/${id}/edit`,
		method: 'get',
		data
	})
}

export default {
	getApp,
	setApp,

	getCompany,
	setCompany,

	getContact,
	setContact,
		
  addGif,
  getGif,
  addApk,
  getApk,

  getShareList,
  addShare,
  setShare,
  deleteShare,
  changeShare,
}