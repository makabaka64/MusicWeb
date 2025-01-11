<script setup>
import { ref, computed } from 'vue'
import SongList from '@/components/SongList.vue'
import Comment from '@/components/CommentList.vue'

// 歌单信息
const songDetails = ref({
  title: '周杰伦精选',
  pic: 'https://example.com/album.jpg',
  introduction: '精选集，收录了周杰伦的经典作品。'
})

// 歌曲列表
const currentSongList = ref([
  { id: 1, songName: '青花瓷', singerName: '周杰伦', duration: '04:40' },
  { id: 2, songName: '稻香', singerName: '周杰伦', duration: '03:40' },
  { id: 3, songName: '晴天', singerName: '周杰伦', duration: '03:50' }
])

// 评论组件需要的 ID
const songListId = ref(123)

// 评分变量
const rank = ref(4) // 歌单评分
const score = ref(3) // 用户评分

// 辅助文本
const assistText = computed(() => (score.value >= 4 ? '优秀' : '一般'))

// 是否禁用评分
const disabledRank = ref(false)

// 更新评分值
const pushValue = () => {
  console.log('用户评分:', score.value)
  // 在这里可以执行一些评分提交的操作，比如向后端提交评分等
}
</script>
<template>
  <el-container>
    <el-aside class="album-slide">
      <el-image class="album-img" fit="contain" :src="songDetails.pic" />
      <h3 class="album-info">{{ songDetails.title }}</h3>
    </el-aside>
    <el-main class="album-main">
      <h1>简介</h1>
      <p>{{ songDetails.introduction }}</p>
      <!--评分-->
      <div class="album-score">
        <div>
          <h3>歌单评分</h3>
          <el-rate v-model="rank" allow-half disabled></el-rate>
        </div>
        <span>{{ rank * 2 }}</span>
        <div>
          <h3>{{ assistText }} {{ score * 2 }}</h3>
          <el-rate
            allow-half
            v-model="score"
            :disabled="disabledRank"
            @click="pushValue()"
          ></el-rate>
        </div>
      </div>
      <!--歌曲-->
      <song-list class="album-body" :songList="currentSongList"></song-list>
      <comment :playId="songListId" :type="1"></comment>
    </el-main>
  </el-container>
</template>
<style lang="scss" scoped>
.album-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;

  .album-img {
    height: 250px;
    width: 250px;
    border-radius: 10%;
  }

  .album-info {
    width: 70%;
    padding-top: 2rem;
    padding-left: 7rem;
  }
}

.album-main {
  h1 {
    font-size: 22px;
  }

  p {
    color: rgba(0, 0, 0, 0.5);
    margin: 10px 0 20px 0px;
  }
  /*歌单打分*/
  .album-score {
    display: flex;
    align-items: center;
    margin: 1vw;

    h3 {
      margin: 10px 0;
    }
    span {
      font-size: 60px;
    }
    & > div:last-child {
      margin-left: 10%;
    }
  }

  .album-body {
    margin: 20px 0 20px 0px;
  }
}

@media screen and (min-width: 768px) {
  .album-slide {
    // 内容不会随页面滚动
    position: fixed;
    width: 400px;
  }
  .album-main {
    min-width: 600px;
    padding-right: 10vw;
    margin-left: 400px;
  }
}
// 小屏幕时，侧边栏不可见
@media screen and (max-width: 1024px) {
  .album-slide {
    display: none;
  }
}
</style>
