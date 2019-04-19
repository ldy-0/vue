import request from "@/utils/request";

async function getBusiness(data) {
  let res = await request({
    url: "/api/v2/seller/refundreturn/create",
    method: "GET",
    params:data
  });
  return res;
}
async function editBusiness(data) {
  let res = await request({
    url: "/api/v2/seller/refundreturn",
    method: "post",
    data
  });
  return res;
}

export default {
    getBusiness,
    editBusiness
}
