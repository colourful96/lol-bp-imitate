import axios from 'axios'

export const getHeroes = () => {
  return axios.get('https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js', {})
}
