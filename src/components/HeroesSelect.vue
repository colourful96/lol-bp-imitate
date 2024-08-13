<script setup lang="ts">
import { defineProps, ref } from 'vue';
const props = defineProps<{
  heroData?: never[]
}>()
const heroData = ref(props.heroData);
console.log(heroData, 'heroData');
</script>

<template>
  <ul>
    <li v-for="item in heroData" :key="item.heroId">{{item.name}}</li>
  </ul>
</template>

<style scoped></style>
