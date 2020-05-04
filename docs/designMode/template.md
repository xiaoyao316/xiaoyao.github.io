# 模板方法模式

**模板方法模式只需要使用继承就可以实现。它由抽象父类和具体的实现子类两部分组成。
抽象父类定义一个算法的骨架，而将一些步骤延迟到子类中，而子类可以在不改变一个算法结构的情况下可重定义该算法的某些特定步骤。**

> 煮咖啡、冲饮料，都需要经历`煮水`、`冲泡`、`倒进杯子`、`加调料`四步

```javascript
// 抽象父类
function Drinks(){}
Drinks.prototype.boilWater = function(){      // 公共方法
  console.log( '把水煮沸' )
}
Drinks.prototype.brew = function(){}          // 空方法，应该由子类重写
Drinks.prototype.pourInCup = function(){
  console.log( '倒进杯子' )
}
Drinks.prototype.addCondiments = function(){} // 空方法，应该由子类重写
Drinks.prototype.init = function(){           // 定义子类的函数执行顺序
    this.boilWater()
    this.brew()
    this.pourInCup()
    this.addCondiments()
}

// Tea子类
function Tea(){}
Tea.prototype = new Drinks()
Tea.prototype.brew = function() {
  console.log('浸泡茶叶')
}
Tea.prototype.addCondiments = function() {
  console.log('加柠檬')
}

function Coffee(){}
Coffee.prototype = new Drinks()
Coffee.prototype.brew = function() {
  console.log('冲泡咖啡')
}
Coffee.prototype.addCondiments = function() {
  console.log('加糖')
}

const tea = new Tea()
tea.init()

const coffee = new Coffee()
coffee.init()
```

> 但如果有的人喝咖啡不爱加糖呢？我们可以使用`钩子方法`隔离变化

```javascript
// 抽象父类
function Drinks(){}
Drinks.prototype.boilWater = function(){      // 公共方法
  console.log( '把水煮沸' )
}
Drinks.prototype.brew = function(){}          // 空方法，应该由子类重写
Drinks.prototype.pourInCup = function(){
  console.log( '倒进杯子' )
}
Drinks.prototype.addCondiments = function(){} // 空方法，应该由子类重写
Drinks.prototype.init = function(){           // 定义子类的函数执行顺序
    this.boilWater()
    this.brew()
    this.pourInCup()
    if(this.shouldAddCondiments && this.shouldAddCondiments()) {
        this.addCondiments()
    }
}

// Tea子类
function Tea(){}
Tea.prototype = new Drinks()
Tea.prototype.brew = function() {
  console.log('浸泡茶叶')
}
Tea.prototype.addCondiments = function() {
  console.log('加柠檬')
}

function Coffee(){}
Coffee.prototype = new Drinks()
Coffee.prototype.brew = function() {
  console.log('冲泡咖啡')
}
Coffee.prototype.addCondiments = function() {
  console.log('加糖')
}
// 子对象定义钩子
Coffee.prototype.shouldAddCondiments = function () {
    return window.confirm("请问要加糖吗?")
}

const tea = new Tea()
tea.init()

const coffee = new Coffee()
coffee.init()
```


**以上是传统面向对象的实现，最后再用js高阶函数实现一遍**
```javascript
function Drinks(param){
  var boilWater = function(){
    console.log( '把水煮沸' )
  }
  var brew = param.brew || function (param) {
    throw new Error('子类必须实现brew方法')
  }
  var pourInCup = function (param) {
    console.log( '倒进杯子' )
  }
  var addCondiments = param.addCondiments || function (param) {
    throw new Error('子类必须实现addCondiments方法')
  }

  var F = function (){}
  F.prototype.init = function () {
    boilWater()
    brew()
    pourInCup()
    addCondiments()
  }
  return F
}
Drinks.prototype.brew = function(){}          // 空方法，应该由子类重写
Drinks.prototype.pourInCup = function(){
  console.log( '倒进杯子' )
}
Drinks.prototype.addCondiments = function(){} // 空方法，应该由子类重写
Drinks.prototype.init = function(){           // 定义子类的函数执行顺序
  this.boilWater()
  this.brew()
  this.pourInCup()
  if(this.shouldAddCondiments && this.shouldAddCondiments()) {
    this.addCondiments()
  }
}

var Tea = Drinks({
  brew: function () {
    console.log('浸泡茶叶')
  },
  addCondiments: function () {
    console.log('加柠檬')
  }
})

const tea = new Tea()
tea.init()
```