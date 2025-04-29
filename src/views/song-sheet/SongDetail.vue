<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePlaylistStore } from '@/stores'
import SongList from '@/components/SongList.vue'
import Comment from '@/components/CommentList.vue'

const route = useRoute()
const playlistStore = usePlaylistStore()
const Loading = ref(true)

onMounted(async () => {
  try {
    const albumId = route.params.id
    await Promise.all([
      playlistStore.fetchPlaylistDetail(albumId),
      playlistStore.fetchPlaylistTracks(albumId)
    ])
  } finally {
    Loading.value = false
  }
})
</script>
<template>
  <el-container>
    <el-aside class="album-slide">
      <el-image
        class="album-img"
        fit="contain"
        :src="playlistStore.currentPlaylist?.pic"
      />
      <div class="album-info">
        <ul>
          <li v-if="playlistStore.currentPlaylist">
            发布日期：{{ playlistStore.currentPlaylist.release_date }}
          </li>
          <li v-if="playlistStore.currentPlaylist">
            总曲目数：{{ playlistStore.currentPlaylist.total_tracks }}
          </li>
        </ul>
      </div>
    </el-aside>
    <el-main class="album-main">
      <h1>{{ playlistStore.currentPlaylist?.introduction }}</h1>
      <song-list
        class="album-body"
        :songList="playlistStore.currentSongList"
      ></song-list>
      <comment
        :playId="playlistStore.currentPlaylist?.id"
        :type="1"
        v-if="playlistStore.currentPlaylist?.id"
        :key="playlistStore.currentPlaylist?.id"
      ></comment>
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
