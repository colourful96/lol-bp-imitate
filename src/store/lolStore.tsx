import { defineStore } from 'pinia'
import { getHeroes } from '@/api/getData'

export const useLolStore = defineStore('lol', {
  state: () => ({
    count: 1,
    heroes: []
  }),
  getters: {},
  actions: {
    async getHeroes() {
      const resp = await getHeroes()
      if (resp.status === 200) {
        this.$patch({ heroes: resp.data.hero })
        return resp.data.hero;
      }
    }
  }
})
