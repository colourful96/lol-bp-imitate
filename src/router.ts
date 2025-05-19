import { createWebHashHistory, createRouter } from 'vue-router'

import Home from './views/Home.vue'
import BanPick from './views/BanPick.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/banpick',
      name: 'bp',
      component: BanPick
    }
  ]
})

router.beforeEach((to, from, next) => {
  const path = to.path.toLowerCase()
  const bpData = localStorage.getItem('bpData')
  if (path === '/banpick') {
    if (bpData) {
      next()
    } else {
      next({ name: 'home' })
    }
  } else {
    next()
  }
})

export default router
