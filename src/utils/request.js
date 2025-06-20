import axios from 'axios'
import {Message} from 'element-ui'
import router from "../router/index";

// 判断是否在GitHub Pages环境
const isGitHubPages = window.location.hostname.includes('github.io');

// 创建axios实例
const service = axios.create({
  // 如果是GitHub Pages环境，使用模拟数据或提示用户
  baseURL: isGitHubPages ? '' : (process.env.VUE_APP_BASE_URL || '/api'), 
  timeout: process.env.VUE_APP_REQUEST_TIME_OUT || 10000 // 请求超时时间
})

// 在GitHub Pages环境下显示提示
if (isGitHubPages) {
  setTimeout(() => {
    Message({
      message: '当前为演示环境，无法连接后端服务。请在本地运行完整项目体验全部功能。',
      type: 'warning',
      duration: 10000
    });
  }, 1000);
}

service.interceptors.request.use(config => {

  const token = window.localStorage.getItem('authorization')
  // 判断是否存在token，如果存在的话，则每个http header都加上token
  if (token) {
    config.headers.common['authorization'] = token
  }
  return config

}, error => {

  return Promise.reject(error)

})

// response 拦截器
service.interceptors.response.use(
  response => {
    const responseData = response.data
    if (responseData.code !== 200) {
      Message({
        message: responseData.msg,
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      return responseData
    }
  },
  error => {
    // GitHub Pages环境下，忽略API错误
    if (isGitHubPages) {
      return Promise.resolve({
        code: 200,
        data: [],
        msg: 'GitHub Pages环境模拟数据'
      });
    }

    const responseData = error.response?.data
    if (responseData?.code !== 200) {
      Message({
        message: responseData?.msg ?? '服务器错误',
        type: 'error',
        duration: 5 * 1000
      })
      if (responseData?.code === 401) {
        window.localStorage.removeItem('authorization')
        router.push("/")
      }
    } else {
      Message({
        message: '服务器错误',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
