//平台登录请求的api
import request from '@/utils/request'
 function getAssessList(params, _this) {
    return request({
      url: `/api/v2/seller/goodsevaluate`,
      methods: "get",
      params
    });
  }
  
 function getAssessDetail(id, params, _this) {
    return request({
      url: `/api/v2/seller/goodsevaluate/${id}`,
      methods: "get",
      params
    });
  }
  
 function deleteAssess(id, data, _this) {
    return request({
      url: `/api/v2/seller/goodsevaluate/${id}`,
      method: "DELETE",
      data
    });
  }
  
 function auditingAssess(id, data, _this) {
    return request({
      url: `/api/v2/seller/goodsevaluate/${id}`,
      method: "PUT",
      data
    });
  }

export default {
	getAssessList,
    getAssessDetail,
    deleteAssess,
    auditingAssess
}