import axios from 'axios'

export function request(config) {
  const instance = axios.create({
    // baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
    timeout: 5000
  })

  //axios拦截器
  instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  }, err => {
    console.log(err);
  })



  return instance(config)
}