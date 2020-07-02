# 表单

## Api设计

**Q: 组件为什么这样设计？ form 和 form-item 都需要提供validate？prop为什么要横插一杠？**

**`form`**
- model    数据源
- rules    校验规则
- validate 校验方法

**`form-item`**
- props    接收 `prop` 和 `label`
- validate 校验方法

> 最终使用方式，同el-form
```javascript
<template>
  <el-form ref="ruleForm" :model="model" :rules="rules">
      <el-form-item prop="name" label="姓名">
        <el-input v-model="model.name" />
      </el-form-item>
      <el-form-item prop="age" label="年龄">
        <el-input v-model="model.age" />
      </el-form-item>
      <el-form-item>
        <button @click.prevent="submit">提交</button>
      </el-form-item>
    </el-form>
</template>

<script>
import Form from './components/form.vue'
import FormItem from './components/form-item.vue'
import ElInput from './components/input.vue'

export default {
  name: 'App',
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': ElInput,
  },
  data () {
    return {
      model: {
        name: 'kitty',
        age: 12
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
      }
    }
  },
  methods: {
    submit () {
      this.$refs.ruleForm.validate((valid, invalidFields) => {
        if (valid) {
          console.log(valid, invalidFields)
        } else {
          console.log(valid, invalidFields);
        }
      })
    }
  }
}
</script>
```

## 组件结构

> 先迈出一小步，实现组件传值及数据双向绑定

**form.vue**
```javascript
<template>
  <form class="custom-form">
    <slot></slot>
  </form>
</template>

<script>
export default {
  name: 'ElForm',
  provide () {
    return {
      elForm: this  // 向下传递实例
    }
  },
  props: {
    model: Object,  // 数据模型
    rules: Object,  // 校验规则
  },
  methods: {
    validate () {
      // 提供校验方法
    }
  }
}
</script>
```

**form-item.vue**
```javascript
<template>
  <div class="custom-form-item">
    <span>{{label}}</span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ElFormItem',
  provide () {
    return {
      elFormItem: this  // 向下传递实例
    }
  },
  inject: ['elForm'],   // 获取elForm实例
  props: {
    prop: {
      type: String,
      required: false,
      default: ''
    },
    label: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    form () {
      return this.elForm.$parent
    }
  },
  methods: {
    validate () {
      // 提供校验方法
    }
  }
}
</script>

<style>
.custom-form-item .el-form-item__error {
  color: red;
  font-size: 12px;
}
</style>
```

**input.vue**
```javascript
<template>
  <div class="custom-input">
    <input type="text" :value="value" @input="handleInput" @blur="handleBlur">
  </div>
</template>

<script>
export default {
  name: 'elInput',
  componentName: 'elInput',
  props: {
    value: {
      type: [String, Number],
      required: true,
      default: ''
    }
  },
  inject: ['elFormItem'],
  methods: {
    handleInput (e) {
      this.$emit('input', e.target.value)
    },
    handleBlur (e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>
```

> 考虑这样一个场景，假期归来，老师往往只需要说一句，几位课代表把作业收上来，就可以清楚知道谁没有完成。form也可以像老师一样，校验（收作业）的功能，交给form-item完成，form只需要通知到每个form-item, 去校验（收作业）吧，就能得到想要的结果。<br><br>现实中，总会有那么几个狐假虎威的课代表，老师都还没发话，就提前催促赶紧交作业。而程序中，表单项值变化时，也应该触发校验并给出提示，所以form-item也需要实现一种自发的机制。<br><br>综上，我们需要给form-item实现一个校验方法，form可以调用它，嵌套的表单组件也可以触发它。


**那么问题来了，form怎么找到form-item并调用它们提供的方法，表单组件怎么知道是自己现在被嵌套在哪个form-item里？答案就是上一节讲到的跨层级通信**


**form.vue**
```javascript
componentName: 'ElForm', // 组件名是关键
data() {
  return {
    fields: []  // 缓存form-item项
  };
},
created() {
  // 监听Form-Item发送的表单项新增事件
  this.$on('el.form.addField', (field) => {
    if (field) {
      this.fields.push(field);
    }
  });
  // 监听Form-Item发送的表单项移除事件
  this.$on('el.form.removeField', (field) => {
    if (field.prop) {
      this.fields.splice(this.fields.indexOf(field), 1);
    }
  });
},
methods: {
  // 校验所有表单项
  validate(callback) {
    let valid = true;
    let count = 0;
    // 如果需要验证的fields为空，调用验证时立刻返回callback
    if (this.fields.length === 0 && callback) {
      callback(true);
    }
    let invalidFields = {};
    
    this.fields.forEach(field => {
      // 第一个参数为空，校验全部
      field.validate('', (message, field) => {});
    });
  }
}
```

**form-item.vue**
```javascript
import emitter from '../element/src/mixins/emitter';
import objectAssign from '../element/src/utils/merge';
import { noop, getPropByPath } from '../element/src/utils/util';

componentName: 'ElFormItem', // 组件名是关键
mixins: [emitter],
computed: {
  form () {
    return this.elForm.$parent
  }
},
mounted() {
  // prop是连接form和item的关键，有prop才进行初始化操作
  if (this.prop) {
    // 通知form
    this.dispatch('ElForm', 'el.form.addField', [this]);

    // 监听
    this.addValidateEvents();

    // 组件销毁，移除对应表单项
    this.$once('hook:beforeDestroy', () => {
      this.dispatch('ElForm', 'el.form.removeField', [this]);
    })
  }
},
methods: {
  validate(trigger, callback = noop) {
    console.log(this.prop, '触发校验')
  },
  // 获取全部校验规则
  getRules() {
    let formRules = this.form.rules;
    const selfRules = this.rules;
    const requiredRule = this.required !== undefined ? { required: !!this.required } : [];

    const prop = getPropByPath(formRules, this.prop || '');
    formRules = formRules ? (prop.o[this.prop || ''] || prop.v) : [];

    return [].concat(selfRules || formRules || []).concat(requiredRule);
  },
  // 获取指定校验规则，有时候需要根据指定规则进行校验，trigger为空时返回所有规则
  getFilteredRule(trigger) {
    const rules = this.getRules();

    return rules.filter(rule => {
      if (!rule.trigger || trigger === '') return true;
      if (Array.isArray(rule.trigger)) {
        return rule.trigger.indexOf(trigger) > -1;
      } else {
        return rule.trigger === trigger;
      }
    }).map(rule => objectAssign({}, rule));
  },
  addValidateEvents() {
    const rules = this.getRules();

    if (rules.length || this.required !== undefined) {
      // 监听input/select/date-picker等基础组件通过emitter/dispatch派发的事件（blur,change)
      this.$on('el.form.blur', this.onFieldBlur);
      this.$on('el.form.change', this.onFieldChange);
    }
  },
  // 取消监听
  removeValidateEvents() {
    this.$off();
  },
  onFieldBlur() {
    this.validate('blur');
  },
  onFieldChange() {
    this.validate('change');
  },
}
```

**input.vue**
```javascript
import emitter from '../element/src/mixins/emitter';
export default {
  componentName: 'elInput', // 组件名是关键
  mixins: [emitter],
  ...
  watch: {
    value(val) {
      this.dispatch('ElFormItem', 'el.form.change', [val]) // change
    }
  },
  methods: {
    ...
    handleBlur (e) {
      this.$emit('input', e.target.value)
      this.dispatch('ElFormItem', 'el.form.blur', [this.value]) // blur
    }
  }
}
```

> 现在，表单就可以通过form和表单项改变触发form-item的validate事件了。最后，完善校验逻辑。

**form.vue**
```javascript
import objectAssign from '../element/src/utils/merge';
import emitter from '../element/src/mixins/emitter';

mixins: [emitter],
methods: {
  validate(callback) {
    let valid = true;
    let count = 0;
    // 如果需要验证的fields为空，调用验证时立刻返回callback
    if (this.fields.length === 0 && callback) {
      callback(true);
    }
    let invalidFields = {};
    
    this.fields.forEach(field => {
      // 第一个参数为空，校验全部
      field.validate('', (message, field) => {
        // 回调message有值，代码校验没通过
        if (message) {
          valid = false;
        }
        invalidFields = objectAssign({}, invalidFields, field);
        // 全部校验都完成执行callback
        if (typeof callback === 'function' && ++count === this.fields.length) {
          callback(valid, invalidFields);
        }
      });
    });
  }
}
```

**form-item.vue**
```javascript
<template>
  <div class="custom-form-item">
    <span>{{label}}</span>
    <slot></slot>
    <slot v-if="validateState === 'error'" name="error" :error="validateMessage">
      <div class="x-form-item__error">
        {{validateMessage}}
      </div>
    </slot>
  </div>
</template>

import AsyncValidator from 'async-validator';

export default {
  data() {
    return {
      validateState: '',
      validateMessage: '',
      validateDisabled: false,
      validator: {}
    };
  },
  computed: {
    fieldValue () {
      const model = this.form.model;
      if (!model || !this.prop) { return; }

      let path = this.prop;
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.');
      }

      return getPropByPath(model, path, true).v;
    }
  },
  methods: {
    validate(trigger, callback = noop) {
      this.validateDisabled = false;
      const rules = this.getFilteredRule(trigger);
      if ((!rules || rules.length === 0) && this.required === undefined) {
        callback();
        return true;
      }
      // async-validator库写法
      this.validateState = 'validating';

      const descriptor = {};
      if (rules && rules.length > 0) {
        rules.forEach(rule => {
          delete rule.trigger;
        });
      }
      descriptor[this.prop] = rules;

      const validator = new AsyncValidator(descriptor);
      const model = {};

      model[this.prop] = this.fieldValue;

      validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
        this.validateState = !errors ? 'success' : 'error';
        this.validateMessage = errors ? errors[0].message : '';

        callback(this.validateMessage, invalidFields);
        this.elForm && this.elForm.$emit('validate', this.prop, !errors, this.validateMessage || null);
      });
    }
  }
}
```
