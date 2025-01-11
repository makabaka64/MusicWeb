<script setup>
// 使用 Composition API 中的 `ref` 和 `reactive` 来声明响应式数据
import { ref } from 'vue'
import PlayList from '@/components/PlayList.vue'
// 歌单列表
const songList = ref([
  {
    name: '轻音乐精选',
    src: '../src/assets/例.jpg',
    id: 1
  },
  {
    name: '流行金曲',
    src: '../src/assets/例.jpg',
    id: 2
  },
  {
    name: '经典老歌',
    src: '../src/assets/例.jpg',
    id: 3
  },
  {
    name: '电子音乐',
    src: '../src/assets/例.jpg',
    id: 4
  }
])
// 歌手列表
const singerList = ref([
  {
    name: '周杰伦',
    src: '../src/assets/例.jpg',
    id: 1
  },
  {
    name: 'Taylor Swift',
    src: '../src/assets/例.jpg',
    id: 2
  },
  {
    name: '陈奕迅',
    src: '../src/assets/例.jpg',
    id: 3
  },
  {
    name: 'Adele',
    src: '../src/assets/例.jpg',
    id: 4
  }
])

// 轮播图数据
const images = ref([
  { src: '../src/assets/轮播图1.jpg', alt: 'Slide 1' },
  { src: '../src/assets/轮播图2.jpg', alt: 'Slide 2' },
  { src: '../src/assets/轮播图3.jpg', alt: 'Slide 3' },
  { src: '../src/assets/轮播图4.jpg', alt: 'Slide 4' }
])
// 创建一个响应式的歌单数据
</script>
<template>
  <el-carousel
    v-if="images.length"
    class="swiper-container"
    type="card"
    :interval="3000"
  >
    <el-carousel-item v-for="(item, index) in images" :key="index">
      <img :src="item.src" :alt="item.alt" class="carousel-img" />
    </el-carousel-item>
  </el-carousel>
  <!--热门歌单-->
  <play-list
    class="play-list-container"
    title="歌单"
    path="song-detail"
    :playList="songList"
  ></play-list>
  <!--热门歌手-->
  <play-list
    class="play-list-container"
    title="歌手"
    path="singer-detail"
    :playList="singerList"
  ></play-list>
</template>
<style lang="scss" scoped>
.swiper-container {
  width: 80%;
  height: 23rem; /* 设置轮播图的高度 */
  margin: auto;
  padding-top: 3rem;
  border-bottom: 1px solid #e4e7ed;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
}

.mySwiper {
  width: 100%;
  height: 100%;
}
</style>
