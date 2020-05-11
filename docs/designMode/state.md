# 状态模式

**状态模式允许一个对象在其内部状态改变的时候改变它的行为，对象看起来似乎修改了它的类。
  其实就是用一个对象或者数组记录一组状态，每个状态对应一个实现，实现的时候根据状态挨个去运行实现。**
  
-------
  
使用场景：
- 一个对象的行为取决于它的状态，并且它必须在运行时刻根据状态改变它的行为。
-  一个操作中含有大量的分支语句，而且这些分支语句依赖于该对象的状态。
  
> 超级玛丽
```javascript
const SuperMarry = (function() {    
  let _currentState = [],        // 状态数组
      states = {
        jump() {console.log('跳跃!')},
        move() {console.log('移动!')},
        shoot() {console.log('射击!')},
        squat() {console.log('蹲下!')}
      }
  
  const Action = {
    changeState(arr) {  // 更改当前动作
      _currentState = arr
      return this
    },
    goes() {
      console.log('触发动作')
      _currentState.forEach(T => states[T] && states[T]())
      return this
    }
  }
  
  return {
    change: Action.changeState,
    go: Action.goes
  }
})()

SuperMarry
    .change(['jump', 'shoot']) // 触发动作
    .go()                      // 跳跃!  射击!
    .go()                      // 跳跃!  射击!
    .change(['squat'])         // 触发动作
    .go()                      // 蹲下!
```

> es6版
```javascript
class SuperMarry {
  constructor() {
    this._currentState = []
    this.states = {
      jump() {console.log('跳跃!')},
      move() {console.log('移动!')},
      shoot() {console.log('射击!')},
      squat() {console.log('蹲下!')}
    }
  }
  
  change(arr) {  // 更改当前动作
    this._currentState = arr
    return this
  }
  
  go() {
    console.log('触发动作')
    this._currentState.forEach(T => this.states[T] && this.states[T]())
    return this
  }
}

new SuperMarry()
    .change(['jump', 'shoot'])  // 触发动作
    .go()                       // 跳跃!  射击!
    .go()                       // 跳跃!  射击!
    .change(['squat'])          // 触发动作
    .go()                       // 蹲下!
```
