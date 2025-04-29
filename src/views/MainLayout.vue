<script setup>
import { ref, onMounted, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import avatar from '@/assets/avatar.png'
const userStore = useUserStore()
const router = useRouter()
const keywords = ref('')
onMounted(() => {
  userStore.getUser()
})
const userAvatar = computed(() => {
  return userStore.user?.user_pic || avatar
})
const goSearch = () => {
  if (!keywords.value.trim()) return
  router.push({ path: 'search', query: { q: keywords.value } })
  keywords.value = ''
}
const menuList = [
  { name: '首页', path: '/recommend' },
  { name: '歌手', path: '/artist' },
  { name: '歌单', path: '/album' },
  { name: '我的音乐', path: '/mymusic' },
  { name: '推荐', path: '/recommendview' }
]
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="navbar">
        <div class="navbar-left">
          <h1>Music Web</h1>
        </div>
        <nav class="navbar-center">
          <ul class="menu" :default-active="$route.path" router>
            <li
              v-for="item in menuList"
              :key="item.path"
              :class="{ active: $route.path === item.path }"
              @click="$router.push(item.path)"
            >
              {{ item.name }}
            </li>
          </ul>
        </nav>
        <div class="navbar-right">
          <div class="header-search">
            <el-input
              placeholder="搜索音乐、歌手、歌单"
              :suffix-icon="Search"
              v-model="keywords"
              @keyup.enter="goSearch()"
            />
          </div>

          <div v-if="!userStore.token" class="not-logged-in">
            <el-button
              class="login-btn"
              type="primary"
              @click="$router.push('/login')"
              >登录</el-button
            >
          </div>
          <div v-else class="personal-content">
            <el-avatar :src="userAvatar" />
          </div>
        </div>
      </el-header>
    </el-container>
    <div class="main">
      <router-view></router-view>
      <current-play></current-play>
    </div>
    <el-footer><play-bar></play-bar></el-footer>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  width: 80%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-bottom: 0.0625rem solid #f1efef;
  padding: 10px 20px;
  gap: 20px;

  // PC端默认布局
  &-left {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 0 0 auto;
    h1 {
      font-size: clamp(1.5rem, 2vw, 2rem);
      white-space: nowrap;
    }
  }

  &-center {
    flex: 1;
    .menu {
      display: flex;
      justify-content: center;
      gap: 2vw;
      list-style: none;
      margin: 0;
      padding: 0;

      li {
        font-size: clamp(1rem, 1.2vw, 1.2rem);
        white-space: nowrap;
        cursor: pointer;
        transition: color 0.3s;

        &:hover,
        &.active {
          color: #409eff;
        }
      }
    }
  }

  &-right {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 0 1 auto;
    display: flex;
    align-items: center;
    gap: 15px;
    min-width: 300px;
    justify-content: flex-end;
  }
}

.header-search {
  flex: 1;
  min-width: 180px;
  max-width: 400px;
  transition: all 0.3s;

  .el-input {
    width: 100%;
    font-size: clamp(0.9rem, 1vw, 1rem);
  }
}

@media (max-width: 768px) {
  .navbar {
    width: 100%;
    padding: 10px 15px;
    flex-wrap: wrap;
    display: flex;
    border-bottom: 0rem solid #f1efef;

    &-left {
      order: 1;
      flex: 1 1 auto;
      min-width: 0;
      display: flex;
      align-items: center;
    }

    &-center {
      order: 1; // 与左侧同行
      flex: 1 1 auto;
      min-width: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .menu {
        justify-content: flex-end;
        padding: 5px 0;
        gap: 4vw;

        li {
          font-size: clamp(0.9rem, 4vw, 1rem);
        }
      }
    }

    &-right {
      order: 2; // 独占第二行
      width: 80%;
      justify-content: flex-end;
      gap: 10px;
      display: flex;
      margin-top: -32px;
      padding: 5px;
      border-bottom: 0.0625rem solid #f1efef;
    }
  }

  .header-search {
    flex: 1;
    min-width: 120px;
    max-width: 100%;
  }

  .not-logged-in {
    flex-shrink: 0;
  }
}
</style>
