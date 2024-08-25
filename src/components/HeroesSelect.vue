<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useLolStore } from '@/store/lolStore'
import type { Heroes } from '@/type'

const store = useLolStore()
const baseImgUrl = 'https://game.gtimg.cn/images/lol/act/img/champion/'

// 直接使用 store.heroes 的值
const heroData = ref(store.heroes)
const inputValue = ref('');
const audioPath = ref('');
const audioRef = ref(null);

onMounted(() => {
  store.getHeroes();
})

const selectHero = (hero:Heroes) => {
  console.log(hero, 'hero')
  audioPath.value = new URL(hero.selectAudio, import.meta.url).href
  console.log(audioRef.value)
  nextTick(() => {
    audioRef.value.play();
  })
}

// 监听 store.heroes 的变化，并更新 heroData
watch(
  () => store.heroes,
  (newVal) => {
    heroData.value = newVal
  },
  { deep: true }
)
watch(inputValue,(val) => {
  if(val){
    store.searchHero(val);
  }else{
   store.getHeroes();
  }
})

// 打印 store.heroes 的初始值
</script>

<template>
  <div class="heroesSelect-container">
    <input type="text" placeholder="搜索" v-model="inputValue">
    <audio controls hidden ref="audioRef" :src="audioPath">
    </audio>
    <div class="hero-wrapper">
      <div class="hero-item" v-for="hero in heroData" :key="hero.heroId" @click="selectHero(hero)">
        <div class="hero-item-img">
          <img :src="baseImgUrl + hero.alias + '.png'" alt="" />
        </div>
        <div class="hero-item-name">{{ hero.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.heroesSelect-container {
  background: #000;
  width: 1240px;
  margin: 60px auto;
  min-width: 1240px;
  input{
    background: url(http://prodraft.leagueoflegends.com/static/media/search.00ca0d17.svg) no-repeat 10px #16171b;
    background-size: 20px;
    border: 0;
    outline: 0;
    line-height: 30px;
    height: 30px;
    width: 264px;
    padding: 0 40px;
    font-weight: 800;
    font-size: 16px;
    color: #fff;
    margin: 20px 0 20px 369px;
  }
}

.tabs {
  display: flex;

  .tab-item {
    width: 69px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    cursor: pointer;
    margin-right: 6px;
  }

  .tab-active {
    background-color: #f40;
  }
}
.hero-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 80vh;
  overflow: auto;
  .hero-item {
    cursor: pointer;
    margin-right: 4px;
    .hero-item-name {
      text-align: center;
    }
  }
  .hero-item:nth-of-type(10n){
    margin-right: 0;
  }
}
</style>
