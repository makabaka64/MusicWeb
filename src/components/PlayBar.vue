<script setup>
import { ref } from 'vue'

// 控制组件的显示和隐藏
const toggle = ref(false)

// 当前播放时间
const nowTime = ref(0)
const songTitle = ref('歌曲名称')
const singerName = ref('歌手名')
const songId = ref(1)
const startTime = ref('00:00')
const endTime = ref('03:30')

// 播放状态
const playStateList = ['mdi:play', 'mdi:pause'] // 替换成实际图标
const playStateIndex = ref(0) // 0 为播放状态，1 为暂停状态
// 音量控制
const volume = ref(50)

// 收藏状态
const isCollection = ref(false)

// 图标列表

const iconList = {
  // ZHEDIE: 'material-symbols:menu', // 折叠图标
  SHANGYISHOU: 'mdi:skip-previous', // 上一首
  XIAYISHOU: 'mdi:skip-next', // 下一首
  YINLIANG: 'mdi:volume-high', // 音量
  JINGYIN: 'mdi:volume-mute', // 静音
  like: 'mdi:heart', // 喜欢
  dislike: 'mdi:heart-outline', // 不喜欢
  download: 'mdi:download', // 下载
  LIEBIAO: 'mdi:playlist-music' // 列表
}

// 播放状态切换
const changePlayState = () => {
  playStateIndex.value = playStateIndex.value === 0 ? 1 : 0
}

// 上一首
const prev = () => {
  // 下一首的逻辑
}

// 下一首
const next = () => {
  // 下一首的逻辑
}

// 音量变化
// const changeVolume = (newVolume) => {
//   volume.value = newVolume
// }

// 进度条变化
const changeTime = (newTime) => {
  nowTime.value = newTime
}

// 收藏状态切换
const changeCollection = () => {
  isCollection.value = !isCollection.value
}

// 下载音乐
const downloadMusic = () => {
  // 处理下载逻辑
}

// 跳转到播放器页面
const goPlayerPage = () => {
  // 跳转到播放器页面的逻辑
}

// 切换侧边栏
const changeAside = () => {
  // 切换侧边栏的逻辑
}
</script>
<template>
  <div class="play-bar" :class="{ show: !toggle }">
    <div class="fold" :class="{ turn: toggle }"></div>
    <yin-icon :icon="iconList.ZHEDIE" @click="toggle = !toggle"></yin-icon>
    <!--播放进度-->
    <el-slider
      class="progress"
      v-model="nowTime"
      @change="changeTime"
      size="small"
    ></el-slider>
    <div class="control-box">
      <div class="info-box">
        <!--歌曲图片-->
        <div @click="goPlayerPage">
          <el-image class="song-bar-img" fit="contain" />
        </div>
        <!--播放开始结束时间-->
        <div v-if="songId">
          <div class="song-info">{{ songTitle }} - {{ singerName }}</div>
          <div class="time-info">{{ startTime }} / {{ endTime }}</div>
        </div>
      </div>
      <div class="song-ctr">
        <!--上一首-->
        <yin-icon
          class="yin-play-show"
          :icon="iconList.SHANGYISHOU"
          @click="prev"
        ></yin-icon>
        <!--播放-->
        <yin-icon
          class="yin-play-show"
          :icon="playStateList[playStateIndex]"
          @click="changePlayState"
        ></yin-icon>
        <!-- <yin-icon :icon="playBtnIcon" @click="togglePlay"></yin-icon> -->
        <!--下一首-->
        <yin-icon
          class="yin-play-show"
          :icon="iconList.XIAYISHOU"
          @click="next"
        ></yin-icon>
        <!--音量-->
        <el-dropdown class="yin-play-show" trigger="click">
          <yin-icon v-if="volume !== 0" :icon="iconList.YINLIANG"></yin-icon>
          <yin-icon v-else :icon="iconList.JINGYIN"></yin-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-slider
                class="yin-slider"
                style="height: 150px; margin: 10px 0"
                v-model="volume"
                :vertical="true"
              ></el-slider>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="song-ctr song-edit">
        <!--收藏-->
        <yin-icon
          class="yin-play-show"
          :class="{ active: isCollection }"
          :icon="isCollection ? iconList.like : iconList.dislike"
          @click="changeCollection"
        ></yin-icon>
        <!--下载-->
        <yin-icon
          class="yin-play-show"
          :icon="iconList.download"
          @click="downloadMusic"
        ></yin-icon>
        <!--歌曲列表-->
        <yin-icon :icon="iconList.LIEBIAO" @click="changeAside"></yin-icon>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
        font-size: 12px;
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

@media screen and (min-width: 576px) {
  .info-box {
    width: 30%;
    min-width: 200px;
    margin-left: 30px;
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
    width: 70%;
    margin-left: 10px;
  }

  .yin-play-show {
    display: none;
  }
}
</style>
