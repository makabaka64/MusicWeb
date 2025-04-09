<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
import avatar from '@/assets/avatar.png'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { userGetFavoriteListService, userGetInfoService } from '@/api/user'

const userStore = useUserStore()
const router = useRouter()
const loading = ref(true)
// 判断登录状态：当 token 存在则认为用户已登录
const isLoggedIn = computed(() => !!userStore.token)

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const res = await userGetInfoService(user_id.value)
    if (res.data.status === 0) {
      userStore.setUser(res.data.data)
    } else {
      ElMessage.error('获取用户信息失败')
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败：' + error.message)
  }
}

const userInfo = computed(() => userStore.user || {})
const personalInfo = computed(() => ({
  nickname: userInfo.value.nickname ?? '未命名用户',
  email: userInfo.value.email ?? '未绑定邮箱',
  user_pic: userInfo.value.user_pic ?? avatar
}))
// 当前用户 id
// const user_id = ref(id)
const user_id = computed(() => userInfo.value.id || null)
// 用来保存用户收藏的歌曲 id 列表
const collectSongList = ref([])
onMounted(async () => {
  // 未登录时不进行数据初始化
  if (!isLoggedIn.value) {
    loading.value = false
    return
  }

  try {
    await fetchUserInfo()
    if (user_id.value) {
      await fetchUserFavorites()
    }
  } catch (error) {
    ElMessage.error('初始化失败: ' + error.message)
  } finally {
    loading.value = false
  }
})
// 获取用户收藏列表
const fetchUserFavorites = async () => {
  try {
    const res = await userGetFavoriteListService(user_id.value)
    if (res.data.status === 0) {
      collectSongList.value = res.data.data.map((item) => ({
        id: item.song_id,
        songName: item.songName,
        singerName: item.singerName,
        introduction: item.introduction
      }))
    }
  } catch (error) {
    ElMessage.error('获取收藏列表失败：' + error.message)
  }
}
const goPage = () => {
  router.push('/setting')
}
// 跳转到登录页面
const goLogin = () => {
  router.push('/login')
}
const logout = () => {
  userStore.removeToken()
  ElMessage.success('退出登录成功')
  router.push('/login')
}
</script>
<template>
  <div v-if="loading" class="loading-text">加载用户信息中...</div>
  <div v-else class="personal">
    <!-- 未登录时显示提示信息 -->
    <div v-if="!userStore.token" class="not-logged-in">
      <p>请先登录或注册</p>
      <el-button type="primary" @click="goLogin">点击登录</el-button>
    </div>
    <!-- 已登录时显示完整的个人信息 -->
    <div v-else class="personal-content">
      <div class="personal-info">
        <div class="personal-img">
          <el-image fit="contain" :src="personalInfo.user_pic || avatar" />
        </div>
        <div class="personal-msg">
          <div class="username">{{ personalInfo.nickname || '暂无昵称' }}</div>
          <div class="introduction">{{ personalInfo.email }}</div>
        </div>
        <el-button class="edit-info" round :icon="Edit" @click="goPage()"
          >修改个人信息</el-button
        >
        <el-button class="logout" @click="logout" type="danger"
          >退出登录</el-button
        >
      </div>
      <div class="personal-body">
        <song-list :songList="collectSongList" :show="true"></song-list>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.personal {
  width: 80%;
  margin: auto;
  padding-top: 220px;
  .not-logged-in {
    text-align: center;
    p {
      font-size: 20px;
      margin-bottom: 20px;
    }
  }
}

.personal-info {
  position: relative;
  margin-bottom: 60px;
  .logout {
    position: absolute;
    right: 11vw;
    margin-top: -90px;
  }
  .personal-img {
    height: 200px;
    width: 200px;
    border-radius: 50%;
    border: 5px solid #ffffff;
    position: absolute;
    top: -220px;
    left: 80px;
    cursor: pointer;
  }
  .personal-msg {
    margin-left: 300px;
    position: absolute;
    top: -180px;

    .username {
      font-size: 50px;
      font-weight: 600;
    }

    .introduction {
      font-size: 20px;
      font-weight: 500;
      // top: -140px;
    }
  }
  .edit-info {
    position: absolute;
    right: 10vw;
    margin-top: -150px;
  }
}

// @media screen and (min-width: 768px) {
//   .personal-body {
//     padding: 0px 150px;
//   }
// }

// @media screen and (max-width: 1024px) {
//   .edit-info {
//     display: none;
//   }
// }
</style>
