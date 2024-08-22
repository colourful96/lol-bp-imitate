<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLolStore } from '@/store/lolStore'

const store = useLolStore()
const tabs = [
  // { id: '1', name: '全部' },
  // { id: '2', name: '上单' },
  // { id: '3', name: '打野' },
  // { id: '4', name: '中单' },
  // { id: '5', name: '射手' },
  // { id: '6', name: '辅助' }
]
const baseImgUrl = 'https://game.gtimg.cn/images/lol/act/img/champion/'

// 直接使用 store.heroes 的值
const heroData = ref(store.heroes)
const currentTab = ref('1')

// 监听 store.heroes 的变化，并更新 heroData
watch(
  () => store.heroes,
  (newVal) => {
    heroData.value = newVal
  },
  { deep: true }
)

// 打印 store.heroes 的初始值
</script>

<template>
  <div class="heroesSelect-container">
<!--    <div class="tabs">-->
<!--      <div-->
<!--        :class="{ 'tab-item': true, 'tab-active': currentTab === tab.id }"-->
<!--        v-for="tab in tabs"-->
<!--        :key="tab.id"-->
<!--        @click="currentTab = tab.id"-->
<!--      >-->
<!--        {{ tab.name }}-->
<!--      </div>-->
<!--    </div>-->
    <div class="hero-wrapper">
      <div class="hero-item" v-for="hero in heroData" :key="hero.heroId">
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
  width: 1240px;
  border: 1px solid;
  margin: 60px auto;
  min-width: 1240px;
}

.tabs {
  display: flex;

  .tab-item {
    width: 69px;
    height: 32px;
    border: 1px solid;
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
    .hero-item-name {
      text-align: center;
    }
  }
}
</style>
