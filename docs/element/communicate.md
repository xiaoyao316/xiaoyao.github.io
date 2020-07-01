# 组件通信

## 跨层级传值

**组件传值，除了我们常用的 `props、$emit / $on、vuex、Bus`，还有一个不常用但在封装高级组件时会很实用的方法： provide/inject**

> 以el-button组件中size大小为例

```javascript

```


## 跨层级事件

> 复杂组件中往往依赖于跨层级通信

### 父组件on, 子组件emit
```javascript
<component-a @say="say"></component-a>
```

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

### 爷爷组件on, 孙子组件emit
```javascript
<wrap @say="say">
  <component-a></component-a>
</wrap>
```

```javascript
const wrap = {
  template: `<div><slot></slot></div>`
}
const componentA = {
  methods: {
    handleClick () {
      this.$emit('say', '大哥大嫂过年好')
    }
  },
  template: `<button v-on:click="handleClick">按钮</button>`
}

export default {
  components: {,
    wrap,
    componentA
  },
  methods: {
    say (data) {
      console.log(`小日本咆哮道: ${data}`)
    }
  }
}
```

> 粗大事了，上面的监听没执行。

### 组件on, 同时emit, 自嗨

```javascript
<button @click="onClick">自嗨</button>
```

```javascript
export default {
  created () {
    this.$on('say', data => {
      console.log(`小日本咆哮道: ${data}`)
    })
  },
  methods: {
    onClick () {
      this.$emit('say', '大哥大嫂过年好')
    }
  }
}
```

### 爷爷组件on, 孙子组件emit, 一起浪
```javascript
<wrap @say="say">
  <component-a></component-a>
</wrap>
```

```javascript
const wrap = {
  template: `<div><slot></slot></div>`
}

const componentA = {
  name: 'component-a',
  methods: {
    handleClick () {
      this.$parent.$emit('say', '大哥大嫂过年好')
    }
  },
  template: `<button v-on:click="handleClick">按钮</button>`
}

export default {
  components: {
    wrap: wrap,
    'component-a': componentA
  },
  methods: {
    say (data) {
      console.log(`小日本咆哮道: ${data}`)
    }
  }
}
```

### 祖祖辈辈, 一起浪
```javascript
<wrap>
  <wrap>
    <component-a></component-a>
  </wrap>
</wrap>
```

```javascript
const wrap = {
  template: `<div><slot></slot></div>`
}

const componentA = {
  name: 'component-a',
  computed: {
    parent () {
      let parent = this.$parent;
      let parentName = parent.$options.componentName;
      while (parentName !== 'test') {
        parent = parent.$parent;
        parentName = parent.$options.componentName;
      }
      return parent;
    }
  },
  methods: {
    handleClick () {
      this.parent.$emit('say', '大哥大嫂过年好')
    }
  },
  template: `<button v-on:click="handleClick">按钮</button>`
}

export default {
  componentName: 'test',
  components: {
    wrap: wrap,
    'component-a': componentA
  },
  created () {
    this.$on('say', data => {
      console.log(`小日本咆哮道: ${data}`)
    })
  }
}
```