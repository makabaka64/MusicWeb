<script setup>
import { ref } from 'vue'

const rankings = ref([
  {
    title: '飙升榜',
    date: '07月13日',
    color: '#4a90e2',
    songs: [
      { name: '小丑女', duration: '03:32' },
      { name: '下落不明', duration: '03:27' },
      { name: '彩虹', duration: '04:42' },
      { name: '小丑女', duration: '03:32' },
      { name: '下落不明', duration: '03:27' },
      { name: '彩虹', duration: '04:42' },
      { name: '小丑女', duration: '03:32' },
      { name: '下落不明', duration: '03:27' },
      { name: '彩虹', duration: '04:42' },
      { name: '小丑女', duration: '03:32' },
      { name: '下落不明', duration: '03:27' },
      { name: '彩虹', duration: '04:42' }
    ]
  },
  {
    title: '新歌榜',
    date: '07月13日',
    color: '#50e3c2',
    songs: [
      { name: '要我怎么办', duration: '03:29' },
      { name: '就说', duration: '03:40' },
      { name: '影', duration: '04:10' }
    ]
  },
  {
    title: '热歌榜',
    date: '07月09日',
    color: '#f5a623',
    songs: [
      { name: 'Love is Gone', duration: '04:02' },
      { name: '回到过去', duration: '03:22' },
      { name: '海底', duration: '04:33' },
      { name: 'Love is Gone', duration: '04:02' },
      { name: '回到过去', duration: '03:22' },
      { name: '海底', duration: '04:33' }
    ]
  },
  {
    title: '歌手榜',
    date: '07月10日',
    color: '#b77bf0',
    songs: [
      { name: '不安于现状', duration: '03:07' },
      { name: '烈酒旅店', duration: '03:38' },
      { name: '第五个季节', duration: '03:32' }
    ]
  }
])
</script>
<template>
  <div class="ranking-board">
    <div class="ranking-card" v-for="(item, index) in rankings" :key="index">
      <div class="ranking-header" :style="{ backgroundColor: item.color }">
        <h3>{{ item.title }}</h3>
        <p>{{ item.date }}</p>
        <button class="play-button">▶</button>
      </div>
      <ul class="ranking-list">
        <li v-for="(song, idx) in item.songs" :key="idx">
          <span class="song-rank">{{ idx + 1 }}</span>
          <span class="song-name">{{ song.name }}</span>
          <span class="song-duration">{{ song.duration }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 父容器 */
.ranking-board {
  margin: auto;
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background-color: #ffffff;
}

/* 单个排行榜卡片 */
.ranking-card {
  margin: 2rem 0 0 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  width: 20%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: black;
  overflow: hidden;

  /* 卡片顶部 */
  .ranking-header {
    padding: 15px;
    text-align: center;
    position: relative;

    h3 {
      font-size: 18px;
      margin: 0;
    }

    p {
      font-size: 14px;
      margin: 5px 0 0 0;
    }

    .play-button {
      position: absolute;
      top: 15px;
      right: 15px;
      background-color: rgba(0, 0, 0, 0.4);
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      color: black;
      font-size: 16px;
      cursor: pointer;
    }
  }

  /* 歌曲列表 */
  .ranking-list {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      display: flex;
      justify-content: space-between;
      padding: 10px 15px;

      &:nth-child(-n + 3) .song-rank {
        color: #f44a77;
      }

      &:nth-child(n + 4) .song-rank {
        color: #aaa;
      }
      .song-rank {
        font-size: 14px;

        width: 10%;
      }

      .song-name {
        font-size: 14px;
        flex-grow: 1;
        color: rgba(15, 13, 13, 0.696);
      }

      .song-duration {
        font-size: 12px;
        color: #aaa;
      }
    }

    li:first-child {
      border-top: none;
    }
  }
}
</style>
