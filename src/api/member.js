
import request from '@/utils/request'

 function getMember_api(data) {
    return request({
      url: "/api/v2/seller/member",
      method: "get",
      params: data
    });
  }
 function getMemberApply_api(data) {
    return request({
      url: "/api/v2/seller/apply",
      method: "get",
      params: data
    });
  }
 function auditMemberApply_api(data) {
    return request({
      url: "/api/v2/seller/apply/"+data.id,
      method: "put",
      data
    });
  }
 function UpDownMember_api(data) {
    return request({
      url: "/api/v2/seller/member/"+data.member_id,
      method: "put",
      data
    });
  }
 function changeMember_api(data) {
    return request({
      url: "/api/v2/seller/member",
      method: "post",
      data
    });
  }

function getIncomeList(id, data){
  return request({
    url: `/api/v2/seller/member/${id}/edit`,
    method: "get",
    params: data
  });
}

function getTip(data){
  return request({
    url: `/api/v2/seller/inviter`,
    method: "get",
    params: data
  });
}

function saveTip(data){
  return request({
    url: `/api/v2/seller/inviter`,
    method: "post",
    data
  });
}

function changeStatus(id, data){
  return request({
    url: `/api/v2/seller/member/${id}`,
    method: "put",
    data
  });
}

function changeMallStatus(id, data){
  return request({
    url: `/api/v2/seller/member/${id}`,
    method: "put",
    data
  });
}

function deleteMember(id, data){
  return request({
    url: `/api/v2/seller/member/${id}`,
    method: "delete",
    data
  });
}

  export default {
    getMember_api,
    changeMember_api,
    UpDownMember_api,
    getMemberApply_api,
    auditMemberApply_api,
    getIncomeList,
    getTip,
    saveTip,
    changeStatus,
    changeMallStatus,
    deleteMember,
  }