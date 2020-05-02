# 策略模式

**核心: 定义一系列的算法，单独封装，并可以相互替换**

每年都会淘宝上森马旗舰店买衣服，里面就有一些不同的计价规则（算法）。
```javascript
function calcPrice(type, price) {
    // 新人，满300-100
    if(type === 'fresh') {
        if(price >= 300) {
            return price - 100
        }
        return price
    }
    // 老顾客，满300-50
    if(type === 'old') {
        if(price >= 300) {
            return price - 50
        }
        return price
    }
}
```
突然有一天又要加规则，成为会员，直接8折
```javascript
function calcPrice(type, price) {
    // 新人，满300-100
    if(type === 'fresh') {
        if(price >= 300) {
            return price - 100
        }
        return price
    }
    // 老顾客，满300-50
    if(type === 'old') {
        if(price >= 300) {
            return price - 50
        }
        return price
    }
    // 会员，一律8折
    if(type === 'member') {
        return price * 0.8
    }
}
```

功能上没什么问题，但是，一堆的if-else，如果下次再修改或添加规则，就不得不继续各种条件分支判断。
改完心里也没有底，还得每个分支测一遍。我们试着先分离一下判断与计算逻辑。

```javascript
function freshPrice(price) {
  if(price >= 300) {
    return price - 100
  }
  return price
}
function oldPrice(price) {
  if(price >= 300) {
    return price - 50
  }
  return price
}
function memberPrice(price) {
  return price * 0.8
}


function calcPrice(type, price) {
  // 新人，满300-100
  if(type === 'fresh') {
    return freshPrice(price)
  }
  // 老顾客，满300-50
  if(type === 'old') {
    return oldPrice(price)
  }
  // 会员，一律8折
  if(type === 'member') {
    return memberPrice(price)
  }
}
```
现在看上去舒服多了，但条件判断还是存在。细品，`calcPrice`里的if-else主要是在处理计算逻辑的分发。
在js中，`对象映射`不是可以更简洁的去实现吗？！
```javascript
var priceMap = {
  fresh: function (price) {
    if(price >= 300) {
      return price - 100
    }
    return price
  },
  old: function (price) {
    if(price >= 300) {
      return price - 50
    }
    return price
  },
  member: function (price) {
    return price * 0.8
  }
}

function calcPrice(type, price) {
  return priceMap[type](price)
}
```
以后再新增、修改计算规则，代码就很清晰了。这就是策略模式，定义一系列算法，单独封装，并可以相互替换。
