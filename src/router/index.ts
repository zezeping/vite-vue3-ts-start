import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/about', name: 'About', component: () => import('../views/about') }
  ]
})

export default router
