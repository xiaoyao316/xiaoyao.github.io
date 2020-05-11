# call apply bind

> 手写源码

```javascript
Function.prototype.myCall = function(context, ...args) {
  if (!context || context === null) {
    context = window;
  }
  // 创造唯一的key值  作为我们构造的context内部方法名
  let fn = Symbol();
  context[fn] = this; //this指向调用call的函数
  // 执行函数并返回结果 相当于把自身作为传入的context的方法进行调用了
  return context[fn](...args);
};

// apply原理一致  只是第二个参数是传入的数组
Function.prototype.myApply = function(context, args) {
  if (!context || context === null) {
    context = window;
  }
  // 创造唯一的key值  作为我们构造的context内部方法名
  let fn = Symbol();
  context[fn] = this;
  // 执行函数并返回结果
  return context[fn](...args);
};

// apply原理一致  只是返回值是一个函数
Function.prototype.myBind = function(context, ...args) {
  if (!context || context === null) {
    context = window;
  }
  // 创造唯一的key值  作为我们构造的context内部方法名
  let fn = Symbol();
  context[fn] = this;
  // 返回函数
  return () => {
    context[fn](...args);
  };
};

// 测试一下
let obj = {
  a: 1
};
function fn(name, age) {
  console.log(this.a);
  console.log(name);
  console.log(age);
}
fn.myCall(obj, "我是lihua", "18");
fn.myApply(obj, ["我是lihua", "18"]);
let newFn = fn.myBind(obj, "我是lihua", "18");
newFn();
```

