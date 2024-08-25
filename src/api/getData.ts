import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { HeroDetail, Heroes } from '@/type'

// 英雄列表
export const getHeroes = (): Promise<AxiosResponse<{ hero: Heroes[] }>> => {
  return axios.get('https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js', {})
}

// 单个英雄信息
export const getHeroDetail = (id:string): Promise<AxiosResponse<HeroDetail>> => {
  return axios.get(`https://game.gtimg.cn/images/lol/act/img/js/hero/${id}.js`)
}
