<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 获取歌曲ID并加载数据
const songId = ref(route.params.id)
const songPic = ref('')
const songTitle = ref('')
const singerName = ref('')
const lyricArr = ref([]) // 歌词数组
const lrcTop = ref('0px') // 歌词位置

onMounted(() => {
  // 假设你有获取歌曲信息和歌词的 API
  // 这里可以通过 songId 请求数据
  fetchSongData(songId.value)
})

const fetchSongData = () => {
  // 你可以根据 `id` 获取歌曲的图片、标题、歌手信息等
  // 这里是示例代码
  songPic.value = 'path-to-song-image.jpg'
  songTitle.value = '歌曲名称'
  singerName.value = '歌手名'
  lyricArr.value = [
    [0, '第一句歌词'],
    [15, '第二句歌词'],
    [30, '第三句歌词']
    // ...
  ]
}
</script>
<template>
  <div class="song-container">
    <!-- :src="attachImageUrl(songPic) -->
    <el-image class="song-pic" fit="contain" />
    <ul class="song-info">
      <li>歌手：{{ singerName }}</li>
      <li>歌曲：{{ songTitle }}</li>
    </ul>
  </div>
  <div class="container">
    <div class="lyric-container">
      <div class="song-lyric">
        <transition-group name="lyric-fade">
          <!--有歌词-->
          <ul
            :style="{ top: lrcTop }"
            class="has-lyric"
            v-if="lyricArr.length"
            key="has-lyric"
          >
            <li v-for="(item, index) in lyricArr" :key="index">
              {{ item[1] }}
            </li>
          </ul>
          <!--没歌词-->
          <div v-else class="no-lyric" key="no-lyric">
            <span>暂无歌词</span>
          </div>
        </transition-group>
      </div>
      <comment :playId="songId" :type="0"></comment>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.song-container {
  position: fixed;
  top: 120px;
  left: 50px;
  display: flex;
  flex-direction: column;

  .song-pic {
    height: 300px;
    width: 300px;
    border: 4px solid white;
    border-radius: 12px;
  }

  .song-info {
    width: 300px;
    li {
      width: 100%;
      line-height: 40px;
      font-size: 18px;
      padding-left: 10%;
    }
  }
}

.lyric-container {
  .song-lyric {
    position: relative;
    min-height: 300px;
    padding: 30px 0;
    overflow: auto;
    border-radius: 12px;
    background-color: grey;
    display: flex;
    justify-content: center;
    .has-lyric {
      position: absolute;
      transition: all 1s;
      li {
        width: 100%;
        height: 40px;
        text-align: center;
        font-size: 14px;
        line-height: 40px;
      }
    }
    .no-lyric {
      position: absolute;
      margin: 100px 0;

      span {
        font-size: 18px;
        text-align: center;
      }
    }
  }
}

.lyric-fade-enter,
.lyric-fade-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

.lyric-fade-enter-active,
.lyric-fade-leave-active {
  transition: all 0.3s ease;
}

@media screen and (min-width: 640px) {
  .container {
    padding-top: 30px;
  }
  .lyric-container {
    margin: 0 150px 0px 400px;
  }
}

@media screen and (min-width: 1024px) {
  .container {
    padding: 20px;
  }
  .song-container {
    display: none;
  }
}
</style>
