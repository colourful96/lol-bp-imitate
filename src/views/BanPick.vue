<script setup lang="ts">
import { onBeforeUnmount } from 'vue'

onBeforeUnmount(() => {
  localStorage.removeItem('bpData')
})
</script>

<template>
  <div>
    banpick
  </div>
</template>

<style scoped lang="less">

</style>
