<script setup>
import { toRefs } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
  title: String,
  playList: { type: Array, default: () => [] },
  path: String
})
const { path } = toRefs(props)
const goAblum = (item) => {
  router.push({ path: `/${path.value}/${item.id}` })
}
</script>
<template>
  <div class="play-list">
    <div class="play-title" v-if="title">{{ title }}</div>
    <ul class="play-body">
      <li class="card-frame" v-for="(item, index) in playList" :key="index">
        <div class="card" @click="goAblum(item)">
          <!-- 修改重点：绑定 images[0].url -->
          <el-image
            class="card-img"
            fit="cover"
            :src="item.images?.[0]?.url || require('@/assets/例.jpg')"
            :alt="item.name"
            :preview-src-list="[item.images?.[0]?.url]"
            loading="eager"
          >
            <template #error>
              <div class="image-error">
                <img :src="require('@/assets/例.jpg')" />
              </div>
            </template>
          </el-image>
          <!-- <el-image
            lazy
            :scroll-container="'.play-body'"
            class="card-img"
            fit="contain"
            :src="item.images?.[0]?.url || './assets/例.jpg'"
            :alt="item.name"
          >
            < 图片加载失败时的占位内容  -->
          <!-- <template #error>
              <div class="image-error"></div>
            </template> -->
          <!-- </el-image>  -->
          <div class="mask" @click="goAblum(item)"></div>
        </div>
        <!-- 显示艺术家名称 -->
        <p class="card-name">{{ item.name }}</p>
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
.play-list {
  width: 80%;
  margin: auto;
  border-bottom: 0.0625rem solid #f1efef;

  .play-title {
    height: 60px;
    line-height: 60px;
    font-size: 28px;
    font-weight: 500;
    text-align: center;

    box-sizing: border-box;
  }

  .play-body {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0px 1rem;
    li {
      list-style: none;
    }
    .card-frame {
      width: 20%;
      margin-bottom: 1rem;
      .card {
        position: relative;
        height: 0;
        padding-bottom: 100%;
        border-radius: 5px;
        overflow: hidden;
        margin-right: 2rem;
      }

      &:hover .card-img {
        transform: scale(1.2);
      }
    }
  }
}

.mask {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 5px;
  background-color: rgba(52, 47, 41, 0.4);
  //   @include layout(center, center);
  transition: all 0.3s ease-in-out;
  opacity: 0;

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
}
/* 新增错误状态样式 */
.image-error {
  width: 100%;
  height: 100%;
  background-image: url(../assets/例.jpg);
  background-size: contain;
}

.card-img {
  /* 确保图片容器有固定宽高比 */
  width: 200px;
  height: 200px;
  border-radius: 8px;
  object-fit: cover; /* 保持图片比例 */
}

.card-name {
  margin-top: 8px;
  font-size: 14px;
  color: #333;
}
</style>
