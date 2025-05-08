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
          <el-image
            class="card-img"
            fit="cover"
            :src="item.images?.[0]?.url || require('@/assets/例.jpg')"
            :alt="item.name"
            :preview-src-list="[item.images?.[0]?.url]"
            loading="lazy"
            :lazy="true"
          >
            <template #error>
              <div class="image-error">
                <img :src="require('@/assets/例.jpg')" />
              </div>
            </template>
          </el-image>
          <div class="mask" @click="goAblum(item)"></div>
        </div>
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
    font-size: 2rem;
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
        display: flex;
        justify-content: center;
        padding: 2rem;
        align-items: center;
        aspect-ratio: 1/1; // 设置宽高比为1:1,即正方形
        width: 70%;
        border-radius: 10px;
        overflow: hidden;
        margin-right: 2rem;

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 10px;
          &:hover {
            transform: scale(1.2);
          }
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
    background-size: contain;
  }

  .card-name {
    margin-top: 8px;
    text-align: center;
    font-size: 1rem;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
@media (max-width: 480px) {
  .play-list {
    width: 100%;
  }
  .card-name {
    font-size: 0.6rem;
  }
}
@media (min-width: 481px) and (max-width: 768px) {
  .play-body {
    grid-template-columns: repeat(auto-fit, minmax(min(120px, 100%), 1fr));
  }
  .play-title {
    font-size: 1.75rem;
  }
}
</style>
