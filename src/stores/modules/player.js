import { defineStore } from 'pinia'

// 工具函数：格式化毫秒为 mm:ss 格式
const formatTime = (duration_ms) => {
  const totalSeconds = Math.floor(duration_ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
}

export const usePlayerStore = defineStore('player', {
  state: () => ({
    songTitle: '歌曲名称',
    singerName: '歌手名',
    introduction: '专辑名',
    startTime: '00:00',
    endTime: '00:00',
    songId: null,
    songImages: '',
    previewUrl: '',
    nowTime: 0,
    playState: 0,
    isCollection: false, // 是否收藏
    playlist: [], // 保存当前歌单的所有曲目对象
    currentIndex: -1 // 当前播放曲目的索引，-1 表示没有选中
  }),
  actions: {
    // 更新播放器状态（点击歌曲时调用）
    updatePlayer(track) {
      this.songTitle = track.name
      this.singerName =
        track.artists.map((a) => a.name).join(', ') || '未知艺术家'
      this.introduction = track.album.name
      this.endTime = formatTime(track.duration_ms)
      this.songId = track.id
      this.previewUrl = track.preview_url
      this.songImages = track.album.images?.[0]?.url
    },
    // 切换播放状态
    togglePlayState() {
      this.playState = this.playState === 0 ? 1 : 0
    },
    updateNowTime(time) {
      this.nowTime = time
    },
    updateVolume(vol) {
      this.volume = vol
    },
    toggleCollection() {
      this.isCollection = !this.isCollection
    }, // 设置歌单列表
    setPlaylist(list) {
      this.playlist = list
      // 默认将当前索引置为 0
      this.currentIndex = list.length > 0 ? 0 : -1
    },
    // 播放指定索引的歌曲
    playTrackAtIndex(index) {
      if (index >= 0 && index < this.playlist.length) {
        const track = this.playlist[index]
        this.updatePlayer(track)
        this.currentIndex = index
      }
    },
    // 播放下一首
    nextTrack() {
      if (this.playlist.length === 0) return
      let newIndex = this.currentIndex + 1
      if (newIndex >= this.playlist.length) {
        newIndex = 0 // 循环播放
      }
      this.playTrackAtIndex(newIndex)
    },
    // 播放上一首
    previousTrack() {
      if (this.playlist.length === 0) return
      let newIndex = this.currentIndex - 1
      if (newIndex < 0) {
        newIndex = this.playlist.length - 1 // 循环播放
      }
      this.playTrackAtIndex(newIndex)
    },
    removeTrack(index) {
      if (index >= 0 && index < this.playlist.length) {
        // 处理当前播放索引
        if (this.currentIndex === index) {
          this.currentIndex = -1
          this.resetPlayer()
        } else if (this.currentIndex > index) {
          this.currentIndex--
        }

        // 删除指定索引的曲目
        this.playlist.splice(index, 1)

        // 如果列表为空则重置播放器
        if (this.playlist.length === 0) {
          this.resetPlayer()
        }
      }
    },
    resetPlayer() {
      this.songTitle = '歌曲名称'
      this.singerName = '歌手名'
      this.introduction = '专辑名'
      this.endTime = '00:00'
      this.songId = null
      this.previewUrl = ''
      this.nowTime = 0
      this.playState = 0
    }
  },

  persist: true
})
