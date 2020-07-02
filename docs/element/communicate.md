# 组件通信

## 跨层级传值

**组件传值，除了我们常用的 `props、$emit / $on、vuex、Bus`，还有一个不常用但在封装高级组件时会很实用的方法： provide/inject**

> 以el-button组件中size大小为例

```javascript
// form.vue
provide() {
  return {
    elForm: this
  };
},
props: {
  size: String,
}
```

```javascript
// button.vue
inject: {
  elForm: {
    default: ''
  },
  elFormItem: {
    default: ''
  }
},
props: {
  size: String,
},
computed: {
  _elFormItemSize() {
    return (this.elFormItem || {}).elFormItemSize;
  },
  buttonSize() {
    // size优先级 组件本身 > el-item > el-form
    return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
  }
}
```


## 跨层级事件

> 复杂组件往往层级很深，需要依赖于跨层级通信

### 父子交流，勉强谈得来

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

### 隔代交流，完全没有话题

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


### 沉浸在一个人的小宇宙

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


### 换位思考，话题就多了

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

> 给组件取个名，子组件找祖先组件时，不用关心它的层级，根据 `componentName` 向上循环查找即可

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



## element 跨层级通信实现

> 原理: 通过循环或递归寻找指定的组件，然后在组件本身$emit事件并传递参数

```javascript 
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
}
```