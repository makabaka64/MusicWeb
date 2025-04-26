<script setup>
import { computed, watch, ref, onMounted } from 'vue'
import { usePlayerStore } from '@/stores'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ElMessageBox } from 'element-plus'
import {
  userAddFavoriteService,
  userDeleteFavoriteService,
  userGetInfoService,
  userGetFavoriteListService
} from '@/api/user'
const playerStore = usePlayerStore()
const router = useRouter()

// 计算属性直接绑定 store 中的状态
const introduction = computed(() => playerStore.introduction)
const songTitle = computed(() => playerStore.songTitle)
const singerName = computed(() => playerStore.singerName)
const startTime = computed(() => playerStore.startTime)
const endTime = computed(() => playerStore.endTime)
const songId = computed(() => playerStore.songId)
const songImages = computed(() => playerStore.songImages)
// const nowTime = computed(() => playerStore.nowTime)
const nowTime = computed({
  get: () => playerStore.nowTime,
  set: (val) => playerStore.updateNowTime(val)
})
const playState = computed(() => playerStore.playState)
// const volume = computed(() => playerStore.volume)
const isCollection = computed(() => playerStore.isCollection)
const previewUrl = computed(() => playerStore.previewUrl)
// 内部 audio 播放器，用于播放预览音频
const audioPlayer = ref(new Audio())

// 本地用户信息及收藏列表
const user_id = ref(null)
const favoriteList = ref([])
// 图标列表，根据实际需求设置
const iconList = {
  SHANGYISHOU: 'mdi:skip-previous',
  XIAYISHOU: 'mdi:skip-next',
  YINLIANG: 'mdi:volume-high',
  JINGYIN: 'mdi:volume-mute',
  like: 'mdi:heart',
  dislike: 'mdi:heart-outline',
  LIEBIAO: 'mdi:playlist-music'
}

const showPlaylistDialog = ref(false)
// const dialogPosition = ref({ x: 0, y: 0 })
const togglePlaylistDialog = () => {
  showPlaylistDialog.value = true
  // const iconRect = event.target.getBoundingClientRect()
  // dialogPosition.value = {
  //   x: iconRect.left - 320, // 弹窗宽度向左偏移
  //   y: iconRect.top - 50 // 向上偏移
  // }
  // showPlaylistDialog.value = true
}
const selectTrackAtIndex = (index) => {
  playerStore.playTrackAtIndex(index)
  showPlaylistDialog.value = false
}

const playStateList = ['mdi:play', 'mdi:pause']
// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const res = await userGetInfoService()
    user_id.value = res.data.data.id
  } catch (error) {
    ElMessage.error(error.message || '获取用户信息失败')
  }
}

// 获取用户收藏列表
const fetchUserFavorites = async () => {
  try {
    const res = await userGetFavoriteListService(user_id.value)
    if (res.data.status === 0) {
      favoriteList.value = res.data.data.map((item) => item.song_id)
      // 根据当前歌曲是否在收藏列表中，同步 store 中 isCollection 状态
      if (songId.value && favoriteList.value.includes(songId.value)) {
        playerStore.$patch({ isCollection: true })
      } else {
        playerStore.$patch({ isCollection: false })
      }
    }
  } catch (error) {
    ElMessage.error('获取收藏列表失败：' + error.message)
  }
}

// 监听 songId 变化，当切换歌曲时重新获取收藏状态
watch(songId, async (newVal) => {
  if (newVal && user_id.value) {
    await fetchUserFavorites()
  }
})
// 播放器交互方法，调用 store 的 action
// 播放/暂停音频
const changePlayState = async () => {
  try {
    // 当处于暂停状态时播放预览音频
    if (playState.value === 0) {
      if (!previewUrl.value) {
        ElMessage.warning('当前歌曲没有预览地址')
        return
      }

      audioPlayer.value.src = previewUrl.value
      await audioPlayer.value.play()
    } else {
      // 播放时则暂停
      audioPlayer.value.pause()
    }
    // 切换全局播放状态
    playerStore.togglePlayState()
  } catch (error) {
    ElMessage.error(error.message || '播放失败')
  }
}
// 更新播放进度（滑块拖动时触发）
const changeTime = (newTime) => {
  playerStore.updateNowTime(newTime)
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = newTime
  }
}

// 收藏操作：点击收藏图标时触发
const changeCollection = async () => {
  try {
    if (!user_id.value) {
      ElMessage.warning('请先登录')
      return
    }
    const currentSongId = songId.value
    if (!currentSongId) {
      ElMessage.warning('没有选中的歌曲')
      return
    }
    // 如果当前歌曲未收藏则添加收藏，否则取消收藏
    if (!favoriteList.value.includes(currentSongId)) {
      console.log('收藏歌曲:', currentSongId)

      const params = {
        user_id: user_id.value,
        song_id: currentSongId,
        songName: songTitle.value,
        singerName: singerName.value,
        introduction: introduction.value
      }
      const res = await userAddFavoriteService(params)
      if (res.data.status === 0) {
        favoriteList.value.push(currentSongId)
        playerStore.$patch({ isCollection: true })
        ElMessage.success('收藏成功')
      }
    } else {
      const res = await userDeleteFavoriteService({
        user_id: user_id.value,
        song_id: currentSongId
      })
      if (res.data.status === 0) {
        favoriteList.value = favoriteList.value.filter(
          (id) => id !== currentSongId
        )
        playerStore.$patch({ isCollection: false })
        ElMessage.success('取消收藏成功')
      }
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '操作失败')
  }
}

const prev = () => {
  console.log(playerStore.currentIndex)

  playerStore.previousTrack()
}

const next = () => {
  console.log(playerStore.currentIndex)
  playerStore.nextTrack()
}

const goPlayerPage = () => {
  router.push({ path: `/lyric/${songId.value}` })
}
// 删除播放列表音乐
const handleDeleteTrack = (index) => {
  ElMessageBox.confirm('确定要删除该歌曲吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      playerStore.removeTrack(index)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
// 组件挂载时，先获取用户信息，再获取收藏列表
onMounted(async () => {
  await fetchUserInfo()
  if (user_id.value) {
    await fetchUserFavorites()
  }
})
</script>

<template>
  <div class="play-bar">
    <div class="fold" @click="changeAside"></div>
    <!-- 播放进度 -->
    <el-slider
      class="progress progress-bar"
      v-model="nowTime"
      @change="changeTime"
      size="small"
    ></el-slider>
    <div class="control-box">
      <div class="info-box">
        <!-- 歌曲图片 -->
        <div @click="goPlayerPage">
          <el-image class="song-bar-img" fit="contain" :src="songImages" />
        </div>
        <!-- 歌曲信息 -->
        <div v-if="songId">
          <div class="song-info">{{ songTitle }} - {{ singerName }}</div>
          <div class="time-info">{{ startTime }} / {{ endTime }}</div>
        </div>
      </div>
      <div class="song-ctr">
        <!-- 上一首 -->
        <yin-icon
          class="yin-play-show3"
          :icon="iconList.SHANGYISHOU"
          @click="prev"
        ></yin-icon>
        <!-- 播放/暂停 -->
        <yin-icon
          class="yin-play-show1"
          :icon="playStateList[playState]"
          @click="changePlayState"
        ></yin-icon>
        <!-- 下一首 -->
        <yin-icon
          class="yin-play-show"
          :icon="iconList.XIAYISHOU"
          @click="next"
        ></yin-icon>
      </div>
      <div class="song-ctr song-edit">
        <!-- 收藏 -->
        <yin-icon
          class="yin-play-show2"
          :class="{ active: isCollection }"
          :icon="isCollection ? iconList.like : iconList.dislike"
          @click="changeCollection"
        ></yin-icon>
        <!-- 歌单列表/侧边栏 -->
        <yin-icon
          class="yin-play-show"
          :icon="iconList.LIEBIAO"
          @click="togglePlaylistDialog"
        ></yin-icon>
        <!-- 侧边栏，v-if 控制显示  -->

        <teleport to="body">
          <transition name="slide-up">
            <div
              v-show="showPlaylistDialog"
              class="custom-playlist-dialog"
              @click.self="showPlaylistDialog = false"
            >
              <div class="playlist-wrapper">
                <div class="playlist-header">
                  <h3>播放列表 ({{ playerStore.playlist.length }})</h3>
                  <yin-icon
                    icon="mdi:close"
                    class="close-icon"
                    @click="showPlaylistDialog = false"
                  ></yin-icon>
                </div>
                <div class="playlist-content">
                  <div
                    v-for="(track, index) in playerStore.playlist"
                    :key="track.id"
                    class="track-item"
                    :class="{ active: index === playerStore.currentIndex }"
                    @click="selectTrackAtIndex(index)"
                  >
                    <span class="index">{{ index + 1 }}.</span>
                    <div class="track-info">
                      <div class="track-name">{{ track.name }}</div>
                      <div class="track-artist">
                        {{
                          track.artists?.map((a) => a.name).join(', ') ||
                          '未知艺术家'
                        }}
                      </div>
                    </div>
                    <yin-icon
                      icon="mdi:trash-can-outline"
                      class="delete-btn"
                      @click.stop="handleDeleteTrack(index)"
                    ></yin-icon>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </teleport>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.play-bar {
  background-color: #fff;
  position: fixed;
  z-index: 100;
  bottom: 0;
  width: 100%;
  transition: all 0.5s;

  .fold {
    position: absolute;
    bottom: 10px;
    left: 20px;
    cursor: pointer;
  }

  .progress {
    position: absolute;
    margin-top: -20px;
    width: 97%;
  }

  .control-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .song-ctr {
      position: relative;
      margin: auto;
      flex-wrap: nowrap;

      svg {
        width: 5rem;
        cursor: pointer;
      }
    }

    .info-box {
      .song-bar-img {
        width: 35px;
        height: 35px;
        border-radius: 4px;
        margin-right: 10px;
        cursor: pointer;
      }
      .song-info {
        font-size: 14px;
      }
      .time-info {
        font-size: 14px;
        color: grey;
      }
    }

    .song-edit {
      width: 30%;
      justify-content: flex-end;
    }
  }
}

.turn {
  transform: rotate(180deg);
}

/* .show {
  bottom: 5px;
} */

.icon {
  color: black;
  size: 1.1em;
}

.active.icon {
  color: red;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* 弹窗容器 */
.custom-playlist-dialog {
  position: fixed;
  right: 0;
  bottom: 60px; /* 与播放栏高度一致 */
  z-index: 2000;
  width: 100%;
  max-width: 400px;
  background: #fff;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px 12px 0 0;
  overflow: hidden;

  .playlist-wrapper {
    max-height: 60vh;
    display: flex;
    flex-direction: column;

    .playlist-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #f8f9fa;
      border-bottom: 1px solid #eee;

      h3 {
        margin: 0;
        font-size: 16px;
        color: #333;
      }

      .close-icon {
        cursor: pointer;
        font-size: 20px;
        color: #666;
        transition: color 0.2s;

        &:hover {
          color: #333;
        }
      }
    }

    .playlist-content {
      flex: 1;
      overflow-y: auto;
      padding: 0 16px;

      .track-item {
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: background 0.2s;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          background: #f8f9fa;
        }

        &.active {
          color: #409eff;
          .track-name {
            font-weight: 500;
          }
        }

        .index {
          width: 32px;
          color: #999;
          font-size: 14px;
        }

        .track-info {
          flex: 1;
          overflow: hidden;

          .track-name {
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .track-artist {
            font-size: 12px;
            color: #666;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
.track-item {
  position: relative; // 为删除按钮定位提供基准
  padding-right: 40px; // 为删除按钮留出空间

  .delete-btn {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    font-size: 16px;
    padding: 8px;
    transition: all 0.2s;
    opacity: 0; // 默认隐藏
    cursor: pointer;

    &:hover {
      color: #ff4d4f;
      transform: translateY(-50%) scale(1.1);
    }
  }

  &:hover .delete-btn {
    opacity: 1; // 悬停时显示
  }
}

@media screen and (min-width: 576px) {
  .info-box {
    width: 30%;
    min-width: 200px;
    // margin-left: 30px;
  }
  .song-ctr,
  .info-box,
  .song-edit {
    display: flex;
    align-items: center;
  }
}

@media screen and (max-width: 576px) {
  .info-box {
    display: flex;
    flex-direction: row;

    width: 50%;
    // margin-left: 10px;
  }
  .play-bar .progress {
    position: absolute;
    margin-top: -20px;
    width: 90%;
  }

  .song-ctr,
  .info-box,
  .song-edit {
    display: flex;
    align-items: center;
  }
  .song-info,
  .time-info {
    width: 30%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .yin-play-show2 {
    margin-right: 1rem;
  }
  .yin-play-show {
    display: none;
  }

  .sidebar {
    display: none;
  }
}
</style>
