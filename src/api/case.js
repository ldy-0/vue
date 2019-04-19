import request from "@/utils/request";

async function getCase(data) {
  let res = await request({
    url: "/api/v2/seller/information",
    method: "GET",
    params: data
  });
  return res;
}
async function deleteCase(id) {
  let res = await request({
    url: "/api/v2/seller/information/"+id,
    method: "delete",
  });
  return res;
}
async function addCase(data) {
  let res = await request({
    url: "/api/v2/seller/information",
    method: "post",
    data
  });
  return res;
}
async function editCase(data) {
  let res = await request({
    url: "/api/v2/seller/information/"+data.information_id,
    method: "put",
    data
  });
  return res;
}

export default {
    getCase,
    addCase,
    deleteCase,
    editCase
}
