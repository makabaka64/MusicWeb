import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCollaborativeRec, getTrackDetail, getHotRec } from '@/api/user'

export const useRecommendStore = defineStore('recommend', () => {
  const collaborativeList = ref([])
  const hotList = ref([])
  const hasCollections = ref(false)
  const loading = ref(true)

  // 加载所有推荐
  const loadAllRecommendations = async (userId) => {
    try {
      loading.value = true
      const hotRes = await getHotRec(userId)
      const hotListIds = hotRes.data.data.map((item) => item.song_id)
      const hotListTracksRes = await Promise.all(
        hotListIds.map((id) => getTrackDetail({ id }))
      )
      hotList.value = hotListTracksRes
      const collabRes = await getCollaborativeRec(userId)
      const playlistIds = collabRes.data.data.map((item) => item.song_id)
      const playlistTracksRes = await Promise.all(
        playlistIds.map((id) => getTrackDetail({ id }))
      )
      collaborativeList.value = playlistTracksRes
      hasCollections.value = collaborativeList.value.length > 0
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
