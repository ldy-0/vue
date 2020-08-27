import request from "@/utils/request";

function getTransportList(data) {
  let param = {
    url: "/api/v2/seller/transport",
    method: "GET",
    params: data
  };

  return request(param);
}

function deleteTransport(id) {
  let param = {
    url: `/api/v2/seller/transport/${id}`,
    method: "delete",
  };

  return request(param);
}

function addTransport(data) {
  let param = {
    url: "/api/v2/seller/transport",
    method: "post",
    data
  };

  return request(param);
}

function setTransport(id, data) {
  let param = {
    url: `/api/v2/seller/transport/${id}`,
    method: "put",
    data
  };

  return request(param);
}

function changeTransport(id, data) {
  let param = {
    url: `/api/v2/seller/transport/${id}/edit`,
    method: "GET",
    params: data
  };

  return request(param);
}

function addTransportExtend(data) {
  let param = {
    url: "/api/v2/seller/transportextend",
    method: "post",
    data
  };

  return request(param);
}

function setTransportExtend(id, data) {
  let param = {
    url: `/api/v2/seller/transportextend/${id}`,
    method: "put",
    data
  };

  return request(param);
}

function deleteTransportExtend(id) {
  let param = {
    url: `/api/v2/seller/transportextend/${id}`,
    method: "delete",
  };

  return request(param);
}

export default {
    getTransportList,
    addTransport,
    setTransport,
    deleteTransport,
    changeTransport,
    
    addTransportExtend,
    setTransportExtend,
    deleteTransportExtend,
}
