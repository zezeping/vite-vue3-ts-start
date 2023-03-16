import { createRouter, createWebHistory } from 'vue-router'
import { useProxyRouter, useProxyRoutes } from '@/utils/hooks/useProxyRouter'
import Home from '../views/home'

const router = useProxyRouter(createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: useProxyRoutes([
    { path: '/', name: 'Home', component: Home },
    { path: '/about', name: 'About', component: () => import('../views/about') }
  ])
}))

export default router
