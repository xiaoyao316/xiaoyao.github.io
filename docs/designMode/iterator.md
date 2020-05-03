# 迭代器模式

**迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。
迭代器模式可以把迭代的过程从业务逻辑中分离出来，在使用迭代器模式之后，即使不关心对象的内部构造，也可以按顺序访问其中的每个元素。**

**迭代器分为内部迭代器和外部迭代器，它们有各自的使用场景。**

- 内部迭代器
```javascript
function each(ary, callback) {
  for (var i = 0; i < ary.length; i++) {
    callback(i, ary[i])
  }
}
each([2, 4, 6, 8, 10], function (i, item) {
  console.log(i, item)
})
```
> 优点：内部迭代器在调用的时候非常方便，外界不用关心迭代器内部的实现，跟迭代器的交互也仅 仅是一次初始调用。

> 缺点：由于内部迭代器的迭代规则已经被提前规 定，上面的 each 函数就无法同时迭代2个数组，如下代码就显得不太优雅。

```javascript
function each(ary, callback) {
  for (var i = 0; i < ary.length; i++) {
    callback(i, ary[i])
  }
}

var compare = function(ary1, ary2){
  if (ary1.length !== ary2.length){
    throw new Error('不相等')
  }
  each(ary1, function(i, n){
    if (n !== ary2[ i ]){
      throw new Error('不相等')
    }
  });
  console.log('相等')
}
compare([1, 2, 3], [1, 2, 3])
compare([1, 2, 3], [1, 2, 4])
```


- 外部迭代器
> 外部迭代器必须显式地请求迭代下一个元素
```javascript
function Iterator(ary) {
  this.ary = ary
  this.index = 0
}

Iterator.prototype.isDone = function () {
  return this.index >= this.ary.length
}

Iterator.prototype.next = function () {
  this.index++
}
Iterator.prototype.getCurrItem = function () {
  return this.ary[this.index]
}

function compare(iterator1, iterator2) {
  while (!iterator1.isDone() || !iterator2.isDone()) {
    if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
      return false
    }
    iterator1.next()
    iterator2.next()
  }
  return true
}

var a = new Iterator([1, 2, 3])
var b = new Iterator([1, 2, 3, 4])
var c = compare(a, b)
console.log(c)
```


另外还有迭代器的两种常见处理，倒序和中止
```javascript
// 倒序
function reverseEach(ary, callback) {
  for(var i = ary.length - 1; i >= 0; i--) {
    callback(i, ary[i])
  }
}
reverseEach([3, 2, 1], function (i, n) {
  console.log(n) // 1 2 3
})
```
```javascript
// 中止
function reverseEach(ary, callback) {
  for(var i = ary.length - 1; i >= 0; i--) {
    if(callback(i, ary[i]) === false) {
      break
    }
  }
}
reverseEach([3, 2, 1], function (i, n) {
  if(n > 2) {
    return false
  }
  console.log(n) // 1 2
})
```