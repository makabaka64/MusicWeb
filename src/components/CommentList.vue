<script setup>
import { ref } from 'vue'
import { ElInput, ElButton, ElImage, ElIcon } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

// 模拟数据
const commentList = ref([
  {
    id: 1,
    username: '用户A',
    avator: 'https://example.com/avator1.jpg',
    createTime: '2024-12-01 12:30',
    content: '很棒的歌曲，喜欢！',
    up: 10,
    userId: 1
  },
  {
    id: 2,
    username: '用户B',
    avator: 'https://example.com/avator2.jpg',
    createTime: '2024-12-01 14:00',
    content: '这首歌真是太好听了，循环播放！',
    up: 5,
    userId: 2
  }
])

const userId = ref(1) // 假设当前用户的 ID
const textarea = ref('') // 用于存储评论框的内容

// 点赞功能
const setSupport = (id, up, userId) => {
  console.log(`评论ID：${id}，当前点赞数：${up}，用户ID：${userId}`)
  // 处理点赞操作
}

// 删除评论
const deleteComment = (id, index) => {
  console.log(`删除评论ID：${id}`)
  commentList.value.splice(index, 1) // 从评论列表中删除该评论
}

// 提交评论
const submitComment = () => {
  if (textarea.value.trim()) {
    commentList.value.push({
      id: Date.now(), // 使用当前时间戳作为评论ID
      username: '新用户',
      avator: 'https://example.com/new_avator.jpg',
      createTime: new Date().toLocaleString(),
      content: textarea.value.trim(),
      up: 0,
      userId: userId.value
    })
    textarea.value = '' // 清空评论框
  }
}

// 格式化时间
const formatDate = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`
}

// 模拟获取头像的 URL
const attachImageUrl = (avator) => {
  return avator || 'https://example.com/default_avator.jpg' // 如果没有头像，返回默认头像
}
</script>
<template>
  <div class="comment">
    <h2 class="comment-title">
      <span>评论</span>
      <span class="comment-desc">共 {{ commentList.length }} 条评论</span>
    </h2>
    <el-input
      class="comment-input"
      type="textarea"
      placeholder="期待您的精彩评论..."
      :rows="2"
      v-model="textarea"
    />
    <el-button class="sub-btn" type="primary" @click="submitComment()"
      >发表评论</el-button
    >
  </div>
  <ul class="popular">
    <li v-for="(item, index) in commentList" :key="index">
      <el-image
        class="popular-img"
        fit="contain"
        :src="attachImageUrl(item.avator)"
      />
      <div class="popular-msg">
        <ul>
          <li class="name">{{ item.username }}</li>
          <li class="time">{{ formatDate(item.createTime) }}</li>
          <li class="content">{{ item.content }}</li>
        </ul>
      </div>

      <div
        ref="up"
        class="comment-ctr"
        @click="setSupport(item.id, item.up, userId)"
      >
        <el-icon
          v-if="item.userId === userId"
          @click="deleteComment(item.id, index)"
          ><delete
        /></el-icon>
      </div>
    </li>
  </ul>
</template>
<style lang="scss" scoped>
/*评论*/
.comment {
  position: relative;
  margin-bottom: 60px;

  .comment-title {
    height: 50px;
    line-height: 50px;

    .comment-desc {
      font-size: 14px;
      font-weight: 400;
      color: gray;
      margin-left: 10px;
    }
  }

  .comment-input {
    display: flex;
    margin-bottom: 20px;
  }

  .sub-btn {
    position: absolute;
    right: 0;
  }
}

/*热门评论*/
.popular {
  width: 100%;
  > li {
    border-bottom: solid 1px rgba(0, 0, 0, 0.1);
    padding: 15px 0;
    display: flex;
    .popular-img {
      width: 50px;
    }

    .popular-msg {
      padding: 0 20px;
      flex: 1;
      li {
        width: 100%;
      }
      .time {
        font-size: 0.6rem;
        color: rgba(0, 0, 0, 0.5);
      }
      .name {
        color: rgba(0, 0, 0, 0.5);
      }
      .content {
        font-size: 1rem;
      }
    }

    .comment-ctr {
      display: flex;
      align-items: center;
      width: 80px;
      font-size: 1rem;
      cursor: pointer;

      .el-icon {
        margin: 0 10px;
      }

      &:hover,
      :deep(.icon):hover {
        color: grey;
      }
    }
  }
}
.icon {
  size: 1em;
}
</style>
