import { defineStore } from 'pinia'
import { getHeroDetail, getHeroes } from '@/api/getData'
import type { HeroDataType, HeroDetail, Heroes } from '@/type'

interface State {
  heroes: Heroes[],
  heroDetails: HeroDetail[],
  bpHeroes: {
    blueBanHeroes: (HeroDetail | null)[],
    bluePickHeroes: (HeroDetail | null)[],
    redBanHeroes: (HeroDetail | null)[],
    redPickHeroes: (HeroDetail | null)[]
  }
}

export const useLolStore = defineStore('lol', {
  state: (): State => ({
    heroes: [],
    heroDetails: [], // 已经请求到的英雄详情集合
    bpHeroes: { // 禁用和选择选择的英雄
      blueBanHeroes: [],
      bluePickHeroes: [],
      redBanHeroes: [],
      redPickHeroes: []
    }
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
    },
    updateBpHero({ type, hero, index }: { type: HeroDataType, hero: HeroDetail | null, index: number }) {
      const bpHero = this.bpHeroes[type]
      let exist = []
      if (bpHero[index]) {
        bpHero[index] = hero
        exist = bpHero
      } else {
        exist = bpHero.concat([hero])
      }
      this.$patch({ bpHeroes: { ...this.bpHeroes, [type]: exist } })
    }
  }
})
