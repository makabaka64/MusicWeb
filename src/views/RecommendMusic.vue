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
  { src: '../src/assets/轮播图3.jpg', alt: 'Slide 3' }
])
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
  <!-- 歌单骨架 -->
  <el-skeleton :loading="loading.playlists" animated class="skeleton-container">
    <template #template>
      <div class="skeleton-wrapper">
        <h3 class="skeleton-title">
          <el-skeleton-item variant="text" style="width: 60px" />
        </h3>
        <div class="skeleton-scroll">
          <div v-for="i in 5" :key="i" class="skeleton-card">
            <el-skeleton-item variant="image" class="skeleton-img" />
            <el-skeleton-item variant="text" style="width: 80%" />
            <el-skeleton-item variant="text" style="width: 60%" />
          </div>
        </div>
      </div>
    </template>
    <template #default>
      <play-list
        class="play-list-container"
        title="歌单"
        path="song-detail"
        :playList="top5Playlists"
      />
    </template>
  </el-skeleton>

  <!-- 歌手骨架 -->
  <el-skeleton :loading="loading.artists" animated class="skeleton-container">
    <template #template>
      <div class="skeleton-wrapper">
        <h3 class="skeleton-title">
          <el-skeleton-item variant="text" style="width: 60px" />
        </h3>
        <div class="skeleton-scroll">
          <div v-for="i in 5" :key="i" class="skeleton-card">
            <el-skeleton-item variant="image" class="skeleton-img" />
            <el-skeleton-item variant="text" style="width: 70%" />
            <el-skeleton-item variant="text" style="width: 50%" />
          </div>
        </div>
      </div>
    </template>
    <template #default>
      <play-list
        v-if="top5Artists.length"
        class="play-list-container"
        title="歌手"
        path="singer-detail"
        :playList="top5Artists"
      />
    </template>
  </el-skeleton>
</template>
<style lang="scss" scoped>
.swiper-container {
  width: 90%;
  max-width: 1200px;
  aspect-ratio: 16 / 5; // 自动控制高度
  margin: auto;
  padding-top: 3rem;
  border-bottom: 1px solid #e4e7ed;

  @media (max-width: 768px) {
    aspect-ratio: 16 / 9;
    padding-top: 6rem;
  }
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
.skeleton-container {
  --card-width: 210px;
  --gap: 20px;
  padding: 20px 2px;

  .skeleton-wrapper {
    max-width: 1200px;

    margin: 0 auto;
    padding: 0 20px;

    .skeleton-title {
      margin: 0 0 20px 10px;
      .el-skeleton__text {
        height: 24px;
      }
    }

    .skeleton-scroll {
      display: flex;
      gap: var(--gap);
      overflow-x: auto;
      padding-bottom: 10px;

      .skeleton-card {
        flex: 0 0 var(--card-width);
        display: flex;
        flex-direction: column;
        gap: 8px;

        .skeleton-img {
          width: 100%;
          height: var(--card-width);
          border-radius: 8px;
          &.circle {
            border-radius: 50%;
          }
        }

        .el-skeleton__text {
          height: 16px;
          margin: 0;
          &:last-child {
            width: 60% !important;
          }
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .skeleton-container {
    --card-width: 50px;
    --gap: 15px;

    .skeleton-wrapper {
      padding: 0 15px;

      .skeleton-title {
        margin-bottom: 15px;
      }
    }
  }
}
</style>
