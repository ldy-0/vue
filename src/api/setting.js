
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

// 首页设置
async function setHome(data){
	return request({
		url: '/api/v2/seller/indexconfig',
		method: 'post',
		data
	})
}

async function getHome(data) {
	let res = await request({
				url: '/api/v2/common/indexconfig',
				method: 'get',
				params: data
			});

	return res;
}

// dscore activity
async function getDScoreList(data) {
	let res = await request({
				url: '/api/v2/seller/applyactivity',
				method: 'get',
				params: data
			});

	return res;
}

async function addDScore(data){
	return request({
		url: '/api/v2/seller/applyactivity',
		method: 'post',
		data
	})
}

async function deleteDScore(id, data){
	return request({
		url: `/api/v2/seller/applyactivity/${id}`,
		method: 'delete',
		data
	})
}

// 资产设置
export async function getAssetSetting(data) {
	let res = await request({
				url: '/api/v2/seller/assetssetting',
				method: 'get',
				params: data
			});

	return res;
}

export async function setAssetSetting(data) {
	let res = await request({
				url: '/api/v2/seller/assetssetting',
				method: 'POST',
				data,
			});

	return res;
}

// 返利设置
export async function getRebateSetting(data) {
	let res = await request({
				url: '/api/v2/seller/rebatesetting',
				method: 'get',
				params: data
			});

	return res;
}

export async function setRebateSetting(data) {
	let res = await request({
				url: '/api/v2/seller/rebatesetting',
				method: 'POST',
				data,
			});

	return res;
}

// 返利封顶
export async function getDistributeSetting(data) {
	let res = await request({
				url: '/api/v2/seller/inviter/create',
				method: 'get',
				params: data
			});

	return res;
}

export async function setDistributeSetting(data) {
	let res = await request({
				url: '/api/v2/seller/inviter/1',
				method: 'PUT',
				data,
			});

	return res;
}

export default {
	addVisitor,
  getVisitor,
  addGif,
  getGif,
  addApk,
  getApk,

  getShareList,
  addShare,
  setShare,
  deleteShare,
  changeShare,

  setHome,
  getHome,

  getDScoreList,
  addDScore,
  deleteDScore,

  getAssetSetting,
  setAssetSetting,

  getRebateSetting,
  setRebateSetting,

  getDistributeSetting,
  setDistributeSetting,
}