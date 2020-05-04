# 享元模式

**享元模式，主要是运用共享技术，有效地支持大量的细粒度的对象。它把数据和方法划分成内部数据、外部数据、内部方法和外部方法。
内部数据和内部方法是相似的或者共有的，把内部数据和内部方法提取出来，进而减少性能开销。**

> 现有一个新闻列表的页面，每页显示5条新闻。当点击页面中的“下一页”时，即实现新闻列表的翻页功能。在这个需求中，我们知道，每次翻页，页面结构中变化的只是新闻元素（如新闻标题、时间、图片等），但新闻的容器盒子是没有变化的。

```javascript
// 享元模式
var FlyWeight = function() {
    // 已创建的元素池，用于优化，避免反复创建元素
    var created = [];
    // 创建一个新闻容器
    function create() {
        var dom = document.createElement('div'); // 一条新闻的容器
        document.getElementById('page').appendChild(dom);
        // 缓存新创建的元素
        created.push(dom);
        return dom;
    }
    return {
        // 获取新闻元素
        getDiv: function() {
            // 每页显示5条新闻
            if (created.length < 5) {
                return create();
            } else {
                // 获取第一个元素，并插入至最后
                var div = created.shift();
                created.push(div);
                return div;
            }
        }
    }
}();

// 使用上述封装的享元模式，实现需求
var page = 0, num = 5, len = article.length;
// 添加5条新闻
for (var i = 0; i<5; i++) {
    if (article[i]) {
        // 只更新内容，不重新创建容器
        FlyWeight.getDiv().innerHTML = article[i];
    }
}
// 给“下一页”按钮绑定翻页事件
document.getElementById('next-page').onclick = function() {
    if (article.length < 5) {
        return;
    }
    // 获取当前页的第一条新闻索引
    var n = ++page * num % len;
    // 插入5条新闻
    for (var j = 0; j<5; j++) {
        if (article[n+j]) {
            FlyWeight.getDiv().innerHTML = article[n+j];
        } else if (article[n+j-len]) {
            FlyWeight.getDiv().innerHTML = article[n+j-len];
        } else {
            FlyWeight.getDiv().innerHTML = "";
        }
    }
}
```

本章节转载自 [https://www.jianshu.com/p/56fdcec0c12a](https://www.jianshu.com/p/56fdcec0c12a).