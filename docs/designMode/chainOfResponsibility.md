# 职责链模式

**职责链模式的定义是使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。**

> ATM取款为例

```javascript
function MoneyStack(billSize) {
    this.billSize = billSize
    this.next = null
}
MoneyStack.prototype = {
  withdraw: function(amount) {
    var numOfBills = Math.floor(amount / this.billSize)
    if (numOfBills > 0) {
      this._ejectMoney(numOfBills)
    }
    // 如果职责链没完成（钱没取完）且存在下一个职责节点，那就继续执行
    amount = amount - (this.billSize * numOfBills)
    amount > 0 && this.next && this.next.withdraw(amount)
  },
  // 设置下一个职责链节点
  setNextStack: function(stack) {
    this.next = stack
  },
  _ejectMoney: function(numOfBills) {
    console.log(`取出${numOfBills}张${this.billSize}元钞票`)
  }
}

function Atm() {
    // 创建职责
    let stack100 = new MoneyStack(100);
    let stack50 = new MoneyStack(50);
    let stack20 = new MoneyStack(20);
    let stack10 = new MoneyStack(10);
    let stack5 = new MoneyStack(5);
    let stack1 = new MoneyStack(1);
    // 组织顺序
    stack100.setNextStack(stack50);
    stack50.setNextStack(stack20);
    stack20.setNextStack(stack10);
    stack10.setNextStack(stack5);
    stack5.setNextStack(stack1);
    // 设置从哪个职责链节点开始
    this.moneyStacks = stack100;
}
Atm.prototype.withdraw = function(amount) {
  this.moneyStacks.withdraw(amount)
}

let atm = new Atm();
atm.withdraw(286);
```

> 更多时候我们需要灵活地增加、移除和修改链中的节点顺序

```javascript
function order500( orderType, pay, stock ) {
  if ( orderType === 1 && pay === true ) {
    console.log( '500 元定金预购，得到100 优惠券' )
  } else {
    return 'nextSuccessor'
  }
}

function order200( orderType, pay, stock ) {
  if ( orderType === 2 && pay === true ){
    console.log( '200 元定金预购，得到50 优惠券' )
  } else {
    return 'nextSuccessor'
  }
}

function orderNormal( orderType, pay, stock ) {
  if ( stock > 0 ){
    console.log( '普通购买，无优惠券' )
  } else {
    console.log( '手机库存不足' )
  }
}

function Chain( fn ){
  this.fn = fn
  this.successor = null
}

Chain.prototype.setNextSuccessor = function( successor ){
  return this.successor = successor
}

Chain.prototype.passRequest = function(){
  var ret = this.fn.apply( this, arguments )
  if ( ret === 'nextSuccessor' ){
    return this.successor && this.successor.passRequest.apply( this.successor, arguments )
  }
  return ret
}

var chainOrder500 = new Chain( order500 )
var chainOrder200 = new Chain( order200 )
var chainOrderNormal = new Chain( orderNormal )

chainOrder500.setNextSuccessor( chainOrder200 )
chainOrder200.setNextSuccessor( chainOrderNormal )

chainOrder500.passRequest(2, true, 10)  // 200 元定金预购，得到50 优惠券
chainOrder500.passRequest(3, false, 10) // 普通购买，无优惠券
chainOrder500.passRequest(3, false, 0)  // 手机库存不足
```

接下来如果想对职责链进行增、删、改就很简单了