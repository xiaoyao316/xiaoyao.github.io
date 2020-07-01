# 表单

1. 组件跨层级传值

```javascript
<template>
  <div>
    <ul class="question">
      <li>《武林外传》中，姬无命临死前说，“是我杀了我”</li>
    </ul>
    <component-a @say="say"></component-a>
  </div>
</template>
```
## 1. 父组件on, 子组件emit
```javascript
const componentA = {
  methods: {
    handleClick () {
      this.$emit('say', '大哥大嫂过年好')
    }
  },
  template: `<button v-on:click="handleClick">按钮</button>`
}

export default {
  components: {
    componentA
  },
  methods: {
    say (data) {
      console.log(`小日本咆哮道: ${data}`)
    }
  }
}
```