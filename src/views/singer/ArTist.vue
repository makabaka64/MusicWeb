<script setup>
import { onMounted } from 'vue'
import PlayList from '@/components/PlayList.vue'
import { useArtistStore } from '@/stores'
const playlistStore = useArtistStore()
onMounted(() => {
  playlistStore.fetchTopArtists()
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
  </div>
</template>

<style lang="scss" scoped>
.play-list-container {
  margin-top: 70px;
}
.pagination {
  width: 80%;
  margin: auto;
}
</style>
