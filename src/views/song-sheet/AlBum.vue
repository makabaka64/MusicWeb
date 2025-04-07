<script setup>
import { onMounted } from 'vue'
import { usePlaylistStore } from '@/stores'
import PlayList from '@/components/PlayList.vue'

const playlistStore = usePlaylistStore()
onMounted(() => {
  playlistStore.fetchAllPlaylists()
})
</script>
<template>
  <div class="play-list-container">
    <play-list
      class="play-list"
      :playList="playlistStore.allPlayList"
      path="song-detail"
    ></play-list>
  </div>
</template>
<style lang="scss" scoped>
.pagination {
  width: 80%;
  margin: auto;
}
.play-list-container {
  margin-top: 70px;
}
</style>
