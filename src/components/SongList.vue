<script setup>
import { ref, onMounted, watch } from 'vue'
import { defineProps } from 'vue'
import { usePlayerStore } from '@/stores'
import { ElMessage, ElButton, ElTable, ElTableColumn } from 'element-plus'
import {
  userAddFavoriteService,
  userDeleteFavoriteService,
  userGetInfoService,
  userGetFavoriteListService,
  getTrackDetail
} from '@/api/user'
const playerStore = usePlayerStore()
// 使用 defineProps 定义 songList 属性，父组件传递的歌曲列表数据将通过这个 prop 获取
const props = defineProps({
  songList: {
    type: Array,
    default: () => []
  }
})
// 歌曲列表
const processedSongList = ref([])
// 当前用户 id
const user_id = ref(null)
// 用来保存用户收藏的歌曲 id 列表
const favoriteList = ref([])

// 播放器相关
// const audioPlayer = ref(null)

// 点击行时调用：根据歌曲名称与歌手名称构造查询，并获取预览音频 URL 播放
const handleClick = async (row) => {
  try {
    // 调用 getTrackDetail 方法获取单曲详情数据
    const track = await getTrackDetail({ id: row.id })
    console.log('歌曲详情:', track)

    if (!track.preview_url) {
      ElMessage.warning('该歌曲没有可用的预览片段')
      // return
    }
    // 如果该歌曲还不在播放列表中，则添加到列表
    const list = [...playerStore.playlist]
    const exists = list.some((item) => item.id === track.id)
    if (!exists) {
      list.push(track)
      playerStore.setPlaylist(list)
      // 更新 currentIndex 为新添加歌曲的索引
      playerStore.currentIndex = list.length - 1
    } else {
      // 如果已经存在，则更新 currentIndex 为已有位置
      const index = list.findIndex((item) => item.id === track.id)
      playerStore.currentIndex = index
    }
    // 更新全局播放器状态
    playerStore.updatePlayer(track)

    // 此处你可以调用一个播放方法，由全局 audio 播放器进行播放
    // 例如通过调用一个全局播放函数：playPreview(track.preview_url)
  } catch (error) {
    ElMessage.error(error.message || '播放失败')
  }
}

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const res = await userGetInfoService()
    user_id.value = res.data.data.id
  } catch (error) {
    ElMessage.error(error.message || '获取用户信息失败')
  }
}

// 获取用户收藏列表
const fetchUserFavorites = async () => {
  try {
    const res = await userGetFavoriteListService(user_id.value)
    if (res.data.status === 0) {
      // 假设后端返回的数据中 song_id 为歌曲ID，并且 collected 字段的值都是 0（表示已收藏）
      favoriteList.value = res.data.data.map((item) => item.song_id)
    }
  } catch (error) {
    ElMessage.error('获取收藏列表失败：' + error.message)
  }
}

// 观察props变化
watch(
  () => props.songList,
  (newList) => {
    if (user_id.value && newList.length) {
      processedSongList.value = newList.map((item) => ({
        ...item,
        collected: favoriteList.value.includes(item.id) ? 0 : 1
      }))
      // console.log('歌曲列表更新:', processedSongList.value)
    }
  },
  { immediate: true, deep: true }
)
onMounted(async () => {
  try {
    await fetchUserInfo()
    if (user_id.value) {
      await fetchUserFavorites()
      // 使用映射创建新数组代替直接修改props
      processedSongList.value = props.songList.map((item) => ({
        ...item,
        collected: favoriteList.value.includes(item.id) ? 0 : 1
      }))
    }
  } catch (error) {
    ElMessage.error('初始化失败: ' + error.message)
  }
})
const Collection = async (row) => {
  try {
    if (!user_id.value) {
      ElMessage.warning('请先登录')
      return
    }

    const isCollected = favoriteList.value.includes(row.id)

    if (!isCollected) {
      const params = {
        user_id: user_id.value,
        song_id: row.id, // 歌曲ID存储在 row.id 中
        songName: row.songName,
        singerName: row.singerName,
        introduction: row.introduction
        // collected: 0 // 明确传递状态
      }
      const res = await userAddFavoriteService(params)
      // console.log('收藏列表更新:', favoriteList.value)
      if (res.data.status === 0) {
        favoriteList.value = [...favoriteList.value, row.id] // 保持响应式
        updateCollectionStatus(row.id, 0)
      }
    } else {
      const res = await userDeleteFavoriteService({
        user_id: user_id.value,
        song_id: row.id
      })
      if (res.data.status === 0) {
        favoriteList.value = favoriteList.value.filter((id) => id !== row.id)
        updateCollectionStatus(row.id, 1)
      }
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '操作失败')
  }
}

// 新增状态更新方法
const updateCollectionStatus = (song_id, status) => {
  processedSongList.value = processedSongList.value.map((item) => {
    if (item.id === song_id) {
      return { ...item, collected: status }
    }

    return item
  })
}
</script>

<template>
  <div class="content">
    <el-table
      :data="processedSongList"
      highlight-current-row
      stripe
      @row-click="handleClick"
      style="width: 100%; max-width: 900px; margin: 0 auto"
      :fit="true"
    >
      <el-table-column
        prop="songName"
        label="歌曲"
        width="200"
        align="center"
      />
      <el-table-column
        prop="singerName"
        label="歌手"
        width="200"
        align="center"
      />
      <el-table-column
        prop="introduction"
        label="专辑"
        width="250"
        align="center"
      />
      <el-table-column label="操作" width="250" align="center">
        <template #default="scope">
          <div class="action-buttons">
            <el-button
              size="small"
              @click.stop="Collection(scope.row)"
              :type="scope.row.collected === 0 ? 'danger' : 'primary'"
            >
              {{ scope.row.collected === 0 ? '取消收藏' : '收藏' }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.content {
  background-color: #ffffff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}
.content:deep(.el-table__row) {
  cursor: pointer;
}
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.el-button {
  width: 45px;
}
</style>
