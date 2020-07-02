# compose

> compose函数指的是对要嵌套执行的函数进行平铺，嵌套执行指的是一个函数的返回结果作为另一个函数的执行参数。核心思想是专注于函数执行过程，隔离数据的影响。

**有这样一个需求, 求一个数的10倍, 再加1的值**

```javascript
let calculate  = x => x * 10 + 1
let a = calculate(1)
console.log(a)  // 11
```

**稍微复杂一点，上面的编码方式都会很难维护，用函数式编程的思想拆分一下。**
```javascript
let add = x => x + 1
let multiple = x => x * 10
let a = add(multiple(1))
console.log(a)  // 11
```

**假设这是一个很长的链条，会看到无数个圆括号，如果有一天需要修改顺序，肯定很头疼。继续优化。**
```javascript
let add = x => x + 1
let multiple = x => x * 10

let compose = (a, b)=>{
  return function (x){
    return a(b(x));
  }
}

let a = compose(add, multiple)
console.log(a(1))  // 11
```

**再让 compose 函数具备通用性**
```javascript
let add = x => x + 1
let multiple = x => x * 10

let compose = function() {
  let args = [].slice.call(arguments);
  return function (x) {
    return args.reduceRight(function(res, cb){
      return cb(res);
    }, x)
  }
}

let a = compose(add, multiple)
console.log(a(1))  // 11
```

> Notice: 执行顺序是从右到左，和参数顺序是相反的, 这也是webpack中loader从右到左执行的原因

**同理，实现一个通用的从左到右执行的pipe函数**
```javascript
let add = x => x + 1
let multiple = x => x * 10

const pipe = function () {
  let args = [].slice.call(arguments);
  return function (x) {
    return args.reduce(function (res, cb) {
      return cb(res);
    }, x)
  }
}

let a = pipe(multiple, add)
console.log(a(1))  // 11
```