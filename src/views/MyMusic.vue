<script setup>
import { ref } from 'vue'
import { Edit } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import avatar from '@/assets/avatar.png'
const userStore = useUserStore()
import router from '@/router'
const personalInfo = ref({
  username: '张三',
  introduction: '大家好，我是张三，很高兴在这里和大家交流。'
})
const goPage = () => {
  router.push('/setting')
}
const collectSongList = ref([
  { id: 1, name: 'Song 1', artist: 'Artist 1' },
  { id: 2, name: 'Song 2', artist: 'Artist 2' }
])
const changeData = (newData) => {
  // 更新 collectSongList 数据
  collectSongList.value = newData
}
</script>
<template>
  <div class="personal">
    <div class="personal-info">
      <div class="personal-img">
        <el-image fit="contain" :src="userStore.user.user_pic || avatar" />
      </div>
      <div class="personal-msg">
        <div class="username">{{ personalInfo.username }}</div>
        <div class="introduction">{{ personalInfo.introduction }}</div>
      </div>
      <el-button class="edit-info" round :icon="Edit" @click="goPage()"
        >修改个人信息</el-button
      >
    </div>
    <div class="personal-body">
      <song-list
        :songList="collectSongList"
        :show="true"
        @changeData="changeData"
      ></song-list>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.personal {
  width: 80%;
  margin: auto;
  padding-top: 220px;
}

.personal-info {
  position: relative;
  margin-bottom: 60px;
  .personal-img {
    height: 200px;
    width: 200px;
    border-radius: 50%;
    border: 5px solid #ffffff;
    position: absolute;
    top: -180px;
    left: 50px;
    cursor: pointer;
  }
  .personal-msg {
    margin-left: 300px;
    position: absolute;
    top: -120px;

    .username {
      font-size: 50px;
      font-weight: 600;
    }

    .introduction {
      font-size: 20px;
      font-weight: 500;
    }
  }
  .edit-info {
    position: absolute;
    right: 10vw;
    margin-top: -120px;
  }
}

@media screen and (min-width: 768px) {
  .personal-body {
    padding: 0px 150px;
  }
}

@media screen and (max-width: 1024px) {
  .edit-info {
    display: none;
  }
}
</style>
