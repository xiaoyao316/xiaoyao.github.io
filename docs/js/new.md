# new 操作符

> 常规用法
```javascript
function Fn (name) {
  this.name = name
}
Fn.prototype.getName = function () {
  console.log(this.name)
}

var f1 = new Fn('小王')
f1.getName() // 小王
```

> 回顾一下new一个对象的过程之常规解释

- 创建一个空对象，将它的引用赋给 this，继承函数的原型；
- 通过 this 将属性和方法添加至这个对象；
- 最后返回 this 指向的新对象，也就是实例（如果没有手动返回其他的对象）。

> 开撸
```javascript
function Fn (name) {
  this.name = name
}
Fn.prototype.getName = function () {
  console.log(this.name)
}

function _new (Fn, ...arg) {
    let obj = {}
    obj.__proto__ = Fn.prototype
    Fn.apply(obj, arg);
    return obj
}

var f1 = _new(Fn, '小王')
f1.getName()
```

> 使用Object.create

```javascript
function Fn (name, age) {
  this.name = name
  this.age = age
}
Fn.prototype.getName = function () {
  console.log(this.name)
}

function _new (Fn, ...arg) {
    let obj = Object.create(Fn.prototype);
    Fn.apply(obj, arg);
    return obj;
}

var f1 = _new(Fn, '小王', 4)
f1.getName()
```
