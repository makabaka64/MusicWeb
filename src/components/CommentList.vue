<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElButton, ElInput } from 'element-plus'
import { throttle } from 'lodash'
import { useUserStore } from '@/stores'
import CommentItem from '@/components/CommentItem.vue'
import {
  getPlaylistCommentsService,
  addPlaylistCommentService,
  deletePlaylistCommentService,
  likePlaylistCommentService
} from '@/api/user'

const props = defineProps({
  playId: String,
  type: Number
})

const { user } = useUserStore()
const commentList = ref([])
const commentText = ref('')
const currentReply = ref({
  parentId: null,
  targetUser: null
})

// 获取并构建评论树
const fetchComments = async () => {
  try {
    const { data } = await getPlaylistCommentsService(props.playId)
    commentList.value = buildCommentTree(data)
    // const comments = await getPlaylistCommentsService(props.playId)
    // commentList.value = buildCommentTree(comments)
  } catch (error) {
    ElMessage.error('评论加载失败')
    console.error('Error fetching comments:', error)
  }
}

// 转换平铺数据为树形结构
const buildCommentTree = (comments) => {
  const map = new Map()
  const roots = []

  // 创建映射并初始化children
  comments.forEach((comment) => {
    map.set(comment.id, { ...comment, children: [] })
  })

  // 构建树结构
  comments.forEach((comment) => {
    const node = map.get(comment.id)
    if (comment.parent_id && map.has(comment.parent_id)) {
      const parent = map.get(comment.parent_id)
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  })

  // 递归排序（按时间倒序）
  const sortComments = (nodes) => {
    return nodes
      .sort((a, b) => new Date(b.create_time) - new Date(a.create_time))
      .map((node) => ({
        ...node,
        children: sortComments(node.children)
      }))
  }

  return sortComments(roots)
}

// 提交评论/回复
const submitComment = async () => {
  if (!commentText.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  try {
    await addPlaylistCommentService({
      content: commentText.value.trim(),
      playlist_id: props.playId,
      parent_id: currentReply.value.parentId,
      user_id: user.id,
      nickname: user.nickname,
      user_pic: user.user_pic
    })

    ElMessage.success(currentReply.value.parentId ? '回复成功' : '评论成功')
    commentText.value = ''
    currentReply.value = { parentId: null, targetUser: null }
    await fetchComments()
  } catch (error) {
    ElMessage.error(error.response?.data?.error || '提交失败')
    console.error('Submit error:', error)
  }
}

// 处理回复
const handleReply = (comment) => {
  currentReply.value = {
    parentId: comment.id,
    targetUser: comment.nickname
  }
}

// 取消回复
const cancelReply = () => {
  currentReply.value = { parentId: null, targetUser: null }
}

// 删除评论
const handleDelete = async (commentId) => {
  try {
    await deletePlaylistCommentService(commentId)
    ElMessage.success('删除成功')
    await fetchComments()
  } catch (error) {
    ElMessage.error('删除失败')
    console.error('Delete error:', error)
  }
}

// 点赞评论（节流处理）
const handleLike = throttle(async (commentId) => {
  try {
    await likePlaylistCommentService(commentId)
    const updateLikes = (comments) =>
      comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, up: comment.up + 1 }
        }
        if (comment.children?.length) {
          return { ...comment, children: updateLikes(comment.children) }
        }
        return comment
      })
    commentList.value = updateLikes(commentList.value)
  } catch (error) {
    ElMessage.error('点赞失败')
    console.error('Like error:', error)
  }
}, 1000)

// 初始化加载
onMounted(fetchComments)
watch(() => props.playId, fetchComments)
</script>

<template>
  <div class="comment-container">
    <div class="header">
      <h3>评论（{{ commentList.length }}）</h3>

      <div class="reply-notice" v-if="currentReply.targetUser">
        正在回复 @{{ currentReply.targetUser }}
        <ElButton link @click="cancelReply">取消回复</ElButton>
      </div>

      <div class="input-area">
        <ElInput
          v-model="commentText"
          type="textarea"
          :rows="3"
          :placeholder="
            currentReply.targetUser
              ? `回复 @${currentReply.targetUser}...`
              : '发表你的精彩评论...'
          "
        />
        <div class="actions">
          <ElButton type="primary" size="small" @click="submitComment">
            {{ currentReply.targetUser ? '发送回复' : '发表评论' }}
          </ElButton>
        </div>
      </div>
    </div>

    <div class="comment-list">
      <template v-if="commentList.length > 0">
        <CommentItem
          v-for="comment in commentList"
          :key="comment.id"
          :comment="comment"
          :current-user-id="user.id"
          :depth="0"
          @reply="handleReply"
          @delete="handleDelete"
          @like="handleLike"
        />
      </template>
      <div v-else class="empty">
        <el-empty description="暂无评论，快来抢沙发吧~" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  .header {
    margin-bottom: 24px;

    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #333;
    }

    .reply-notice {
      padding: 8px 12px;
      margin-bottom: 12px;
      background: #f5f7fa;
      border-radius: 4px;
      font-size: 14px;
      color: #666;
    }
  }

  .input-area {
    margin-bottom: 24px;

    .actions {
      margin-top: 12px;
      text-align: right;
    }
  }

  .empty {
    padding: 40px 0;
    color: #909399;
  }
}
</style>
