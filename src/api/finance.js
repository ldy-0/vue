import request from "@/utils/request";

async function getDealList(data){
  let res = await request({
    url: "/api/v2/seller/financeincome",
    method: "GET",
    params: data
  });
  return res;
}

async function getDealExport(data){
  let res = await request({
    url: "/api/v2/seller/financeincome/create",
    method: "GET",
    params: data
  });
  return res;
}

async function deleteDeal(id) {
  let res = await request({
    url: "/api/v2/seller/information/"+id,
    method: "delete",
  });
  return res;
}
async function addDeal(data) {
  let res = await request({
    url: "/api/v2/seller/information",
    method: "post",
    data
  });
  return res;
}
async function editDeal(data) {
  let res = await request({
    url: "/api/v2/seller/information/"+data.information_id,
    method: "put",
    data
  });
  return res;
}

async function getRewardList(data){
  let res = await request({
    url: "/api/v2/seller/financeexpend",
    method: "GET",
    params: data
  });
  return res;
}

export default {
  getDealList,
  getDealExport,
  addDeal,
  deleteDeal,
  editDeal,

  getRewardList,
}