<script setup lang="ts">
import HeroesSelect from '@/components/HeroesSelect.vue'
import { onMounted } from 'vue'
import { useLolStore } from '@/store/lolStore'

const lolStore = useLolStore()

onMounted(() => {
  lolStore.getHeroes()
})
</script>

<template>
  <div>
    <HeroesSelect></HeroesSelect>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
}
</style>
