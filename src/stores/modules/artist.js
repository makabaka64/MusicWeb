import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getArtistData, getTopTracks } from '@/api/user'

export const useArtistStore = defineStore(
  'artist',
  () => {
    const allPlayList = ref([]) // 存储歌手列表
    const songDetails = ref(null) // 存储歌手的详细信息
    const currentSongList = ref([]) // 存储当前歌手的歌曲列表

    // 获取歌手数据
    // 请求获取歌手数据
    const fetchTopArtists = async () => {
      const artistIds =
        '2CIMQHirSU0MQqyYHq0eOx,57dN52uHvrHOxijzpIgu3E,1vCWHaC5f2uS3yhpwWbIA6,2YZyLoL8N0Wb9xBt1NhZWg,1Xyo4u8uXC1ZmMpatF05PJ,06HL4z0CvFAxyc27GXpf02,66CXWjxzNUsdJxJ2JdwvnR,0Y5tJX1MQlPlqiwlOH1tJY,6qqNVTkY8uBg9cP3Jd7DAH,6vWDO969PvNqNYHIOW5v0m,2elBjNSdBE2Y3f0j1mjrql,2QcZxAgcs2I1q7CtCkl6MI,1YrtUPrWcPfgdl9BaD9nhd,40tNK2YedBV2jRFAHxpifB,7Dx7RhX0mFuXhCOUgB01uM,246dkjvS1zLTtiykXe5h60,5pKCCKE2ajJHZ9KAiaK11H,7GlBOeep6PqTfFi59PTUUN,4oUHIQIBe0LHzYfvXNW4QM,7aRC4L63dBn3CiLDuWaLSI,7rXM91kSsqGzvYANukdQJD,1cg0bYpP5e2DNG0RgK2CMN,2F5W6Rsxwzg0plQ0w8dSyt,0SIXZXJCAhNU8sxK0qm7hn,75udD9hen8NeHTe92rUNLa' // 确保ID正确
      try {
        const data = await getArtistData({ ids: artistIds })

        // 添加数据校验
        if (!data?.artists) {
          console.error('Invalid data structure:', data)
          throw new Error('Invalid artist data format')
        }

        allPlayList.value = data.artists
      } catch (error) {
        console.error('Error fetching artists:', error)
        allPlayList.value = [] // 清空数据避免渲染错误
      }
    }
    // 获取歌手数据
    const fetchArtistData = async (artistId) => {
      try {
        const artistData = await getArtistData({ ids: artistId })
        const artist = artistData.artists[0]
        songDetails.value = {
          name: artist.name,
          pic: artist.images?.[0]?.url || '', // 歌手图片
          followers: artist.followers?.total || 0, // 粉丝数
          popularity: artist.popularity, // 人气值
          introduction: `流派：${artist.genres.join(', ')}` // 歌手介绍
        }
      } catch (error) {
        console.error('获取歌手信息失败：', error)
        songDetails.value = null
      }
    }

    // 获取歌手的热门曲目
    const fetchTopTracks = async (artistId) => {
      try {
        const topTracksData = await getTopTracks({ id: artistId })
        currentSongList.value = topTracksData.tracks.map((track) => ({
          id: track.id,
          songName: track.name, // 歌曲名称
          singerName: track.artists.map((artist) => artist.name).join(', '), // 歌手名称
          introduction: track.album.name, // 专辑名称
          duration: `${Math.floor(track.duration_ms / 60000)}:${String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}` // 歌曲时长
        }))
      } catch (error) {
        console.error('获取热门曲目失败：', error)
        currentSongList.value = []
      }
    }

    return {
      allPlayList,
      songDetails,
      currentSongList,
      fetchArtistData,
      fetchTopTracks,
      fetchTopArtists
    }
  },
  {
    persist: true // 持久化
  }
)
