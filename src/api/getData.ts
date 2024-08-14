import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { Heroes } from '@/type'

export const getHeroes = (): Promise<AxiosResponse<{ hero: Heroes[] }>> => {
  return axios.get('https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js', {})
}
