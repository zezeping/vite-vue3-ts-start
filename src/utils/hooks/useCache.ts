import { reactive, computed, type UnwrapNestedRefs } from 'vue'

class Cache {
  storage: UnwrapNestedRefs<any>;
  constructor() {
    this.storage = reactive({})
  }
  async setValue(cacheKey: string, value: any) {
    Object.assign(this.storage[cacheKey], {
      loaded: true,
      value: value,
    })
  }
  getValue(cacheKey: string, defaultValue: any) {
    if (defaultValue && !this.storage[cacheKey].value) {
      this.setValue(cacheKey, defaultValue)
    }
    return computed(() => ({
      value: this.storage[cacheKey].value,
    }))
  }
}

const cache = new Cache()

export function useCache(cacheKey: string, defaultValue?: any) {
  return cache.getValue(cacheKey, defaultValue)
}
