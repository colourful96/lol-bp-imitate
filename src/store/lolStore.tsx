import { defineStore } from 'pinia'
import { getHeroes } from '@/api/getData'
import type { Heroes } from '@/type'

export const useLolStore = defineStore('lol', {
  state: (): { heroes: Heroes[] } => ({
    heroes: []
  }),
  getters: {},
  actions: {
    async getHeroes() {
      const resp = await getHeroes()
      if (resp.status === 200) {
        this.$patch({ heroes: resp.data.hero })
        return resp.data.hero
      }
    }
  }
})
