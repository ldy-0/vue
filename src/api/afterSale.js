//退款
import request from '@/utils/request'

async function getReturnList(data) {
    return request({
      url: "/api/v2/seller/refundreturn",
      method: "get",
      params:data
    });
  }
  async function editReturnList(data) {
    return request({
      url: "/api/v2/seller/refundreturn/" + data.refund_id,
      method: "put",
      data
    });
  }
  
  async function lookReturnDetail(data) {
    return request({
      url: "/api/v2/seller/refundreturn/" + data.refund_id,
      method: "GET",
      data
    });
  }

  export default {
	getReturnList,
    editReturnList,
    lookReturnDetail
}