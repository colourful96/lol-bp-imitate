<script setup lang="ts">
import { ref, nextTick, watch, onBeforeMount } from 'vue'
import { onBeforeUnmount, onMounted } from 'vue'
import HeroesSelect from '@/components/HeroesSelect.vue'
import type { HeroDataType, HeroDetail } from '@/type'
import { useLolStore } from '@/store/lolStore'
import {useRouter} from 'vue-router'

const store = useLolStore()
const router = useRouter()
const audioRef = ref<any>(null)
const audioPath = ref('')
const heroesVisible = ref(false) // 是否开始选择英雄
const blueBanIndex = ref(-1) // 当前蓝色方ban到第几个英雄
const redBanIndex = ref(-1) // 当前红色方ban到第几个英雄
const selectStatus = ref<'ban' | 'pick' | null>('ban') // 当前是ban还是pick
const blueBanHeroes = ref<(HeroDetail | null) []>([]) // 蓝色方ban掉的英雄
const redBanHeroes = ref<(HeroDetail | null) []>([]) // 红色方ban掉的英雄
const bluePickIndex = ref(-1) // 蓝色方pick到第几个英雄
const redPickIndex = ref(-1) // 红色方pick到第几个英雄
const bluePickHeroes = ref<(HeroDetail | null) []>([]) // 蓝色方pick的英雄
const redPickHeroes = ref<(HeroDetail | null) []>([]) // 红色方pick的英雄
const countdown = ref(30)
const bpData = ref<{blueName:string, matchName:string,redName:string} | null>(null)
let timer: any = null

onBeforeMount(() => {
  const _bpData = localStorage.getItem('bpData')
  if (_bpData) {
    bpData.value = JSON.parse(_bpData)
  }
  store.getHeroes()
})

onBeforeUnmount(() => {
  localStorage.removeItem('bpData')
  clearInterval(timer)
})
const pageRefresh = (e:any) => {
  const confirmationMessage = '您确定要离开此页面吗？';

  e.returnValue = confirmationMessage;     // 标准方式
  localStorage.removeItem('bpData')
  clearInterval(timer)
  router.replace('/')
  return confirmationMessage;
}
onMounted(() => {
  window.addEventListener('beforeunload', pageRefresh)
})

// 倒计时结束的操作
const countdownComplete = async () => {
  if (selectStatus.value === 'ban') {
    const isBlue = blueBanIndex.value > -1
    if (isBlue) {
      const blueBanHeroes = store.bpHeroes.blueBanHeroes
      const isSelected = blueBanHeroes[blueBanIndex.value]
      if (!isSelected) {
        handleSelectHero(null)
      }
    } else {
      const redBanHeroes = store.bpHeroes.redBanHeroes
      const isSelected = redBanHeroes[redBanIndex.value]
      if (!isSelected) {
        handleSelectHero(null)
      }
    }
  } else {
    const isBlue = bluePickIndex.value > -1
    if (isBlue) {
      const bluePickHeroes = store.bpHeroes.bluePickHeroes
      const isSelected = bluePickHeroes[bluePickIndex.value]
      if (!isSelected) {
        const hero = await store.findNotSelectedHero()
        handleSelectHero(hero)
      }
    } else {
      const redPickHeroes = store.bpHeroes.redPickHeroes
      const isSelected = redPickHeroes[redPickIndex.value]
      if (!isSelected) {
        const hero = await store.findNotSelectedHero()
        handleSelectHero(hero)
      }
    }
  }
  handleSure()
}

// 开始倒计时
const startCountdown = () => {
  clearInterval(timer)
  countdown.value = 30
  return new Promise(resolve => {
    timer = setInterval(() => {
      if (countdown.value <= 0) {
        clearInterval(timer)
        countdownComplete()
        resolve(true)
      } else {
        const _countdown = countdown.value - 1
        countdown.value = _countdown < 10 ? +`0${_countdown}` : _countdown
      }
    }, 1000)
  })
}

// 开始选择英雄
const startSelectHero = () => {
  heroesVisible.value = true
  blueBanIndex.value = 0
  startCountdown()
  audioPath.value = new URL('@/assets/audio/start.m4a', import.meta.url).href
  nextTick(() => {
    audioRef.value.play()
  })
}

// 更新英雄数据到仓库
const updateHeroToStore = (hero: HeroDetail | null) => {
  const status = selectStatus.value
  let type: HeroDataType, index
  if (status === 'ban') {
    const isBlue = blueBanIndex.value > -1
    type = isBlue ? 'blueBanHeroes' : 'redBanHeroes'
    index = isBlue ? blueBanIndex.value : redBanIndex.value
  } else {
    const isBlue = bluePickIndex.value > -1
    type = isBlue ? 'bluePickHeroes' : 'redPickHeroes'
    index = isBlue ? bluePickIndex.value : redPickIndex.value
  }
  if (type) {
    store.updateBpHero({
      type,
      hero,
      index
    })
  }
}

// 选择了英雄
const handleSelectHero = (hero: HeroDetail | null) => {
  updateHeroToStore(hero)
}
// 确定选择的英雄
const handleSure = () => {
  if (selectStatus.value === 'pick') {
    // pick
    const isBlue = bluePickIndex.value > -1
    if (isBlue) {
      // 蓝色方
      if (bluePickIndex.value === 0) {
        redPickIndex.value = redPickHeroes.value.length
        bluePickIndex.value = -1
        startCountdown()
        return
      }
      // 红色方二选完之后，蓝色方开始2,3位置的选择
      if (bluePickIndex.value === 1) {
        bluePickIndex.value = bluePickIndex.value + 1
        startCountdown()
        return
      }
      // 蓝色方2，3位置选择完成后，红色方开始3位置的选择
      if (bluePickIndex.value === 2) {
        redPickIndex.value = redPickHeroes.value.length
        bluePickIndex.value = -1
        startCountdown()
        return
      }
      if (bluePickIndex.value === 3) {
        bluePickIndex.value = bluePickIndex.value + 1
        startCountdown()
        return
      }
      // 蓝色方5位置选择完成后，红色方5位置开始选择
      if (bluePickIndex.value === 4) {
        redPickIndex.value = redPickHeroes.value.length
        bluePickIndex.value = -1
        startCountdown()
      }
    } else {
      // 红色方
      // 蓝色方一选完之后，红色方开始1，2位置的选择
      if (redPickIndex.value === 0) {
        redPickIndex.value = redPickIndex.value + 1
        bluePickIndex.value = -1
        startCountdown()
        return
      }
      // 红色方二选完之后，蓝色方开始2，3位置的选择
      if (redPickIndex.value === 1) {
        bluePickIndex.value = bluePickHeroes.value.length
        redPickIndex.value = -1
        startCountdown()
        return
      }
      // 红色方3位置选择之后，红色方4位置开始禁用
      if (redPickIndex.value === 2) {
        redBanIndex.value = redBanHeroes.value.length
        redPickIndex.value = -1
        selectStatus.value = 'ban'
        startCountdown()
        return
      }
      // 红色方4位置选择之后，蓝色方4，5位置选择
      if (redPickIndex.value === 3) {
        bluePickIndex.value = bluePickHeroes.value.length
        redPickIndex.value = -1
        startCountdown()
        return
      }
      if (redPickIndex.value === 4) {
        redPickIndex.value = -1
        selectStatus.value = null
      }
    }
  } else {
    // ban
    // 是蓝色方还是红色方点击确定
    const isBlue = blueBanIndex.value > -1
    if (isBlue) {
      // 蓝色方禁用完最后一个英雄后，红色方4位置选择
      if (blueBanIndex.value === 4) {
        redPickIndex.value = redPickHeroes.value.length
        selectStatus.value = 'pick'
        blueBanIndex.value = -1
        redBanIndex.value = -1
        startCountdown()
        return
      }
      redBanIndex.value = redBanHeroes.value.length
      blueBanIndex.value = -1
    } else {
      blueBanIndex.value = blueBanHeroes.value.length
      // 红蓝双方3ban之后蓝色方开始选择英雄
      if (redBanIndex.value === 2) {
        redBanIndex.value = -1
        blueBanIndex.value = -1
        bluePickIndex.value = 0
        selectStatus.value = 'pick'
      }
      redBanIndex.value = -1
    }
    startCountdown()
  }
}
const getCountdownVisible = (type: 'blue' | 'red') => {
  if (type === 'blue') {
    if (bluePickIndex.value > -1 || blueBanIndex.value > -1) return true
  } else {
    if (redPickIndex.value > -1 || redBanIndex.value > -1) return true
  }
  return false
}

watch(() => store.bpHeroes.blueBanHeroes, (newVal) => {
  blueBanHeroes.value = newVal
}, { deep: true })
watch(() => store.bpHeroes.redBanHeroes, (newVal) => {
  redBanHeroes.value = newVal
}, { deep: true })
watch(() => store.bpHeroes.bluePickHeroes, (newVal) => {
  bluePickHeroes.value = newVal
}, { deep: true })
watch(() => store.bpHeroes.redPickHeroes, (newVal) => {
  redPickHeroes.value = newVal
}, { deep: true })
</script>

<template>
  <div class="ban-pick-container">
    <div class="bp-container">
      <div class="blue-team">
        <div class="blue-header">
          {{ bpData!.blueName || '蓝色' }}
          <span v-show="getCountdownVisible('blue')" class="blue-countdown">:{{ countdown }}</span>
        </div>
        <div class="blue-pick">
          <div class="blue-pick-box">
            <div class="pick-image" :class="{'blue-pick-image-select':bluePickIndex === 0}"></div>
            <template v-if="bluePickHeroes[0]">
              <img class="select-image" :src="bluePickHeroes[0].skins[0].loadingImg" alt="">
              <div class="pick-name">{{ bluePickHeroes[0].hero.name }}</div>
            </template>
          </div>
          <div class="blue-pick-box">
            <div class="pick-image" :class="{'blue-pick-image-select':bluePickIndex === 1}"></div>
            <template v-if="bluePickHeroes[1]">
              <img class="select-image" :src="bluePickHeroes[1].skins[0].loadingImg" alt="">
              <div class="pick-name">{{ bluePickHeroes[1].hero.name }}</div>
            </template>
          </div>
          <div class="blue-pick-box">
            <div class="pick-image" :class="{'blue-pick-image-select':bluePickIndex === 2}"></div>
            <template v-if="bluePickHeroes[2]">
              <img class="select-image" :src="bluePickHeroes[2].skins[0].loadingImg" alt="">
              <div class="pick-name">{{ bluePickHeroes[2].hero.name }}</div>
            </template>
          </div>
          <div class="blue-pick-box">
            <div class="pick-image" :class="{'blue-pick-image-select':bluePickIndex === 3}"></div>
            <template v-if="bluePickHeroes[3]">
              <img class="select-image" :src="bluePickHeroes[3].skins[0].loadingImg" alt="">
              <div class="pick-name">{{ bluePickHeroes[3].hero.name }}</div>
            </template>
          </div>
          <div class="blue-pick-box">
            <div class="pick-image" :class="{'blue-pick-image-select':bluePickIndex === 4}"></div>
            <template v-if="bluePickHeroes[4]">
              <img class="select-image" :src="bluePickHeroes[4].skins[0].loadingImg" alt="">
              <div class="pick-name">{{ bluePickHeroes[4].hero.name }}</div>
            </template>
          </div>
        </div>
        <div class="blue-ban">
          <div class="blue-ban-box">
            <div class="ban-image" :class="{'blue-ban-image-select':blueBanIndex === 0}"></div>
            <img class="select-image" v-if="blueBanHeroes[0]" :src="blueBanHeroes[0].skins[0].loadingImg" alt="">
            <div class="ban-name" v-if="blueBanHeroes[0] === null">空</div>
          </div>
          <div class="blue-ban-box">
            <div class="ban-image" :class="{'blue-ban-image-select':blueBanIndex === 1}"></div>
            <img class="select-image" v-if="blueBanHeroes[1]" :src="blueBanHeroes[1].skins[0].loadingImg" alt="">
            <div class="ban-name" v-if="blueBanHeroes[1] === null">空</div>
          </div>
          <div class="blue-ban-box">
            <div class="ban-image" :class="{'blue-ban-image-select':blueBanIndex === 2}"></div>
            <img class="select-image" v-if="blueBanHeroes[2]" :src="blueBanHeroes[2].skins[0].loadingImg" alt="">
            <div class="ban-name" v-if="blueBanHeroes[2] === null">空</div>
          </div>
          <div class="blue-ban-box">
            <div class="ban-image" :class="{'blue-ban-image-select':blueBanIndex === 3}"></div>
            <img class="select-image" v-if="blueBanHeroes[3]" :src="blueBanHeroes[3].skins[0].loadingImg" alt="">
            <div class="ban-name" v-if="blueBanHeroes[3] === null">空</div>
          </div>
          <div class="blue-ban-box">
            <div class="ban-image" :class="{'blue-ban-image-select':blueBanIndex === 4}"></div>
            <img class="select-image" v-if="blueBanHeroes[4]" :src="blueBanHeroes[4].skins[0].loadingImg" alt="">
            <div class="ban-name" v-if="blueBanHeroes[4] === null">空</div>
          </div>
        </div>
      </div>
      <div class="red-team">
        <div class="red-header">
          {{ bpData!.redName || '红色' }}
          <span v-show="getCountdownVisible('red')" class="red-countdown">:{{ countdown }}</span>
        </div>
        <div class="red-pick">
          <div class="red-pick-box">
            <div class="pick-image" :class="{'red-pick-image-select':redPickIndex === 0}"></div>
            <template v-if="redPickHeroes[0]">
              <img class="select-image" :src="redPickHeroes[0].skins[0].loadingImg" alt="">
              <div class="pick-name">{{ redPickHeroes[0].hero.name }}</div>
            </template>
          </div>
          <div class="red-pick-box">
            <div class="pick-image" :class="{'red-pick-image-select':redPickIndex === 1}"></div>
            <template v-if="redPickHeroes[1]">
              <img class="select-image" :src="redPickHeroes[1].skins[0].loadingImg" alt="">
              <div class="pick-name">{{ redPickHeroes[1].hero.name }}</div>
            </template>
          </div>
          <div class="red-pick-box">
            <div class="pick-image" :class="{'red-pick-image-select':redPickIndex === 2}"></div>
            <template v-if="redPickHeroes[2]">
              <img class="select-image" :src="redPickHeroes[2].skins[0].loadingImg" alt="">
              <div class="pick-name">{{ redPickHeroes[2].hero.name }}</div>
            </template>
          </div>
          <div class="red-pick-box">
            <div class="pick-image" :class="{'red-pick-image-select':redPickIndex === 3}"></div>
            <template v-if="redPickHeroes[3]">
              <img class="select-image" :src="redPickHeroes[3].skins[0].loadingImg" alt="">
              <div class="pick-name">{{ redPickHeroes[3].hero.name }}</div>
            </template>
          </div>
          <div class="red-pick-box">
            <div class="pick-image" :class="{'red-pick-image-select':redPickIndex === 4}"></div>
            <template v-if="redPickHeroes[4]">
              <img class="select-image" :src="redPickHeroes[4].skins[0].loadingImg" alt="">
              <div class="pick-name">{{ redPickHeroes[4].hero.name }}</div>
            </template>
          </div>
        </div>
        <div class="red-ban">
          <div class="red-ban-box">
            <div class="ban-image" :class="{'red-ban-image-select':redBanIndex === 0}"></div>
            <img class="select-image" v-if="redBanHeroes[0]" :src="redBanHeroes[0].skins[0].loadingImg" alt="">
            <div class="ban-name" v-if="redBanHeroes[0] === null">空</div>
          </div>
          <div class="red-ban-box">
            <div class="ban-image" :class="{'red-ban-image-select':redBanIndex === 1}"></div>
            <img class="select-image" v-if="redBanHeroes[1]" :src="redBanHeroes[1].skins[0].loadingImg" alt="">
            <div class="ban-name" v-if="redBanHeroes[1] === null">空</div>
          </div>
          <div class="red-ban-box">
            <div class="ban-image" :class="{'red-ban-image-select':redBanIndex === 2}"></div>
            <img class="select-image" v-if="redBanHeroes[2]" :src="redBanHeroes[2].skins[0].loadingImg" alt="">
            <div class="ban-name" v-if="redBanHeroes[2] === null">空</div>
          </div>
          <div class="red-ban-box">
            <div class="ban-image" :class="{'red-ban-image-select':redBanIndex === 3}"></div>
            <img class="select-image" v-if="redBanHeroes[3]" :src="redBanHeroes[3].skins[0].loadingImg" alt="">
            <div class="ban-name" v-if="redBanHeroes[3] === null">空</div>
          </div>
          <div class="red-ban-box">
            <div class="ban-image" :class="{'red-ban-image-select':redBanIndex === 4}"></div>
            <img class="select-image" v-if="redBanHeroes[4]" :src="redBanHeroes[4].skins[0].loadingImg" alt="">
            <div class="ban-name" v-if="redBanHeroes[4] === null">空</div>
          </div>
        </div>
      </div>
    </div>
    <div class="start" @click="startSelectHero" v-if="!heroesVisible">准备开始</div>
    <div class="heroesSelect-container" v-if="heroesVisible">
      <HeroesSelect :status="selectStatus" @on-select="handleSelectHero" @on-sure="handleSure"></HeroesSelect>
    </div>
    <audio controls hidden ref="audioRef" loop>
      <source src="@/assets/audio/start.m4a">
    </audio>
  </div>
</template>

<style scoped lang="less">
.bp-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}

.select-image {
  width: 100%;
  height: 100%;
}

.blue-team, .red-team {
  width: 49vw;
  display: flex;
  flex-direction: column;
}

.blue-team {
  align-items: flex-end;
}

.red-team {
}

.blue-header, .red-header {
  font-family: Merriweather Sans, sans-serif;
  font-weight: 800;
  margin: 0;
  line-height: 79px;
  text-transform: uppercase;
  font-size: 36px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  height: 79px;
  width: 500px;
  color: #fff;
  position: relative;
}

.blue-countdown, .red-countdown {
  position: absolute;
  font-size: 30px;
}

.blue-countdown {
  right: 20px;
}

.red-countdown {
  left: 20px;
}

.blue-header {
  background: url(data:image/png;base64,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) no-repeat 100% 0 #000;
  padding: 0 180px 0 10px;
}

.red-header {
  background: url(data:image/png;base64,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) no-repeat 0 0 #000;
  padding: 0 10px 0 180px;
  text-align: right;
}

.blue-pick, .red-pick, .blue-ban, .red-ban {
  width: 100%;
  height: 180px;
  background: linear-gradient(90deg, #141519, #050506 15%, #050506 85%, #141519);
  display: flex;
}

.blue-pick {
  justify-content: flex-end;
}

.blue-pick-box, .red-pick-box {
  width: 100px;
  height: 100%;
  text-align: center;
  position: relative;
  padding: 2px;
  margin-right: 5px;
  background: #010a0f;

  .pick-image {
    width: 100%;
    //padding-top: 100%;
    //background: #010a0f;
    position: relative;
    transition: background-color .35s ease-out;
  }
}

.red-pick-box, .red-ban-box {
  background: #1C0508;
}

.blue-ban, .red-ban {
  margin-top: 40px;
}

.blue-ban {
  justify-content: flex-end;
}

.blue-ban-box, .red-ban-box {
  width: 100px;
  height: 100%;
  text-align: center;
  position: relative;
  padding: 2px;
  margin-right: 5px;
  background: #010a0f;

  .pick-image {
    width: 100%;
    position: relative;
    transition: background-color .35s ease-out;
  }
}

.red-ban-box {
  background: #1C0508;
}

.start {
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
  position: relative;
  left: 50%;
  transform: translate(-50%);
  top: 30px;
}

.ban-image::after {
  content: " ";
  display: block;
  width: 56px;
  height: 56px;
  background: url(data:image/png;base64,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) no-repeat;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
}

.ban-image {
  height: 0;
}

.blue-ban-image-select, .red-ban-image-select, .blue-pick-image-select, .red-pick-image-select {
  height: 10px;
  background: #0B4264;
  transition: all .5s linear;
}

.red-ban-image-select, .red-pick-image-select {
  background: #BE1F37;
}

.pick-name {
  position: absolute;
  font-size: 11px;
  text-transform: uppercase;
  text-align: center;
  left: 50%;
  transform: translate(-50%, 190px);
}

.ban-name {
  text-align: center;
  line-height: 150px;
}
</style>
