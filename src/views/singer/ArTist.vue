<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import PlayList from '@/components/PlayList.vue'
import { useArtistStore } from '@/stores'
const playlistStore = useArtistStore()
const scrollTrigger = ref(null)
let observer = null
onMounted(async () => {
  // 先清空已有数据确保从第一页开始
  playlistStore.allPlayList = []
  playlistStore.page = 0
  playlistStore.hasMore = true

  // 等待初始数据加载完成
  await playlistStore.fetchTopArtists()

  // 数据加载完成后再初始化观察者
  observer = new IntersectionObserver(
    (entries) => {
      if (
        entries[0].isIntersecting &&
        !playlistStore.isLoading &&
        playlistStore.hasMore
      ) {
        playlistStore.fetchTopArtists()
      }
    },
    {
      root: null,
      rootMargin: '0px 0px 200px 0px', // 提前200px触发加载
      threshold: 0
    }
  )

  if (scrollTrigger.value) {
    observer.observe(scrollTrigger.value)
  }
})

onBeforeUnmount(() => {
  if (observer && scrollTrigger.value) {
    observer.unobserve(scrollTrigger.value)
  }
})
</script>

<template>
  <div class="play-list-container">
    <!-- 渲染歌手列表 -->
    <play-list
      class="play-liat"
      :playList="playlistStore.allPlayList"
      path="singer-detail"
    ></play-list>
    <div class="loading" v-if="playlistStore.isLoading">
      <div class="loader"></div>
    </div>
    <div class="no-more" v-if="!playlistStore.hasMore">没有更多了</div>

    <div ref="scrollTrigger" class="scroll-trigger"></div>
  </div>
</template>

<style lang="scss" scoped>
.play-list-container {
  margin-top: 70px;
  position: relative;
  min-height: 100vh;
}

.scroll-trigger {
  height: 1px;
  width: 100%;
  visibility: hidden; /* 隐藏触发元素避免布局干扰 */
}

.loading,
.no-more {
  text-align: center;
  padding: 10px;
  color: #666;
  font-size: 14px;
}
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
