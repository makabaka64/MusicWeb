<script setup>
import { ref } from 'vue'
import PageNav from '@/components/PageNav.vue'
import PlayList from '@/components/PlayList.vue'

// data
const singerStyle = [
  {
    name: '全部歌手',
    type: '-1'
  },
  {
    name: '男歌手',
    type: '1'
  },
  {
    name: '女歌手',
    type: '0'
  },
  {
    name: '组合乐队',
    type: '2'
  }
]
const activeName = ref('全部歌手')
const pageSize = ref(15) // 页数
const currentPage = ref(1) // 当前页
const allPlayList = ref([])
// computed
// const data = computed(() => {
//   return allPlayList.value.slice(
//     (currentPage.value - 1) * pageSize.value,
//     currentPage.value * pageSize.value
//   )
// })
const data = ref([
  {
    name: '周杰伦',
    src: '../src/assets/例.jpg',
    id: 1
  },
  {
    name: 'Taylor Swift',
    src: '../src/assets/例.jpg',
    id: 2
  },
  {
    name: '陈奕迅',
    src: '../src/assets/例.jpg',
    id: 3
  },
  {
    name: 'Adele',
    src: '../src/assets/例.jpg',
    id: 4
  },
  {
    name: '周杰伦',
    src: '../src/assets/例.jpg',
    id: 1
  },
  {
    name: 'Taylor Swift',
    src: '../src/assets/例.jpg',
    id: 2
  },
  {
    name: '陈奕迅',
    src: '../src/assets/例.jpg',
    id: 3
  },
  {
    name: 'Adele',
    src: '../src/assets/例.jpg',
    id: 4
  },
  {
    name: 'Taylor Swift',
    src: '../src/assets/例.jpg',
    id: 2
  },
  {
    name: '陈奕迅',
    src: '../src/assets/例.jpg',
    id: 3
  }
])
</script>
<template>
  <div class="play-list-container">
    <page-nav
      :styleList="singerStyle"
      :activeName="activeName"
      @click="handleChangeView"
    ></page-nav>
    <play-list :playList="data" path="singer-detail"></play-list>
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
