import req from '@/utils/request.js';

// 轮播图
async function getList(query, data, header){
	let res = await req.get('/api/v2/member/banner', query, data, header);
	
	return res.data || res;
}

export default {
	getList,
}