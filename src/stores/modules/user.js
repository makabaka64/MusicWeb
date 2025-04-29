import { defineStore } from 'pinia'
import { userGetInfoService } from '@/api/user'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'music-user',
  () => {
    const token = ref('')
    const setToken = (t) => (token.value = t)
    const removeToken = () => {
      token.value = ''
    }

    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService()
      user.value = res.data.data
    }

    const setUser = (obj) => (user.value = obj)

    return { token, setToken, removeToken, user, getUser, setUser }
  },
  {
    persist: true
  }
)
