import request from '@/utils/request'

export function upFileToken_api(data) {
  return request({
    url: '/api/v2/admin/imgkey',
    method: 'get',
    params: data
  })
}
//获取阿里云参数
export function getPolicy_api(data) {
  return request({
    url: '/api/v2/admin/imgkeyali',
    method: 'get',
    params: data
  })
}
export function changePasswordForAdmin_api(data) {
  return request({
    url: '/api/v2/admin/password',
    method: 'post',
    data
  })
}
export function changePasswordForSeller_api(data) {
  return request({
    url: '/api/v2/seller/password',
    method: 'post',
    data
  })
}

// 获取七牛上传token
async function getUploadToken(data) {
	let res = await request({
				url: '/api/v2/common/imgkeyqiniu',
				method: 'get',
				params: data
			});

	return res;
}

// 修改商品销量
function changeBargainSale(data){
  return request({
    url: `/api/v2/seller/cutprice/setting`,
    method: 'put',
    data
  });
}

function changeGroupSale(data){
  return request({
    url: `/api/v2/seller/groupbuy/setting`,
    method: 'put',
    data
  });
}

function changeSeckillSale(data){
  return request({
    url: `/api/v2/seller/seckill/setting`,
    method: 'put',
    data
  });
}

// export 
export default {
  getUploadToken,
  changeBargainSale,
  changeGroupSale,
  changeSeckillSale,
}