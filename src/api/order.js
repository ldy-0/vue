import request from "@/utils/request";

async function getOrderList_api(data) {

    let res = await request({
      url: "/api/v2/seller/order",
      method: "GET",
      params: data
    });
  
    return res.error !== '' ? _this.$message.error({ message: res.error, duration: 1200 }) : res;
  }
  
async function changeOrder_api(data) {
    let res = await request({
      url: "/api/v2/seller/orderstate/"+data.order_id,
      method: "PUT",
      data
    });

    return res;
  }
  
  export default {
    getOrderList_api,
    changeOrder_api
  }
  