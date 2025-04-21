<script setup>
import { ElMessage } from 'element-plus'
import { usePlayerStore } from '@/stores'
const playerStore = usePlayerStore()
defineProps({
  tracks: {
    type: Array,
    default: () => []
  }
})

const handleClick = (row) => {
  if (!row.preview_url) {
    ElMessage.warning('该歌曲没有可用的预览片段')
  }
  playerStore.updatePlayer(row)
}
</script>
<template>
  <div class="song-grid">
    <div v-for="track in tracks" :key="track.id" class="song-card">
      <el-card shadow="hover">
        <img :src="track.album?.images?.[0]?.url" class="cover" />
        <div class="info" @click="handleClick(track)">
          <h4 class="title">{{ track.name }}</h4>
          <p class="artist">{{ track.artists?.[0]?.name }}</p>
          <!-- <audio controls :src="track.preview_url" class="preview" /> -->
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.song-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.song-card {
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
}

.cover {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  margin-bottom: 12px;
}

.title {
  font-size: 14px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.artist {
  color: #666;
  font-size: 12px;
  margin: 6px 0;
}

.preview {
  width: 100%;
  margin-top: 8px;
}
</style>
