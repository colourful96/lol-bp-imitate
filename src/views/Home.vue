<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const inputValue = ref({
  blueName: '',
  redName: '',
  matchName: ''
})
const buttonDisabled = computed(() => {
  const { blueName, redName, matchName } = inputValue.value
  return !blueName || !redName || !matchName
})
const handleConfirm = () => {
  localStorage.setItem('bpData', JSON.stringify(inputValue.value))
  router.replace('/banpick')
}

</script>

<template>
  <div class="home">
    <div class="create">
      <img src="http://prodraft.leagueoflegends.com/static/media/L.95b4d320.svg" alt="">
      <div>
        <label for="blue-team-name">蓝色方队伍名称</label>
        <input id="blue-team-name" type="text" maxlength="30" v-model="inputValue.blueName" />
        <label for="red-team-name">红色方队伍名称</label>
        <input id="red-team-name" type="text" maxlength="30" v-model="inputValue.redName" />
        <label for="match-name">比赛名称</label>
        <input id="match-name" type="text" maxlength="30" v-model="inputValue.matchName" />
        <button class="confirm" :disabled="buttonDisabled" @click="handleConfirm">确认</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.home {
  width: 100%;
  height: 100%;

  .create {
    max-width: 800px;
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 50px;
      margin: 50px auto;
      display: block;
    }

    label {
      text-transform: uppercase;
      display: block;
      font-size: 21px;
      margin: 10px 0;
    }

    input {
      width: 100%;
      height: 50px;
      line-height: 50px;
      color: #fff;
      display: block;
      border: 0;
      outline: none;
      padding: 0 20px;
      font-size: 21px;
      background: #000;
      margin: 0 0 40px;
    }

    #blue-team-name {
      background: #0a4264;
    }

    #red-team-name {
      background: #be2038;
    }

    button {
      color: #000;
      text-transform: uppercase;
      border: 0;
      outline: 0;
      text-align: center;
      line-height: 30px;
      font-family: Merriweather Sans, sans-serif;
      font-weight: 800;
      font-size: 21px;
      margin: 0;
      padding: 0 20px;
      display: inline-block;
      position: absolute;
      right: 0;
      top: 20px;
      cursor: pointer;
    }

    .confirm {
      position: static;
      margin: 0 auto;
      display: block;
    }

    .confirm[disabled] {
      background: #515151;
    }
  }
}
</style>
