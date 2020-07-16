# 基本使用

> 本节代码和实际vuex使用方式保持一致，并作为后一节的测试用例。

**main.js引入**
```javascript
import Vue from 'vue'
import App from './App'
import store from './store'

new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
```

**Store定义**
```javascript
import Vue from 'vue'
import Vuex from '../vuex'
Vue.use(Vuex)

const state = {
  name: 'Li',
  age: 16
}

const getters = {
  fullName (state) {
    return `Bruce ${state.name}`
  }
}

const actions = {
  asyncChange ({commit}, payload) {
    console.log(commit)
    setTimeout(() => {
      commit('syncChange', payload)
    }, 3000)
  }
}

const mutations = {
  syncChange(state, payload) {
    state.name = payload;
  }
}

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})

export default store
```

**组件内使用**

```javascript
<template>
  <div>
    <h1>全面: {{$store.getters.fullName}}</h1>
    <h1>姓名: {{$store.state.name}}</h1>
    <h1>年龄: {{$store.state.age}}</h1>
    <button @click="directChange">直接改</button>
    <button @click="dispatch">异步修改</button>
    <button @click="commit">同步修改</button>
  </div>
</template>

<script>
export default {
  methods: {
    directChange () {
      this.$store.state.name = 'Wang'
    },
    dispatch () {
      this.$store.dispatch('asyncChange', 'dispatch')
    },
    commit () {
      this.$store.commit('syncChange', 'commit')
    }
  }
}
</script>
```