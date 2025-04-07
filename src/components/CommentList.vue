<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElInput, ElButton, ElImage, ElIcon } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { throttle } from 'lodash'
import {
  getPlaylistCommentsService,
  addPlaylistCommentService,
  deletePlaylistCommentService,
  likePlaylistCommentService
} from '@/api/user'
import { useUserStore } from '@/stores'
const props = defineProps({
  playId: String, // 由父组件传递的歌单 ID
  type: Number // 评论类型（可扩展）
})
// 获取当前用户信息
const {
  user: { nickname, id, user_pic }
} = useUserStore()
const commentList = ref([])
const textarea = ref('')

// 获取评论列表
const fetchComments = async () => {
  if (!props.playId) return
  try {
    const { data } = await getPlaylistCommentsService(props.playId)
    commentList.value = data || []
  } catch (error) {
    ElMessage.error('加载评论失败')
    console.error('获取评论失败:', error)
  }
}

// 提交新评论
const submitComment = async () => {
  if (!textarea.value.trim()) {
    ElMessage.warning('评论不能为空')
    return
  }
  try {
    const newComment = {
      content: textarea.value.trim(),
      user_id: id,
      nickname: nickname || '匿名用户',
      user_pic: user_pic || '@/assets/avatar.png',
      playlist_id: props.playId
    }
    console.log('新评论:', newComment)

    await addPlaylistCommentService(newComment)
    textarea.value = '' // 清空输入框
    ElMessage.success('评论成功')
    fetchComments() // 重新获取评论列表
  } catch (error) {
    ElMessage.error('提交评论失败')
    console.error('提交评论失败:', error)
  }
}

// 删除评论（仅限当前用户）
const deleteComment = async (commentId, index) => {
  try {
    await deletePlaylistCommentService(commentId)
    commentList.value.splice(index, 1) // 直接删除 UI 中的评论
    ElMessage.success('评论已删除')
  } catch (error) {
    ElMessage.error('删除评论失败')
    console.error('删除评论失败:', error)
  }
}

// 点赞评论
const likeComment = throttle(async (commentId) => {
  try {
    await likePlaylistCommentService(commentId)
    const comment = commentList.value.find((c) => c.id === commentId)
    if (comment) comment.up += 1
  } catch (error) {
    ElMessage.error('点赞失败', error)
  }
}, 1000)

// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return '未知时间'
  const date = new Date(timestamp)
  return date.toLocaleString()
}

// 格式化头像 URL
const attachImageUrl = (user_pic) => {
  return user_pic || new URL('@/assets/avatar.png', import.meta.url).href
}
// 监听 playId 变化，重新获取评论
watch(
  () => props.playId,
  (newVal) => {
    if (newVal) {
      fetchComments()
    }
  },
  { immediate: true }
)
// 组件加载时获取评论
onMounted(fetchComments)
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
    <li v-for="(comment, index) in commentList" :key="comment.id">
      <el-image
        class="popular-img"
        fit="contain"
        :src="attachImageUrl(comment.user_pic)"
      />
      <div class="popular-msg">
        <ul>
          <li class="name">{{ comment.nickname }}</li>
          <li class="time">{{ formatDate(comment.create_time) }}</li>
          <li class="content">{{ comment.content }}</li>
        </ul>
      </div>

      <div class="comment-ctr">
        <el-button @click="likeComment(comment.id)"
          >👍 {{ comment.up }}</el-button
        >
        <el-icon
          v-if="comment.user_id === id"
          @click="deleteComment(comment.id, index)"
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
  width: 95%;
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
        list-style: none;
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
