import request from "@/utils/request";

async function getAllList(data){
  let res = await request({
    url: "/api/v2/seller/store",
    method: "GET",
    params: data
  });
  return res;
}

async function getAllExport(data){
  let res = await request({
    url: "/api/v2/seller/store/create",
    method: "GET",
    params: data
  });
  return res;
}

async function deleteAll(id) {
  let res = await request({
    url: "/api/v2/seller/information/"+id,
    method: "delete",
  });
  return res;
}
async function addAll(data) {
  let res = await request({
    url: "/api/v2/seller/information",
    method: "post",
    data
  });
  return res;
}
async function setAll(id, data) {
  let res = await request({
    url: `/api/v2/seller/store/${id}`,
    method: "put",
    data
  });
  return res;
}
async function changeAll(id, data){
  let opt = {
    url: `/api/v2/seller/store/${id}`,
    method: "put",
    data
  };

  let res = await request(opt);

  return res;
}

// 审核
async function getCheckList(data){
  let res = await request({
    url: "/api/v2/seller/financeexpend",
    method: "GET",
    params: data
  });
  return res;
}
async function changeCheck(id, data){
  let opt = {
    url: `/api/v2/seller/store/${id}`,
    method: "put",
    data
  };

  let res = await request(opt);

  return res;
}

export default {
  getAllList,
  getAllExport,
  addAll,
  deleteAll,
  setAll,
  changeAll,

  getCheckList,
  changeCheck,
}