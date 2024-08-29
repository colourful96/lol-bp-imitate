import { defineStore } from 'pinia'
import { getHeroDetail, getHeroes } from '@/api/getData'
import type { HeroDetail, Heroes } from '@/type'

export const useLolStore = defineStore('lol', {
  state: (): { heroes: Heroes[], heroDetails: HeroDetail[] } => ({
    heroes: [],
    heroDetails: [] // 已经请求到的英雄详情集合
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
    searchHero(data: string) {
      const searchHeroes: Heroes[] = []
      this.heroes.forEach(h => {
        if (h.name.includes(data)) {
          searchHeroes.push(h)
        }
      })
      this.$patch({ heroes: searchHeroes })
    },
    async getHeroDetail(id: string) {
      const exist = this.heroDetails.find(f => f.hero.heroId === id)
      if (exist) return exist
      const response = await getHeroDetail(id)
      if (response.status === 200) {
        this.$patch({ heroDetails: this.heroDetails.concat([response.data]) })
        return response.data
      }
      throw new Error('获取数据失败')
    }
  }
})
