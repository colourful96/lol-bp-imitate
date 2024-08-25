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
    },
    searchHero(data:string){
      const searchHeroes: Heroes[] = [];
      this.heroes.forEach(h => {
        if(h.name.includes(data)){
          searchHeroes.push(h)
        }
      })
      this.$patch({ heroes: searchHeroes});
    }
  }
})
