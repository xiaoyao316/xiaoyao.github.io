# 中介者模式

**中介者模式是用来降低多个对象和类之间的通信复杂性。
这种模式通常提供一个中介对象，处理不同对象直接的通信，松耦合他们直接的关系，使代码易于维护。**

**中介对象主要是用来封装行为的，行为的参与者就是那些对象，但是通过中介者，这些对象不必相互知道。**


> 经典的斗地主场景
```javascript
function Person(name) {
  this.name = name
  this.chatroom = null
}

Person.prototype = {
  send: function(message, to) {
    this.chatroom.send(message, this, to);
  },
  receive: function(message, from) {
    console.log(`${from.name}对${this.name}说: ${message}`)
  }
}

function Chatroom() {
  var personMap = {}

  return {
    register: function(person) {
      personMap[person.name] = person
      person.chatroom = this
    },
    send: function(message, from, to) {
      if (to) {
        to.receive(message, from)
      } else {
        for (key in personMap) {
          if (personMap[key] !== from) {
            personMap[key].receive(message, from);
          }
        }
      }
    }
  }
}

var person1 = new Person('地主');
var person2 = new Person('农民1');
var person3 = new Person('农民2');
var chatroom = new Chatroom();

chatroom.register(person1);
chatroom.register(person2);
chatroom.register(person3);

person1.send('一对2，还剩一张啦'); // 地主还剩一张牌
person2.send('炸掉他，发个对子过来', person3);
person3.send('好的哥', person2);
person3.send('王炸, 一对三');
person1.send('WTF，过');
person2.send('一对四，你的牌打得也忒好啦');
```

优点：
- 降低了系统对象之间的耦合性，使得对象易于独立的被复用。
- 提高系统的灵活性，使得系统易于扩展和维护

缺点：
- 中介对象承担了较多的责任，一旦出现问题，整个系统就会受到重大影响。