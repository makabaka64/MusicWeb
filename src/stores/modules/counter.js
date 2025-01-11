import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块  big-user 唯一标识，用来作区分
export const useCountStore = defineStore(
  'music-web',
  () => {
    const count = ref(100) // 定义 token
    const add = (t) => (count.value += t) // 设置 token

    return { count, add }
  }
  //   {
  //     persist: true // 持久化
  //   }
)
