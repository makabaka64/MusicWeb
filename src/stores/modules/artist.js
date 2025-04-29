import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getArtistData, getTopTracks } from '@/api/music'

export const useArtistStore = defineStore(
  'artist',
  () => {
    const allPlayList = ref([]) // 歌手列表
    const songDetails = ref(null) // 歌手的详细信息
    const currentSongList = ref([]) // 当前歌手的歌曲列表
    const artistIds = [
      '2CIMQHirSU0MQqyYHq0eOx',
      '57dN52uHvrHOxijzpIgu3E',
      '1vCWHaC5f2uS3yhpwWbIA6',
      '2YZyLoL8N0Wb9xBt1NhZWg',
      '1Xyo4u8uXC1ZmMpatF05PJ',
      '06HL4z0CvFAxyc27GXpf02',
      '66CXWjxzNUsdJxJ2JdwvnR',
      '0Y5tJX1MQlPlqiwlOH1tJY',
      '6qqNVTkY8uBg9cP3Jd7DAH',
      '6vWDO969PvNqNYHIOW5v0m',
      '2elBjNSdBE2Y3f0j1mjrql',
      '2QcZxAgcs2I1q7CtCkl6MI',
      '1YrtUPrWcPfgdl9BaD9nhd',
      '40tNK2YedBV2jRFAHxpifB',
      '7Dx7RhX0mFuXhCOUgB01uM',
      '246dkjvS1zLTtiykXe5h60',
      '5pKCCKE2ajJHZ9KAiaK11H',
      '7GlBOeep6PqTfFi59PTUUN',
      '4oUHIQIBe0LHzYfvXNW4QM',
      '7aRC4L63dBn3CiLDuWaLSI',
      '7rXM91kSsqGzvYANukdQJD',
      '1cg0bYpP5e2DNG0RgK2CMN',
      '2F5W6Rsxwzg0plQ0w8dSyt',
      '0SIXZXJCAhNU8sxK0qm7hn',
      '75udD9hen8NeHTe92rUNLa',
      '1HY2Jd0NmPuamShAr6KMms',
      '5K4W6rqBFWDnAN6FQUkS6x',
      '3df3XLKuqTQ6iOSmi0K3Wp',
      '3AroL2oDPiAnMpTmIQv3KP',
      '1McMsnEElThX1knmY4oliG',
      '1kfWoWgCugPkyxQP8lkRlY',
      '1Hu58yHg2CXNfDhlPd7Tdd',
      '2dw80Uni5l7wd9zZFn7Ltu',
      '1Hu58yHg2CXNfDhlPd7Tdd',
      '7qJmFr579WC8MMGj4PiWdu'
    ]
    const page = ref(0)
    const pageSize = 10
    const isLoading = ref(false)
    const hasMore = ref(true)
    // 获取歌手数据
    const fetchTopArtists = async () => {
      if (isLoading.value || !hasMore.value) return
      isLoading.value = true
      const start = page.value * pageSize
      const end = start + pageSize
      const batchIds = artistIds.slice(start, end).join(',')

      if (!batchIds) {
        hasMore.value = false
        isLoading.value = false
        return
      }

      try {
        const data = await getArtistData({ ids: batchIds })
        console.log(`获取歌手数据：`, data)

        // 添加数据校验
        if (!data?.artists) {
          console.error('Invalid data structure:', data)
          throw new Error('Invalid artist data format')
        }

        // allPlayList.value = data.artists
        allPlayList.value = [...allPlayList.value, ...data.artists]
        page.value++
        // if (data.artists.length < pageSize) hasMore.value = false
        hasMore.value = end < artistIds.length
        console.log(
          `加载了 ${data.artists.length} 个歌手，剩余 ${artistIds.length - end}`
        )
      } catch (error) {
        console.error('Error fetching artists:', error)
      } finally {
        isLoading.value = false
      }
    }
    // 获取歌手数据
    const fetchArtistData = async (artistId) => {
      try {
        const artistData = await getArtistData({ ids: artistId })
        const artist = artistData.artists[0]
        songDetails.value = {
          name: artist.name,
          pic: artist.images?.[0]?.url || '',
          followers: artist.followers?.total || 0,
          popularity: artist.popularity,
          introduction: `流派：${artist.genres.join(', ')}`
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
          songName: track.name,
          singerName: track.artists.map((artist) => artist.name).join(', '),
          introduction: track.album.name,
          duration: `${Math.floor(track.duration_ms / 60000)}:${String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}` //歌曲时长
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
      fetchTopArtists,
      isLoading,
      hasMore
    }
  },
  {
    persist: true
  }
)
