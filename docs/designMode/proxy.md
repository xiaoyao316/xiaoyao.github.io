## 代理模式

**代理是一个对象，跟本体对象具有相同的接口，以此达到对本体对象的访问控制。
本体对象只注重业务逻辑的实现，代理则控制本体对象的实例化（何时实例化、何时被使用）**
>优点： 代理对象可以代替本体对象被实例化，此时本体对象未真正实例化，等到合适时机再实例化

下面实现一个最简单的代理
```javascript
// 女孩
function Girl(name) {
  this.name = name
}
// 男孩
function Boy(girl) {
  this.girl = girl
  this.sendGift = function (gift) {
    console.log(`Hi ${girl.name}, 男孩送你一个礼物：${gift}`)
  }
}
// 代理
function ProxyObj(girl) {
  this.girl = girl
  this.sendGift = function (gift) {
    (new Boy(girl)).sendGift(gift) // 替dudu送花咯
  }
};
var proxy = new ProxyObj(new Girl('韩梅梅'))
proxy.sendGift('黄冈密卷')
```
#### 代理模式的两个常用场景

一、图片加载

> 传统的解决方法是：在图片未加载完成之前，使用一个loading图标作为占位符，等图片完成加载后，再使用真实的图片地址替代loading图标。
```javascript
var myImage = (function(){
  var imgNode = document.createElement('img')
  document.body.appendChild(imgNode)
  var img = new Image()
  img.onload = function(){
    imgNode.src = this.src
  }
  return {
    setSrc: function(src) {
      imgNode.src = 'http://img.lanrentuku.com/img/allimg/1212/5-121204193R0.gif'
      img.src = src
    }
  }
})();

myImage.setSrc('https://www.baidu.com/img/bd_logo1.png');
```
> 代理模式实现： myImage 函数只负责做一件事，创建img元素加入到页面中，其中的加载loading图片交给代理函数ProxyImage 去做，当
图片加载成功后，代理函数ProxyImage 会通知及执行myImage 函数的方法，同时当以后不需要代理对象的话，我们直接可以调用本体对象的方法。
```javascript
var myImage = (function(){
  var imgNode = document.createElement('img')
  document.body.appendChild(imgNode)
  return {
    setSrc: function(src) {
      imgNode.src = src
    }
  }
})()

var ProxyImage = (function(){
  var img = new Image()
  img.onload = function(){
    myImage.setSrc(this.src)
  }
  return {
    setSrc: function(src) {
      myImage.setSrc('http://img.lanrentuku.com/img/allimg/1212/5-121204193R0.gif')
      img.src = src
    }
  }
})()

ProxyImage.setSrc('https://www.baidu.com/img/bd_logo1.png')
```

二、缓存代理
> 对第一次运行的结果进行缓存，当再一次运行相同运算的时候，直接从缓存里面取，避免重复运算，如果运算非常复杂的话，对性能很耗费，那么使用缓存对象可以提高性能
```javascript
// 乘法
var mult = function(){
  var a = 1
  for(var i = 0,ilen = arguments.length; i < ilen; i+=1) {
    a *= arguments[i]
  }
  return a
}
// 加法
var plus = function(){
  var a = 0;
  for(var i = 0,ilen = arguments.length; i < ilen; i+=1) {
    a += arguments[i]
  }
  return a
}
// 代理函数
var proxyFunc = function(fn) {
  var cache = {}  // 缓存对象
  return function(){
    var args = Array.prototype.join.call(arguments, ',')
    if(args in cache) {
      return cache[args]   // 使用缓存代理
    }
    return cache[args] = fn.apply(this, arguments)
  }
}

var proxyMult = proxyFunc(mult)
console.log(proxyMult(1, 2, 3, 4))  // 24
console.log(proxyMult(1, 2, 3, 4))  // 缓存取 24

var proxyPlus = proxyFunc(plus)
console.log(proxyPlus(1, 2, 3, 4))  // 10
console.log(proxyPlus(1, 2, 3, 4))  // 缓存取 10
```


本章节转载自 [https://www.jianshu.com/p/46b0756c92a0](https://www.jianshu.com/p/46b0756c92a0).