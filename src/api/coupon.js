import request from "@/utils/request";

async function getCoupon(data) {
  let res = await request({
    url: "/api/v2/seller/coupon",
    method: "GET",
    params: data
  });
  return res;
}
async function deleteCoupon(id) {
  let res = await request({
    url: "/api/v2/seller/coupon/"+id,
    method: "delete",
  });
  return res;
}
async function addCoupon(data) {
  let res = await request({
    url: "/api/v2/seller/coupon",
    method: "post",
    data
  });
  return res;
}

export default {
  getCoupon,
  addCoupon,
  deleteCoupon
}
