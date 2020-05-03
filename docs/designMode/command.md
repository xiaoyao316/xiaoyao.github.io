# 命令模式

**命令模式中的命令指的是一个执行某些特定事情的指令。常见的场景是，需要向某些对象发送请求，但是并不知道请求的接受者是谁，也不知道被请求的操作是什么。
此时希望用一种松耦合的方式来设计程序，使得请求发送者和请求接收者能够消除彼此之间的耦合关系**

> *点外卖时，客户需要向商家下单，但是商家是人是狗，是微波加热剩菜剩饭还是买份路边摊，who care? 反正你只需要发送下单指令`command`就行了。*

```javascript
var customer = {
    name: '灰大狼'
}
var store = {
  makeFood: function (food) {
    console.log('加热一下昨天剩下的' + food)
  },
  sendFood: function (customer) {
    console.log('打包给', customer.name)
  }
}

function OrderCommand(receiver, food) { // 命令对象
  this.receiver = receiver
  this.food = food
}

OrderCommand.prototype.execute = function (store) { // 提供执行方法, 通常命名为execute
  store.makeFood(this.food)
  store.sendFood(this.receiver)
}

// 下单，命令执行
var command = new OrderCommand(customer, '麻辣香锅')
command.execute(store)
```

宏命令

**一组命令的集合，通过执行宏命令的方式，一次执行一批命令**
```javascript
class MacroCommand {
  constructor() {
    this.commandsList = []
  }
  add(command) {
    this.commandsList.push(command)
    return this
  }
  execute(){
    for(var i = 0, l = this.commandsList.length; i < l; i++) {
      this.commandsList[i].execute()
    }
    return this
  }
}

var command1 = {
    execute: () => console.log(1)
}
var command2 = {
    execute: () => console.log(2)
}

var command = new MacroCommand()
command.add(command1).add(command2).execute()
```
