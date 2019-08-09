import request from "@/utils/request";

async function getBusiness(data) {
  let res = await request({
    url: "/api/v2/seller/business/"+data,
    method: "GET",
  });
  return res;
}

async function editBusiness(data) {
  let res = await request({
    url: "/api/v2/seller/business/"+data.business_id,
    method: "put",
    data
  });
  return res;
}

async function getList(params){
  let res = await request({
    url: "/api/v2/seller/businessapply",
    method: "GET",
    params,
  });

  return res;
}

export default {
    getBusiness,
    editBusiness,
    getList,
}
