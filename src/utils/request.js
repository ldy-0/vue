import axios from 'axios'
// import { Toast } from 'vant';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 120000
});

// request interceptor
service.interceptors.request.use(config => {
  let headers = config.headers,
      token = localStorage.getItem('token');

  if(!(headers['content-type'] || headers['Content-Type'])) headers['Content-Type'] = 'application/json'

  if (token) {
    headers['Authorization'] = headers.token = token;
  }

  return config;
}, error => {
  console.error('请求错误: ', error) // for debug
  return 111;
})

// respone interceptor
service.interceptors.response.use(
  response => {
    const res = response.data;

    if(res && res.hash) return res;

    if (res && res.status == 0) {
      return res;
    } else {
      return res.error;
    }
  },
  error => {
    return error.message;
  }
)

export default service
