<script setup lang="ts">
import { ref, watch, onMounted, nextTick, defineProps, defineEmits } from 'vue'
import { useLolStore } from '@/store/lolStore.ts'
import type { HeroDetail, Heroes } from '@/type'

const store = useLolStore()
const baseImgUrl = 'https://game.gtimg.cn/images/lol/act/img/champion/'

const props = defineProps<{ status: 'ban' | 'pick' | null }>()
const emit = defineEmits<{
  (e: 'onSelect', hero: HeroDetail): void
  (e: 'onSure'): void
}>()

// 直接使用 store.heroes 的值
const heroData = ref(store.heroes)
const inputValue = ref('')
const audioPath = ref('')
const audioRef = ref(null)
const isSelectHero = ref(false)
const currentSelectHeroId = ref<null | string>(null) // 当前点击的英雄ID
const currentSureHeroes = ref<HeroesDetail[]>([])

onMounted(() => {
  store.getHeroes()
})

const selectHero = async (hero: Heroes) => {
  if (unavailable(hero.heroId) || !props.status) return
  if (!isSelectHero.value) {
    isSelectHero.value = true
  }
  currentSelectHeroId.value = hero.heroId
  audioPath.value = new URL(props.status === 'ban' ? hero.banAudio : hero.selectAudio, import.meta.url).href
  nextTick(() => {
    audioRef.value.play()
  })
  try {
    const detail = await store.getHeroDetail(hero.heroId)
    emit('onSelect', detail)
  } catch (e) {
    console.log(e)
  }
}

const unavailable = (id: string) => {
  if(!currentSelectHeroId.value) return;
  if (currentSelectHeroId.value === id) {
    return true
  } else {
    const exist = currentSureHeroes.value.find(h => h.hero.heroId === id)
    return !!exist
  }
}

// 监听 store.heroes 的变化，并更新 heroData
watch(
  () => store.heroes,
  (newVal) => {
    heroData.value = newVal
  },
  { deep: true }
)
watch(inputValue, (val) => {
  if (val) {
    store.searchHero(val)
  } else {
    store.getHeroes()
  }
})
watch(() => store.bpHeroes, (newVal) => {
  let newData = []
  const keys = Object.keys(newVal)
  keys.forEach(key => {
    newData = newData.concat(newVal[key])
  })
  currentSureHeroes.value = newData
}, { deep: true })

// 打印 store.heroes 的初始值
</script>

<template>
  <div class="heroesSelect-container">
    <input type="text" placeholder="搜索" v-model="inputValue">
    <button class="select-btn" v-if="isSelectHero" @click="emit('onSure')">确定</button>
    <audio controls hidden ref="audioRef" :src="audioPath">
    </audio>
    <div class="hero-wrapper">
      <div class="hero-item" :class="{'unavailable': unavailable(hero.heroId)}" v-for="hero in heroData"
           :key="hero.heroId" @click="selectHero(hero)">
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

  input {
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
  height: 80vh;
  overflow: auto;

  .hero-item {
    width: 150px;
    cursor: pointer;
    margin-right: 4px;
    font-size: 20px;

    .hero-item-img{
      text-align: center;
    }

    .hero-item-name {
      text-align: center;
    }
  }

  .unavailable {
    opacity: 0.25;
    cursor: default;
  }

  .hero-item:nth-of-type(10n) {
    margin-right: 0;
  }
}

.select-btn {
  background: #fff;
  color: #000;
  text-transform: uppercase;
  border: 0;
  outline: 0;
  text-align: center;
  line-height: 30px;
  font-family: Merriweather Sans, sans-serif;
  font-weight: 800;
  font-size: 21px;
  padding: 0 20px;
  display: inline-block;
  cursor: pointer;
  margin-left: 30px;
}
</style>
