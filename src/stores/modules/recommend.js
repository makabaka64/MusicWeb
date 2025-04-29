import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getCollaborativeRec,
  getHotRec,
  userGetFavoriteListService
} from '@/api/user'
import { getTrackDetail } from '@/api/music'

export const useRecommendStore = defineStore('recommend', () => {
  const collaborativeList = ref([])
  const hotList = ref([])
  const hasCollections = ref(false)
  const loading = ref(true)

  const loadAllRecommendations = async (userId) => {
    try {
      loading.value = true
      const favorite = await userGetFavoriteListService(userId)
      const favoriteList = favorite?.data.data

      // 热门推荐
      const hotRes = await getHotRec(userId)
      const hotRawList = hotRes?.data?.data

      if (!Array.isArray(hotRawList)) {
        console.warn('热门推荐返回的不是数组！', hotRawList)
        return
      }
      const hotListIds = hotRawList.map((item) => item.song_id)
      hotList.value = await Promise.all(
        hotListIds.map((id) => getTrackDetail({ id }))
      )

      // 协同推荐
      const collabRes = await getCollaborativeRec(userId)
      const collabRawList = collabRes?.data?.data
      if (!Array.isArray(collabRawList)) {
        console.warn('协同推荐返回的不是数组', collabRawList)
        return
      }
      const playlistIds = collabRawList.map((item) => item.song_id)
      const playlistTracksRes = await Promise.all(
        playlistIds.map((id) => getTrackDetail({ id }))
      )

      collaborativeList.value = playlistTracksRes
      hasCollections.value = favoriteList.length > 3
    } catch (err) {
      console.error('加载推荐失败:', err)
      hotList.value = []
      collaborativeList.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    collaborativeList,
    hasCollections,
    loading,
    hotList,
    loadAllRecommendations
  }
})
