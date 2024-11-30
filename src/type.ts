export interface Heroes {
  heroId: string
  name: string
  alias: string
  title: string
  roles: string[]
  isWeekFree: string
  attack: string
  defense: string
  magic: string
  difficulty: string
  selectAudio: string
  banAudio: string
  isARAMweekfree: string
  ispermanentweekfree: string
  changeLabel: string
  goldPrice: string
  couponPrice: string
  camp: string
  campId: string
  keywords: string
  instance_id: string
}


export interface HeroDetail {
  hero: Hero
  skins: Skin[]
  spells: Spell[]
  version: string
  fileName: string
  fileTime: string
}

export interface Hero {
  heroId: string
  name: string
  alias: string
  title: string
  roles: string[]
  shortBio: string
  camp: string
  campId: string
  attack: string
  defense: string
  magic: string
  difficulty: string
  hp: string
  hpperlevel: string
  mp: string
  mpperlevel: string
  movespeed: string
  armor: string
  armorperlevel: string
  spellblock: string
  spellblockperlevel: string
  attackrange: string
  hpregen: string
  hpregenperlevel: string
  mpregen: string
  mpregenperlevel: string
  crit: string
  critperlevel: string
  attackdamage: string
  attackdamageperlevel: string
  attackspeed: string
  attackspeedperlevel: string
  allytips: string[]
  enemytips: string[]
  heroVideoPath: string
  isWeekFree: string
  damageType: string
  style: string
  difficultyL: string
  damage: string
  durability: string
  crowdControl: string
  mobility: string
  utility: string
  selectAudio: string
  banAudio: string
  changeLabel: string
  goldPrice: string
  couponPrice: string
  keywords: string
  introduce: string
  palmHeroHeadImg: string
  relations: any[]
}

export interface Skin {
  skinId: string
  heroId: string
  heroName: string
  heroTitle: string
  name: string
  chromas: string
  chromasBelongId: string
  isBase: string
  emblemsName: string
  description: string
  mainImg: string
  iconImg: string
  loadingImg: string
  videoImg: string
  sourceImg: string
  vedioPath: string
  suitType: string
  publishTime: string
  chromaImg: string
  centerImg: string
}

export interface Spell {
  heroId: string
  spellKey: string
  name: string
  description: string
  abilityIconPath: string
  abilityVideoPath: string
  dynamicDescription: string
  cost: any
  costburn: any
  cooldown: any
  cooldownburn: any
  range: any
  cooldownupgrade: string
  costupgrade: string
}

export type HeroDataType = 'blueBanHeroes' | 'bluePickHeroes' | 'redBanHeroes' | 'redPickHeroes';

