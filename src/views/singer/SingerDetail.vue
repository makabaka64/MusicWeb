<script setup>
import { ref } from 'vue'
import SongList from '@/components/SongList.vue'
// 模拟的歌手信息
const songDetails = ref({
  name: '周杰伦',
  pic: 'https://example.com/jaychou.jpg',
  sex: 1, // 1: 男, 2: 女
  birth: '1978-01-18',
  location: '台湾',
  introduction:
    '周杰伦，华语流行歌手、音乐制作人，凭借个人音乐作品的独特风格...'
})

// 模拟的歌曲列表
const currentSongList = ref([
  { id: 1, name: '青花瓷', duration: '04:40' },
  { id: 2, name: '稻香', duration: '03:40' },
  { id: 3, name: '晴天', duration: '03:50' },
  { id: 4, name: '不能说的秘密', duration: '04:30' }
])
</script>
<template>
  <el-container>
    <el-aside class="album-slide">
      <el-image class="singer-img" fit="contain" :src="songDetails.pic" />
      <div class="album-info">
        <h2>基本资料</h2>
        <ul>
          <li v-if="songDetails.sex !== 2">性别：{{ songDetails.sex }}</li>
          <li>生日：{{ songDetails.birth }}</li>
          <li>故乡：{{ songDetails.location }}</li>
        </ul>
      </div>
    </el-aside>
    <el-main class="album-main">
      <h1>{{ songDetails.name }}</h1>
      <p>{{ songDetails.introduction }}</p>
      <song-list :songList="currentSongList"></song-list>
    </el-main>
  </el-container>
</template>
<style lang="scss" scoped>
.album-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;

  .singer-img {
    height: 250px;
    width: 250px;
    border-radius: 10%;
  }

  .album-info {
    width: 60%;
    padding-top: 2rem;
    li {
      width: 100%;
      height: 30px;
      line-height: 30px;
    }
  }
}

.album-main {
  p {
    color: rgba(0, 0, 0, 0.5);
    margin: 10px 0 20px 0px;
  }
}

@media screen and (min-width: 768px) {
  .album-slide {
    position: fixed;
    width: 400px;
  }
  .album-main {
    min-width: 600px;
    padding-right: 10vw;
    margin-left: 400px;
  }
}

@media screen and (max-width: 1024px) {
  .album-slide {
    display: none;
  }
}
</style>
