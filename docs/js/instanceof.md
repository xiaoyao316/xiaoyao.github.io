# instanceof

> 原理： 判断被检测对象的原型对象（prototype）是否在目标对象的原型链上

```javascript
function myInstanceof(left, right) {
  let leftProp = left.__proto__;
  let rightProp = right.prototype;
  // 一直会执行循环  直到函数return
  while (true) {
    // 遍历到了原型链最顶层
    if (leftProp === null) {
      return false;
    }
    if (leftProp === rightProp) {
      return true;
    } else {
      // 遍历赋值__proto__做对比
      leftProp = leftProp.__proto__;
    }
  }
}

let a = [];
console.log(myInstanceof(a, Array));
```
