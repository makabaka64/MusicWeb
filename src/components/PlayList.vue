<script setup>
import { toRefs } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
  title: String,
  playList: Array,
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
          <el-image class="card-img" fit="contain" :src="item.src" />
          <div class="mask" @click="goAblum(item)"></div>
        </div>
        <p class="card-name">{{ item.name || item.title }}</p>
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

      .card-name {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        margin: 0.5rem 0;
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
</style>
