<script setup>
import { ref } from 'vue'
import PageNav from '@/components/PageNav.vue'
import PlayList from '@/components/PlayList.vue'

const activeName = ref('全部歌单')
const pageSize = ref(15) // 页数
const currentPage = ref(1) // 当前页
// const songStyle = ref(SONGSTYLE) // 歌单导航栏类别
const allPlayList = ref([]) // 歌单
const data = ref([
  {
    name: '轻音乐精选',
    src: '../src/assets/例.jpg',
    id: 1
  },
  {
    name: '流行金曲',
    src: '../src/assets/例.jpg',
    id: 2
  },
  {
    name: '经典老歌',
    src: '../src/assets/例.jpg',
    id: 3
  },
  {
    name: '电子音乐',
    src: '../src/assets/例.jpg',
    id: 4
  },
  {
    name: '轻音乐精选',
    src: '../src/assets/例.jpg',
    id: 1
  },
  {
    name: '流行金曲',
    src: '../src/assets/例.jpg',
    id: 2
  },
  {
    name: '经典老歌',
    src: '../src/assets/例.jpg',
    id: 3
  },
  {
    name: '电子音乐',
    src: '../src/assets/例.jpg',
    id: 4
  },
  {
    name: '经典老歌',
    src: '../src/assets/例.jpg',
    id: 3
  },
  {
    name: '电子音乐',
    src: '../src/assets/例.jpg',
    id: 4
  }
])
const songStyle = [
  {
    name: '全部歌单',
    type: '-1'
  },
  {
    name: '华语',
    type: '1'
  },
  {
    name: '粤语',
    type: '0'
  },
  {
    name: '欧美',
    type: '2'
  },
  {
    name: '日韩',
    type: '2'
  },
  {
    name: '轻音乐',
    type: '2'
  }
]
</script>
<template>
  <div class="play-list-container">
    <page-nav
      :styleList="songStyle"
      :activeName="activeName"
      @click="handleChangeView"
    ></page-nav>

    <play-list :playList="data" path="song-detail"></play-list>
    <el-pagination
      class="pagination"
      background
      layout="total, prev, pager, next"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="allPlayList.length"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>
<style lang="scss" scoped>
.pagination {
  width: 80%;
  margin: auto;
}
</style>
