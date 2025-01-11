<script setup>
defineProps({
  styleList: Array,
  activeName: String
})
</script>
<template>
  <ul class="nav">
    <li
      v-for="(item, index) in styleList"
      :key="index"
      :class="{ active: item.name == activeName }"
      @click="handleChangeView(item)"
    >
      {{ item.name }}
    </li>
  </ul>
</template>
<style lang="scss" scoped>
.nav {
  margin: auto;
  height: 5rem;
  display: flex;
  //   flex-wrap: wrap;
  //   justify-content: space-between;
  width: 80%;
  li {
    line-height: 7rem;
    list-style: none;
    color: grey;
    border-bottom: none;
    cursor: pointer;
    margin: 0 2.1875rem;
    text-decoration: none;
    font-size: 1.25rem;
    // white-space: nowrap;
    transition: color 0.3s;
    &:hover {
      color: #409eff;
    }
    &.active {
      color: #409eff;
    }
  }
  li.active {
    color: black;
    font-weight: 600;
  }
}
</style>
