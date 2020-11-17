import req from '@/utils/request.js';

// 平台简介
async function getCompany(query, data, header){
	let res = await req.get('/api/v2/member/company', query, data, header);
	
	return res.data || res;
}

// 联系我们 
async function getContact(query, data, header){
	let res = await req.get('/api/v2/member/contact', query, data, header);
	
	return res.data || res;
}

// APP
async function getApp(query, data, header){
	let res = await req.get('/api/v2/member/app', query, data, header);
	
	return res.data || res;
}

// 产品类目
async function getClassList(query, data, header){
	let res = await req.get('/api/v2/member/classify', query, data, header);
	
	return res.data || res;
}

// 新闻列表
async function getNewsList(query, data, header){
	let res = await req.get('/api/v2/member/news', query, data, header);
	
	return res.data || res;
}

export default {
	getCompany,
	
	getContact,

	getApp,

	getClassList,

	getNewsList,
}