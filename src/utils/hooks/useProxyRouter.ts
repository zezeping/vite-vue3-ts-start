import type { Router, RouteRecordRaw } from 'vue-router'
import { computed } from 'vue'
import NProgress from 'nprogress'

export const useRoute = (route: RouteRecordRaw): any => {
  const { component, ...finalRoute } = route as any
  // name
  finalRoute.name = finalRoute.name || finalRoute.path.replace(/^\//, '')
  // meta
  finalRoute.meta = {
    ...(finalRoute as any).meta,
    hasPermission: computed(() => true),
  }
  // component
  if (typeof component === 'function') {
    finalRoute['component'] = () => {
      const result = component()
      if (typeof result === 'object' && typeof result.then === 'function') {
        NProgress.start()
        result.finally(() => {
          NProgress.done()
        })
      }
      return result
    }
  } else {
    finalRoute['component'] = component
  }
  return finalRoute
}

export const useProxyRoutes = (routes: RouteRecordRaw[] = []): any => {
  const iterateUseRoute = (route: RouteRecordRaw): RouteRecordRaw => {
    if (route.children?.length) {
      route.children = route.children.map((childRoute: RouteRecordRaw) => iterateUseRoute(childRoute))
    }
    return useRoute(route)
  }
  return routes.map(route => iterateUseRoute(route))
}

interface ProxyRouter extends Router {
  getRoute(routeName: string): RouteRecordRaw | null;
  getParentRoute(route: RouteRecordRaw): RouteRecordRaw | null;
}

export const useProxyRouter = (router: Router) => {
  const proxyRouter = new Proxy(router, {
    get(object, key, ...args) {
      if (key === 'getRoute') {
        return function(routeName: string) {
          const routes = object.getRoutes()
          return routes.find(route => route.name === routeName)
        }
      } else if (key === 'getParentRoute') {
        return function(route: RouteRecordRaw) {
          if (route.name) {
            const parentRouteName = String(route.name).split('/').slice(0, -1).join('/')
            return parentRouteName ? (proxyRouter as any as ProxyRouter).getRoute(parentRouteName) : null
          }
          const parentRouteName = route.name!.split('/').slice(0, -1).join('/')
          return parentRouteName ?(proxyRouter as any as ProxyRouter).getRoute(parentRouteName) : null
        }
      } else {
        return Reflect.get(object, key, ...args)
      }
    }
  })

  return proxyRouter
}