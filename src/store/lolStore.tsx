import { defineStore } from 'pinia'
import { getHeroes } from '@/api/getData'

export const useLolStore = defineStore('lol', {
  state: () => ({
    lol: 'lol',
    heroes: []
  }),
  getters: {},
  actions: {
    async getHeroes() {
      const resp = await getHeroes()
      if (resp.status === 200) {
        this.heroes = resp.data.hero
      }
    }
  }
})
