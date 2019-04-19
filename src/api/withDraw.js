import request from '@/utils/request'

async function getWithdrawList(data) {
    return request({
      url: "/api/v2/seller/memberwithdraw",
      method: "get",
      params:data
    });
  }
  async function changeStatus(data) {
    return request({
      url: "/api/v2/seller/memberwithdraw/" + data.id,
      method: "put",
      data
    });
  }
  
  export default {
	getWithdrawList,
    changeStatus,
}