<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SongList from '@/components/SongList.vue'
import { useArtistStore } from '@/stores'

const route = useRoute()
const playlistStore = useArtistStore()

onMounted(async () => {
  const artistId = route.params.id
  await playlistStore.fetchArtistData(artistId)
  await playlistStore.fetchTopTracks(artistId)
})
</script>

<template>
  <el-container>
    <el-aside class="album-slide">
      <el-image
        class="singer-img"
        fit="contain"
        :src="playlistStore.songDetails?.pic"
      />
      <div class="album-info">
        <ul>
          <li v-if="playlistStore.songDetails">
            粉丝：{{ playlistStore.songDetails.followers }}
          </li>
          <li v-if="playlistStore.songDetails">
            人气：{{ playlistStore.songDetails.popularity }}
          </li>
        </ul>
      </div>
    </el-aside>
    <el-main class="album-main">
      <h1>{{ playlistStore.songDetails?.name }}</h1>
      <p>{{ playlistStore.songDetails?.introduction }}</p>

      <song-list :songList="playlistStore.currentSongList" />
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
