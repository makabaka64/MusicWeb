<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
// import { useRouter, useRoute } from 'vue-router'
// const router = useRouter()
// const route = useRoute()

const keywords = ref('')
const goSearch = () => {
  console.log(keywords.value)
}
const menuList = [
  { name: '首页', path: '/recommend' },
  { name: '歌手', path: '/artist' },
  { name: '歌单', path: '/album' },
  { name: '排行榜', path: '/toplist' },
  { name: '我的音乐', path: '/mymusic' }
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
          <el-button
            class="login-btn"
            type="primary"
            @click="$router.push('/login')"
            >登录</el-button
          >
        </div>
      </el-header>
    </el-container>
    <div class="main">
      <router-view></router-view>
      <current-play></current-play>
      <play-bar></play-bar>
    </div>
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
  color: #000000;

  h1 {
    font-size: 1.5625rem;
  }
}

.navbar-center .menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar-center .menu li {
  margin: 0 2.1875rem;
  text-decoration: none;
  font-size: 1.25rem;
  white-space: nowrap;
  transition: color 0.3s;
  &:hover {
    color: #409eff;
  }
  &.active {
    color: #409eff;
  }
}

/* 搜索框样式 */
.navbar-right {
  display: flex;
  align-items: center;
  // flex-wrap: nowrap;
  .header-search {
    margin: 0 20px;
    width: 100%;
    & input {
      text-indent: 5px;
      box-shadow: none;
      color: black;
    }
    .search-bar {
      margin-right: 1.25rem;
      min-width: 11.25rem;
    }

    input:focus {
      border: 0.0625rem solid #409eff;
      box-shadow: 0 0 0.3125rem rgba(64, 158, 255, 0.5);
    }

    .login-btn {
      font-size: 0.8125rem;
      padding: 0.3125rem 0.9375rem;
      // white-space: nowrap;
    }

    .search-icon {
      font-size: 0.9375rem;
      right: 2.6875rem;
    }
  }
  @media screen and (max-width: 1024px) {
    .navbar {
      width: 100%;
      padding: 0 10px;
    }
  }
}
</style>
