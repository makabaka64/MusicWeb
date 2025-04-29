import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPlaylistData, getPlaylistTracks } from '@/api/music'

export const usePlaylistStore = defineStore(
  'music-album',
  () => {
    const allPlayList = ref([]) // 歌单列表
    const currentPlaylist = ref(null) // 当前歌单详情
    const currentSongList = ref([]) // 当前歌单的歌曲
    const albumIds = [
      '382ObEPsp2rxGrnsizN5TX',
      '1A2GTWGtFfWp7KSQTwWOyo',
      '2noRn2Aes5aoNVsU6iWThc',
      '1kCHru7uhxBUdzkm4gzRQc',
      '5H7ixXZfsNMGbIE5OBSpcb',
      '7aJuG4TFXa2hmE4z1yxc3n',
      '6i7mF7whyRJuLJ4ogbH2wh',
      '03guxdOi12XJbnvxvxbpwG',
      '3mH6qwIy9crq0I9YQbOuDf',
      '3iPSVi54hsacKKl1xIR2eH',
      '5tiWzEgxHiddFZUt5Swfzg',
      '6WdM1OfmVIPuQ56QPmaJIr',
      '4tPgavx8TzhK03utfMCgHL',
      '2CKvwKuHcZvnt4mC9DB6Fk',
      '6cbwstHlsAIIWurIIXXBPd',
      '3w32SV56JvtJXsrYtThwzP',
      '0fSfkmx0tdPqFYkJuNX74a',
      '54vGSK50oe08qxz2xXECEC',
      '2MHUaRi9OCyTN02SoyRRBJ',
      '60UzB8mOCMpc7xkuJE6Bwc'
    ]
    const page = ref(0)
    const pageSize = 10
    const isLoading = ref(false)
    const hasMore = ref(true)
    // 获取所有歌单数据
    const fetchAllPlaylists = async () => {
      if (isLoading.value || !hasMore.value) return
      isLoading.value = true
      const start = page.value * pageSize
      const end = start + pageSize
      const batchIds = albumIds.slice(start, end).join(',')
      if (!batchIds) {
        hasMore.value = false
        isLoading.value = false
        return
      }
      try {
        const data = await getPlaylistData({ ids: batchIds })
        if (!data?.albums) throw new Error('Invalid playlist data')
        allPlayList.value = [...allPlayList.value, ...data.albums]

        page.value++
        hasMore.value = end < albumIds.length
      } catch (error) {
        console.error('Error fetching playlists:', error)
        // allPlayList.value = []
      } finally {
        isLoading.value = false
      }
    }

    // 获取单个歌单详情
    const fetchPlaylistDetail = async (playlistId) => {
      try {
        const albumData = await getPlaylistData({ ids: playlistId })
        const album = albumData.albums[0]
        currentPlaylist.value = {
          id: playlistId,
          release_date: album.release_date,
          pic: album.images?.[0]?.url || '',
          introduction: album.name,
          total_tracks: album.total_tracks
        }
      } catch (error) {
        console.error('获取歌单信息失败：', error)
        currentPlaylist.value = null
      }
    }

    // 获取歌单中的歌曲
    const fetchPlaylistTracks = async (playlistId) => {
      try {
        const PlaylistTracksData = await getPlaylistTracks({ id: playlistId })
        const albumName = currentPlaylist.value?.introduction || ''
        currentSongList.value = PlaylistTracksData.items.map((track) => ({
          id: track.id,
          songName: track.name,
          singerName: track.artists.map((artist) => artist.name).join(', '), // 拼接所有艺术家的名字
          introduction: albumName, // 使用歌单中的专辑名称
          duration: `${Math.floor(track.duration_ms / 60000)}:${String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}`
        }))
      } catch (error) {
        console.error('获取歌单歌曲失败:', error)
        currentSongList.value = []
      }
    }

    return {
      allPlayList,
      currentPlaylist,
      currentSongList,
      fetchAllPlaylists,
      fetchPlaylistDetail,
      fetchPlaylistTracks,
      isLoading,
      hasMore
    }
  },
  {
    persist: true
  }
)
