<script setup>
import { computed } from 'vue'
import { ElImage, ElButton, ElIcon } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

const props = defineProps({
  comment: Object,
  depth: {
    type: Number,
    default: 0
  },
  currentUserId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['reply', 'delete', 'like'])

// 样式计算
const indentStyle = computed(() => ({
  marginLeft: `${props.depth * 40}px`,
  position: 'relative'
}))

// 头像URL处理
const avatarUrl = computed(
  () =>
    props.comment.user_pic ||
    new URL('@/assets/avatar.png', import.meta.url).href
)

// 格式化时间
const formatTime = (timeStr) => {
  return new Date(timeStr).toLocaleString()
}

// 处理回复点击
const handleReply = () => {
  if (props.depth < 2) {
    // 最多允许3级评论
    emit('reply', props.comment)
  }
}
</script>

<template>
  <div class="comment-item" :style="indentStyle">
    <div class="connector-line" v-if="depth > 0"></div>

    <ElImage class="avatar" :src="avatarUrl" fit="cover" />

    <div class="content">
      <div class="header">
        <span class="username">{{ comment.nickname }}</span>
        <span class="time">{{ formatTime(comment.create_time) }}</span>
      </div>

      <div class="text">{{ comment.content }}</div>

      <div class="footer">
        <ElButton size="small" :disabled="depth >= 2" @click="handleReply">
          回复
        </ElButton>

        <ElButton
          size="small"
          class="like-btn"
          @click="emit('like', comment.id)"
        >
          👍 {{ comment.up || 0 }}
        </ElButton>

        <ElIcon
          v-if="comment.user_id === currentUserId"
          class="delete-btn"
          @click="emit('delete', comment.id)"
        >
          <Delete />
        </ElIcon>
      </div>

      <div class="children" v-if="comment.children?.length">
        <CommentItem
          v-for="child in comment.children"
          :key="child.id"
          :comment="child"
          :depth="depth + 1"
          :current-user-id="currentUserId"
          @reply="emit('reply', $event)"
          @delete="emit('delete', $event)"
          @like="emit('like', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-item {
  position: relative;
  display: flex;
  margin: 16px 0;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    transform: translateX(4px);
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.08);
  }

  .connector-line {
    position: absolute;
    left: -20px;
    top: 24px;
    width: 20px;
    height: 1px;
    background: #ddd;
  }

  .avatar {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 16px;
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .content {
    flex-grow: 1;

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      .username {
        font-weight: 600;
        color: #333;
        margin-right: 12px;
      }

      .time {
        font-size: 12px;
        color: #999;
      }
    }

    .text {
      line-height: 1.6;
      color: #444;
      margin-bottom: 12px;
    }

    .footer {
      display: flex;
      align-items: center;
      gap: 8px;

      .like-btn {
        padding: 4px 8px;
        &:hover {
          color: #409eff;
        }
      }

      .delete-btn {
        margin-left: auto;
        color: #ff4d4f;
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
          color: #ff7875;
        }
      }
    }

    .children {
      margin-top: 16px;
      padding-left: 16px;
      border-left: 2px solid #eee;
    }
  }
}
@media screen and (max-width: 768px) {
  .comment-item .content .children {
    /* margin-top: 8px; */
    padding-left: 0px;
    margin-left: -110px;
    border-left: 1px solid #eee;
  }
}
</style>
