import request from "@/utils/request";

async function getCoupon(_this) {

  let res = await request({
    url: "/api/v2/common/coupon",
    method: "GET",
    params: null
  });

  return res.error !== '' ? _this.$message.error({ message: res.error, duration: 1200 }) : res.data;
}

export default {
  getCoupon
}
