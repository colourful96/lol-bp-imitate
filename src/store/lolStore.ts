import { defineStore } from 'pinia'
import { getHeroDetail, getHeroes } from '@/api/getData'
import type { HeroDataType, HeroDetail, Heroes } from '@/type'
import PQueue from 'p-queue'

export interface BPHeroes {
  blueBanHeroes: (HeroDetail | null)[],
  bluePickHeroes: (HeroDetail | null)[],
  redBanHeroes: (HeroDetail | null)[],
  redPickHeroes: (HeroDetail | null)[],
  [key:string]: (HeroDetail | null)[],
}

interface State {
  heroes: Heroes[],
  heroDetails: HeroDetail[],
  bpHeroes: BPHeroes,
}

export const useLolStore = defineStore('lol', {
  state: (): State => ({
    heroes: [],
    heroDetails: [], // 已经请求到的英雄详情集合
    bpHeroes: { // 禁用和选择选择的英雄
      blueBanHeroes: [],
      bluePickHeroes: [],
      redBanHeroes: [],
      redPickHeroes: [],
    }
  }),
  getters: {},
  actions: {
    async getHeroes() {
      const resp = await getHeroes()
      if (resp.status === 200) {
        this.$patch({ heroes: resp.data.hero })
        this.getAllHeroDetails(resp.data.hero);
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
    getAllHeroDetails(heroes: Heroes[]){
      const queue = new PQueue({ concurrency: 5 })
      const requests = heroes.map(hero => {
        return queue.add(() => getHeroDetail(hero.heroId));
      })
      Promise.allSettled(requests).then(response => {
        const hd:HeroDetail[] = [];
        response.forEach((resp:any) => {
          if(resp.status === 'fulfilled') {
            hd.push(resp.value.data);
          }
        })
        this.$patch({heroDetails:hd});
      })
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
    },
    // 当在pick时 倒计时结束后如果没有选择英雄则自动选择
    async findNotSelectedHero(){
      let selectedHeroes:(HeroDetail | null)[] = [];
      for (const key in this.bpHeroes) {
        const item = this.bpHeroes[key];
        selectedHeroes = selectedHeroes.concat(item).filter(f => f);
      }
      for (let i = 0; i < this.heroes.length; i++) {
        const hero = this.heroes[i];
        const exist = selectedHeroes.some(s => s?.hero.heroId === hero.heroId)
        if(exist) continue;
        return await this.getHeroDetail(hero.heroId);
      }
      return null;
    }
  }
})
