<script setup>
import { ref } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'

// 数据：歌曲列表
const dataList = ref([
  {
    id: 1,
    songName: '演员',
    singerName: '薛之谦',
    introduction: '《演员》专辑',
    url: 'https://example.com/song1.mp3'
  },
  {
    id: 2,
    songName: '平凡之路',
    singerName: '朴树',
    introduction: '《平凡之路》专辑',
    url: 'https://example.com/song2.mp3'
  },
  {
    id: 3,
    songName: '岁月神偷',
    singerName: '金玟岐',
    introduction: '《岁月神偷》专辑',
    url: 'https://example.com/song3.mp3'
  }
])

// 控制删除按钮的显示
const show = ref(true)

//行点击事件
const handleClick = (row) => {
  console.log('点击的行数据：', row)
}

// 编辑事件
const handleEdit = (row) => {
  console.log('编辑行数据：', row)
  // 这里可以加入编辑的逻辑
}

//下载音乐
// const downloadMusic = ({ songUrl, songName }) => {
//   console.log(`开始下载 ${songName}：${songUrl}`)
//   // 在这里实现下载逻辑
//   const link = document.createElement('a')
//   link.href = songUrl
//   link.download = songName
//   link.click()
// }

// 删除收藏
// const deleteCollection = ({ id }) => {
//   console.log(`删除歌曲ID：${id}`)
//   // 删除逻辑，例如发送请求至后端
//   dataList.value = dataList.value.filter((item) => item.id !== id)
// }
</script>
<template>
  <div class="content">
    <el-table
      :data="dataList"
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
            <el-button size="small" @click="handleEdit(scope.row)">
              下载
            </el-button>
            <el-button size="small" type="danger" @click="show(scope.row)">
              删除
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
  max-width: 1200px; /* 限制最大宽度 */
  margin: 0 auto; /* 居中 */
  display: flex; /* 使用flex布局 */
  justify-content: center; /* 从两边向中间对齐 */
}

.content:deep(.el-table__row) {
  cursor: pointer;
}
.action-buttons {
  display: flex;
  justify-content: center; /* 按钮居中 */
  gap: 10px; /* 设置按钮之间的间隔 */
}

.el-button {
  width: 45px; /* 设置按钮的统一宽度 */
}
</style>
