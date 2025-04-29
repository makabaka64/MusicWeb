<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSearchResults, getTrackDetail } from '@/api/user'
import { usePlayerStore } from '@/stores'
import { ElMessage } from 'element-plus'

const playerStore = usePlayerStore()

const route = useRoute()
const router = useRouter()
const results = ref(null)

const fetchSearchResults = async (query) => {
  try {
    const res = await getSearchResults({
      q: query,
      type: 'track,artist,album',
      market: 'US',
      limit: 10,
      offset: 0
    })
    results.value = res
  } catch (error) {
    console.error('Error fetching search results:', error)
  }
}
const handleClick = async (row) => {
  try {
    const track = await getTrackDetail({ id: row.id })
    console.log('歌曲详情:', track)

    if (!track.preview_url) {
      ElMessage.warning('该歌曲没有可用的预览片段')
    }
    // 更新全局播放器状态
    playerStore.updatePlayer(track)
  } catch (error) {
    ElMessage.error(error.message || '播放失败')
  }
}
onMounted(() => {
  if (route.query.q) {
    fetchSearchResults(route.query.q)
  }
})

watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery) fetchSearchResults(newQuery)
  }
)
const goToAlbumDetail = (id) => {
  router.push({ path: `/song-detail/${id}` })
}
const goToArtistDetail = (id) => {
  router.push({ path: `/singer-detail/${id}` })
}
</script>
<template>
  <div class="search-page">
    <h3>搜索结果</h3>
    <div v-if="results">
      <div v-if="results.tracks">
        <h2>歌曲</h2>
        <ul class="list">
          <li
            v-for="track in results.tracks.items"
            :key="track.id"
            class="list-item"
            @click="handleClick(track)"
          >
            <span
              >{{ track.name }} -
              {{ track.artists.map((a) => a.name).join(', ') }}</span
            >
          </li>
        </ul>
      </div>
      <div v-if="results.artists">
        <h2>歌手</h2>
        <ul class="list">
          <li
            v-for="artist in results.artists.items"
            :key="artist.id"
            class="list-item"
            @click="goToArtistDetail(artist.id)"
          >
            <span>{{ artist.name }}</span>
          </li>
        </ul>
      </div>
      <div v-if="results.albums">
        <h2>专辑</h2>
        <ul class="list">
          <li
            v-for="album in results.albums.items"
            :key="album.id"
            class="list-item"
            @click="goToAlbumDetail(album.id)"
          >
            <span
              >{{ album.name }} -
              {{ album.artists.map((a) => a.name).join(', ') }}</span
            >
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <p>加载中...</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-page {
  width: 80%;
  //   max-width: 1200px;
  margin: 1rem auto;
  //   padding: 1rem;
  //   background: #f8f9fa;
  border-radius: 12px;
  //   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  h3 {
    color: #2c3e50;
    font-size: 1.5rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #3498db;
    font-weight: 600;
  }

  h2 {
    color: #34495e;
    font-size: 1.5rem;
    margin: 2rem 0 1rem;
    padding-left: 1rem;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 1.2em;
      background: #3498db;
      border-radius: 2px;
    }
  }

  .list {
    display: grid;
    gap: 0.8rem;
    // background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    &-item {
      padding: 1rem 1.5rem;
      border-radius: 6px;
      background: white;
      transition: all 0.2s ease;
      cursor: pointer;
      display: flex;
      align-items: center;

      &:hover {
        background: #f8f9fa;
        transform: translateX(5px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      }

      span {
        font-size: 1rem;
        color: #2c3e50;

        &:first-child {
          flex-grow: 1;
        }
      }

      // 歌曲类型特定样式
      .track-artists {
        font-size: 0.9rem;
        color: #7f8c8d;
        margin-left: 0.5rem;
      }
    }
  }

  // 不同类型区块的装饰色
  [v-if='results.tracks'] h3::before {
    background: #e74c3c;
  }
  [v-if='results.artists'] h3::before {
    background: #2ecc71;
  }
  [v-if='results.albums'] h3::before {
    background: #9b59b6;
  }

  // 加载中样式
  p {
    text-align: center;
    color: #7f8c8d;
    padding: 2rem;
    font-size: 1.2rem;

    &::after {
      content: '···';
      display: inline-block;
      animation: loading 1.5s infinite;
    }
  }

  @keyframes loading {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 1rem;

    h2 {
      font-size: 2rem;
    }

    .list {
      padding: 1rem;

      &-item {
        padding: 0.8rem;
      }
    }
  }
}
</style>
