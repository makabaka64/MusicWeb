<script setup>
import { computed, watch, ref, onMounted, onBeforeUnmount } from 'vue'
import { usePlayerStore } from '@/stores'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
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
// 侧边栏显示控制
const showSidebar = ref(false)
const toggleIcon = ref(null) // 触发按钮的引用
const sidebar = ref(null) // 侧边栏的引用
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}
// 处理全局点击事件
const handleDocumentClick = (event) => {
  // 获取DOM元素引用
  const iconEl = toggleIcon.value?.$el // 获取组件根元素
  const sidebarEl = sidebar.value

  // 判断点击位置
  const isClickInside = sidebarEl?.contains(event.target)
  const isClickOnIcon = iconEl?.contains(event.target)

  // 如果点击外部区域则关闭侧边栏
  if (!isClickInside && !isClickOnIcon) {
    showSidebar.value = false
  }
}
// 监听侧边栏状态变化
watch(showSidebar, (newVal) => {
  if (newVal) {
    document.addEventListener('click', handleDocumentClick)
  } else {
    document.removeEventListener('click', handleDocumentClick)
  }
})
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

// 组件挂载时，先获取用户信息，再获取收藏列表
onMounted(async () => {
  await fetchUserInfo()
  if (user_id.value) {
    await fetchUserFavorites()
  }
})
// 组件卸载时清理事件监听
onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
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
          ref="toggleIcon"
          :icon="iconList.LIEBIAO"
          @click="toggleSidebar"
        ></yin-icon>
        <!-- 侧边栏，v-if 控制显示  -->
        <div v-if="showSidebar" class="sidebar" ref="sidebar">
          <div class="play-title">播放列表</div>
          <ul>
            <li
              v-for="(track, index) in playerStore.playlist"
              :key="track.id"
              :class="{ active: index === playerStore.currentIndex }"
              @click="playerStore.playTrackAtIndex(index)"
            >
              {{ track.name }} ---
              {{
                track.artists?.map((a) => a.name)?.join(', ') || '未知艺术家'
              }}
            </li>
          </ul>
        </div>
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
.sidebar {
  position: absolute;
  top: -150px;
  right: -20px;
  width: 370px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  height: 100px;
  /* max-height: 100%; */
  overflow-y: auto;
  .play-title {
    text-align: center;
    padding-bottom: 10px;
    border-bottom: 2px solid #f0f0f0;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    padding-bottom: 10px;
    border-bottom: 2px solid #f0f0f0;
    cursor: pointer;
  }
  li.active {
    background: #f0f0f0;
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
