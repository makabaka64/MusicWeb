import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPlaylistData, getPlaylistTracks } from '@/api/user'

// 用户模块  music-web 唯一标识，用来作区分
export const usePlaylistStore = defineStore(
  'music-album',
  () => {
    const allPlayList = ref([]) // 存储歌单列表
    const currentPlaylist = ref(null) // 存储当前歌单详情
    const currentSongList = ref([]) // 存储当前歌单的歌曲

    // 获取所有歌单数据
    const fetchAllPlaylists = async () => {
      const albumIds =
        '382ObEPsp2rxGrnsizN5TX,1A2GTWGtFfWp7KSQTwWOyo,2noRn2Aes5aoNVsU6iWThc,1kCHru7uhxBUdzkm4gzRQc,5H7ixXZfsNMGbIE5OBSpcb,7aJuG4TFXa2hmE4z1yxc3n,6i7mF7whyRJuLJ4ogbH2wh,03guxdOi12XJbnvxvxbpwG,3mH6qwIy9crq0I9YQbOuDf,3iPSVi54hsacKKl1xIR2eH,5tiWzEgxHiddFZUt5Swfzg,6WdM1OfmVIPuQ56QPmaJIr,4tPgavx8TzhK03utfMCgHL,2CKvwKuHcZvnt4mC9DB6Fk,6cbwstHlsAIIWurIIXXBPd,3w32SV56JvtJXsrYtThwzP,0fSfkmx0tdPqFYkJuNX74a,54vGSK50oe08qxz2xXECEC,2MHUaRi9OCyTN02SoyRRBJ,60UzB8mOCMpc7xkuJE6Bwc'
      try {
        const data = await getPlaylistData({ ids: albumIds })
        if (!data?.albums) throw new Error('Invalid playlist data')
        allPlayList.value = data.albums
      } catch (error) {
        console.error('Error fetching playlists:', error)
        allPlayList.value = []
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
          songName: track.name, // 歌曲名称
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
      fetchPlaylistTracks
    }
  },
  {
    persist: true // 持久化
  }
)
