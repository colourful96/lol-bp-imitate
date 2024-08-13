<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLolStore } from '@/store/lolStore'
const lolStore = useLolStore()

const heroes = ref(lolStore.heroes)
console.log(heroes.value)
</script>

<template>
  <div></div>
</template>

<style scoped></style>
