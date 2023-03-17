import { createApp, render, type VNode } from 'vue'
import { createPinia } from './stores'

import App from './App.vue'
import router from './router'

import './assets/stylesheets/application.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 配置到全局变量中 const gv = getCurrentInstance().appContext.config.globalProperties
Object.defineProperties(app.config.globalProperties, {
  $isDev: {
    get: (): boolean => import.meta.env.MODE === 'development'
  }
})

// @ts-ignore
app.render = (vnode: VNode, rootContainer: HTMLElement): void => {
  if (vnode && !vnode.appContext) vnode.appContext = app._context
  render(vnode, rootContainer)
}

app.mount('#app')
