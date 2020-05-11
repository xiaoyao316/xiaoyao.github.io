# 防抖和节流
  
> 防抖：N秒内函数只会被执行一次，如果 N 秒内再次被触发，则重新计算延迟时间。

```javascript
function debounce(fn, delay) {
  //默认300毫秒
  let timer;
  return function() {
    var args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args); // 改变this指向为调用debounce所指的对象
    }, delay);
  };
}

window.addEventListener(
  "scroll",
  debance(() => {
    console.log(111);
  }, 1000)
);
```

> 节流: 规定一个单位时间，在这个单位时间内最多只能触发一次函数执行。

```javascript
//方法一：设置一个标志
function throttle(fn, delay) {
  let flag = true;
  return () => {
    if (!flag) return;
    flag = false;
    timer = setTimeout(() => {
      fn();
      flag = true;
    }, delay);
  };
}

//方法二：使用时间戳
function throttle(fn, delay) {
  let startTime = new Date();
  return () => {
    let endTime = new Date();
    if (endTime - startTime >= delay) {
      fn();
      startTime = endTime;
    } else {
      return;
    }
  };
}
window.addEventListener(
  "scroll",
  throttle(() => {
    console.log(111);
  }, 1000)
);
```

