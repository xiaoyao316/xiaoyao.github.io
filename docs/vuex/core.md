# 最简版vuex

> 52行代码，实现vuex核心

```javascript
let Vue;
function install(_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate: vuexInit
  })
}
function vuexInit() {
  const options = this.$options
  if (options.store) {
    this.$store = options.store
  } else if (options.parent && options.parent.$store) {
    this.$store = options.parent.$store
  }
}
class Store {
  constructor(options = {}) {
    this._raw = options
    this.getters = {};
    this.actions = options.actions;
    this.mutations = options.mutations;
    this._vm = new Vue({
      data: {
        $rootState: options.state
      }
    })
    defineGetters(this)
  }
  get state() {
    return this._vm.$data.$rootState
  }
  dispatch = (type, payload) => {
    this.actions[type](this, payload)
  }
  commit = (type, payload) => {
    this.mutations[type](this.state, payload)
  }
}
function defineGetters (store) {
  forEachValue(store._raw.getters, (fn, key) => {
    Object.defineProperty(store.getters, key, {
      get: () => fn(store.state)
    })
  })
}
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}
export default {
  Store,
  install
}
```