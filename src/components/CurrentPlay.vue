<script setup>
import { ref } from 'vue'
const showAside = ref(false)
</script>
<template>
  <transition name="aside-fade">
    <div class="yin-current-play" v-if="showAside">
      <h2 class="title">当前播放</h2>
      <div class="control">
        共 {{ (currentPlayList && currentPlayList.length) || 0 }} 首
      </div>
      <ul class="menus">
        <li
          v-for="(item, index) in currentPlayList"
          :class="{ 'is-play': songId === item.id }"
          :key="index"
          @click="
            playMusic({
              id: item.id,
              url: item.url,
              pic: item.pic,
              index: index,
              name: item.name,
              lyric: item.lyric,
              currentSongList: currentPlayList
            })
          "
        >
          {{ getSongTitle(item.name) }}
        </li>
      </ul>
    </div>
  </transition>
</template>
<style lang="scss" scoped></style>
