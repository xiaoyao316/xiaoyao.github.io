# 单例模式

**核心: 确保仅有一个实例，并提供一个全局访问点**

先实现一个简单的单例

```javascript
var CreatePig = (function () {
    var instance;
    return function (name) {
        if(!instance) {
            this.name = name
            instance = this
        }
        return instance
    }
})()

var a = new CreatePig('one')
var b = new CreatePig('two')
console.log(a === b)
```
进一步抽象
```javascript
function CreatePig(name) {
    this.name = name
}
var ProxySingleton = (function () {
    var instance;
    return function (name) {
        if(!instance) {
            instance = new CreatePig(name)
        }
        return instance
    }
})()

var a = new ProxySingleton('one')
var b = new ProxySingleton('two')
console.log(a === b)
```
但是，单例模式从类中创建而来，是传统面向对象语言的实现。从本质上将，JavaScript是没有类的，es6中的类也不过是语法糖。
所以在JavaScript中，上面的实现方式并不适合，于是我们会把全局变量当成单例来使用。

在电脑上，计算器有且只有一个，正好可以用单例来实现
```javascript
var calculator = (function () {
    var div;
    return function () {
        if(!div) {
            div = document.createElement('div')
            div.innerHTML = "计算器"
            div.style.display = 'none'
            document.body.appendChild(div)
        }
        return div
    }
})()
document.onclick = function () {
    var calc = calculator()
    calc.style.display = 'block'
}
```
问题来了，日历、时钟也都只有一个，也可以用单例。那就再抽象一层。
```javascript
var getSingle = function (fn) { // 可通用
    var instance;
    return function () {
        return instance || (instance = fn.apply(this, arguments))
    }
}
var createCalculator = function () {
    var div = document.createElement('div')
    div.innerHTML = "这是计算器"
    div.style.display = 'none'
    document.body.appendChild(div)
    return div
}
var calculatorSingleton = getSingle(createCalculator)

document.onclick = function () {
    var calculator = calculatorSingleton()
    calculator.style.display = 'block'
}
```