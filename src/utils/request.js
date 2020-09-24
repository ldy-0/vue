import axios from 'axios';

const HOST =  'https://test2.whweiya.cn';

let instance = axios.create({
	baseURL: HOST,
	timeout: 3000,
});

function toQueryString(query){
	if(query && typeof query == 'object'){
		return Object.keys(query).reduce((p, v, i) => i === 0 ? `?${v}=${query[v]}` : `${p}&${v}=${query[v]}`, '');
	}
	
	return '';
}

function get(url, query, data, head) {
  return request('GET', url, query, data, head);
}

function post(url, query, data, head) {
  return request('POST', url, query, data, head);
}

function put(url, query, data, head) {
  return request('PUT', url, query, data, head);
}

function del(url, query, data, head) {
  return request('DELETE', url, query, data, head);
}

function request(method, url, query, data, head){
	let headers = {},
      token = localStorage.getItem('token');

	if(token)	headers.token = token;
		
	if(head && typeof head == 'object'){
		for(let k in head) headers[k] = head[k];
	}
	
	if(!/^https?/.test(url)) url = `${HOST}${url}`;
	if(query && typeof query == 'object') url += toQueryString(query);
		
	let p = instance.request({
		url,
		method,
		headers,
		data,
	})
	
	return p;
}

export default {
  get,
  post,
  put,
  del,
};