import axios from 'axios'
import { useUserStore } from '@/stores'
// import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import router from '@/router'
const baseURL = 'http://127.0.0.1:8080'
// const router = useRouter()

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})
//请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const useStore = useUserStore()
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)
//响应拦截器
instance.interceptors.response.use(
  (res) => {
    // if (res.data.code === 0) {
    // return res.data
    return res
  },
  (err) => {
    ElMessage({
      message: err.response.data.message || '服务异常',
      // message: err.response.message || '服务异常',
      type: 'error'
    })
    console.log(err)
    if (err.response?.status === 401) {
      router.push('/login')
    }
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
