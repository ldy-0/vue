import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import { MessageBox } from 'element-ui'

// create an axios instance
const service = axios.create({
  baseURL:process.env.BASE_API,
  timeout: 20000
})
// request interceptor
service.interceptors.request.use(config => {
   config.headers['Content-Type'] = 'application/json'
  if (getToken()) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['token'] = getToken()
  }
  return config
}, error => {
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    // console.log('request.js', response)
    const res = response.data
    if (res&&res.status === 1) {
//       Message({
//         message: res.error,
//         type: 'error',
//         duration: 5 * 1000
//       })
      // store.dispatch('FedLogOut').then(() => {
      //   location.reload() // 为了重新实例化vue-router对象 避免bug
      // })
      // store.dispatch('FedLogOut')
      //return Promise.reject('request.js拦截响应 res.status == 1')
			return response.data
    } else if(res&&res.status === 10){
        Message({
          message: res.error,
          type: 'error',
          duration: 5 * 1000
        })
        // store.dispatch('FedLogOut').then(() => {
        //   location.reload() 
        // })
    }else  {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service
