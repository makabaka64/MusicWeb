<script setup>
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores'
import { useRecommendStore } from '@/stores'
import { useRouter } from 'vue-router'
import SongGrid from '@/components/SongGrid.vue'

const router = useRouter()
// const userStore = useUserStore()
const recommendStore = useRecommendStore()
const { user } = useUserStore()
const gocomment = () => {
  // 跳转到评论页面
  router.push({ path: '/recommend' })
}
onMounted(async () => {
  await recommendStore.loadAllRecommendations(user.id)
})

const loading = computed(() => recommendStore.loading)
</script>
<template>
  <div class="recommend-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <el-skeleton :rows="6" animated />
    </div>

    <!-- 无收藏提示 -->
    <div v-else-if="!recommendStore.hasCollections" class="empty-tip">
      <h2>🎵 发现你的音乐品味</h2>
      <p>收藏至少3首歌曲，系统将为你生成个性化推荐</p>
      <div class="hot-recommend" @click="gocomment">
        <h3>热门推荐</h3>
        <hot-list />
      </div>
    </div>

    <!-- 推荐内容 -->
    <div v-else>
      <section class="recommend-section">
        <h3>🔥 热门歌曲推荐</h3>
        <song-grid :tracks="recommendStore.hotList" />
      </section>
      <!-- 协同过滤推荐 -->
      <section class="recommend-section">
        <h3>🎧 相似用户也喜欢</h3>
        <song-grid :tracks="recommendStore.collaborativeList" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.recommend-page {
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.hot-recommend {
  cursor: pointer;
}
.loading {
  padding: 40px;
}

.empty-tip {
  text-align: center;
  padding: 40px;

  h2 {
    color: var(--el-color-primary);
    margin-bottom: 15px;
  }

  p {
    color: #666;
    margin-bottom: 30px;
  }
}

.recommend-section {
  margin: 40px 0;

  h3 {
    border-left: 4px solid var(--el-color-primary);
    padding-left: 12px;
    margin-bottom: 20px;
  }
}
</style>
