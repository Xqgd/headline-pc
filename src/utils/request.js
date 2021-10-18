import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'

const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net', // 最新接口地址
  
  // baseURL: 'http://ttapi.research.itcast.cn/' // 请求的基础路径
   // 定义后端返回的原始数据的处理
  // 参数 data 就是后端返回的原始数据（未经处理的 JSON 格式字符串）
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    // console.log(data)

    // 后端返回的数据可能不是 JSON 格式字符串
    // 如果不是的话，那么 JSONbig.parse 调用就会报错
    // 所以我们使用 try-catch 来捕获异常，处理异常的发生
    try {
      // 如果转换成功，则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      console.log('转换失败', err)
      // 如果转换失败了，则进入这里
      // 我们在这里把数据原封不动的直接返回给请求使用
      return data
    }
  }]

    // axios 默认在内部使用 JSON.parse 来转换处理原始数据
    // return JSON.parse(data)
})

// 请求拦截器
request.interceptors.request.use(
  // 任何所有请求会经过这里
  // config 是当前请求相关的配置信息对象
  // config 是可以修改的
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },function (error) {
      return Promise.reject(error)})
// 响应拦截器
request.interceptors.response.use(function (response) {
      // 所有响应码为 2xx 的响应都会进入这里
    return response
  }, function (error) {
  // 所有响应码超出 2xx 的响应都会进入这里
  if (error.response && error.response.status === 401) {
    window.localStorage.removeItem('user')
    router.push('/login')
  }
  return Promise.reject(error)
})



export default request