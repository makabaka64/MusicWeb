<script setup>
import { ref, onMounted, computed } from 'vue'
import PlayList from '@/components/PlayList.vue'
import { usePlaylistStore, useArtistStore } from '@/stores'
const artistStore = useArtistStore()
const playlistStore = usePlaylistStore()
const loading = ref({
  artists: true,
  playlists: true
})
// 请求并获取数据
onMounted(async () => {
  try {
    await Promise.all([
      artistStore.fetchTopArtists(),
      playlistStore.fetchAllPlaylists()
    ])
  } catch (error) {
    console.error('数据加载失败:', error)
  } finally {
    loading.value.artists = false
    loading.value.playlists = false
  }
})
// onMounted(async () => {
//   await artistStore.fetchTopArtists()
//   await playlistStore.fetchAllPlaylists()
// })

// 只获取前五个歌手
const top5Artists = computed(() => {
  return (artistStore.allPlayList || []).slice(0, 5)
})

const top5Playlists = computed(() => {
  return (playlistStore.allPlayList || []).slice(0, 5)
})

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
  <play-list
    class="play-list-container"
    title="歌单"
    path="song-detail"
    :playList="top5Playlists"
  ></play-list>

  <play-list
    v-if="!loading.artists && top5Artists.length"
    class="play-list-container"
    title="歌手"
    path="singer-detail"
    :playList="top5Artists"
  ></play-list>
</template>
<style lang="scss" scoped>
.swiper-container {
  width: 80%;
  height: 23rem;
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
