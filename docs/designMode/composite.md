# 组合模式

**组合模式就是用小的子对象来构建更大的对象。组合模式除了要求组合对象和叶对象拥有相同的接口之外，还有一个必要条件，就是对一组叶对象的操作必须具有一致性**

> 优点：组合模式将对象组合成树形结构，以表示“部分-整体”的层次结构。 除了用来表示树形结构之外，组合模式的另一个好处是通过对象的多态性表现，使得用户对单个对象和组合对象的使用具有一致性。

> 缺点：因为组合对象的任何操作都会对所有的子对象调用同样的操作，所以当组合的结构很大时会有性能问题。

以文件夹扫描为例
```javascript
function Folder(name) {
  this.name = name
  this.files = []
}
Folder.prototype.add = function (file) {
  this.files.push(file)
}
Folder.prototype.scan = function () {
  console.log('开始扫描文件夹: ' + this.name);
  for (var i = 0, file, files = this.files; file = files[i++];) {
    file.scan()
  }
}

function File(name) {
  this.name = name
}
File.prototype.add = function () {
  throw new Error('文件下面不能再添加文件')
}
File.prototype.scan = function () {
  console.log('开始扫描文件: ' + this.name)
}

var folder = new Folder('学习资料');
var folder1 = new Folder('JavaScript');
var folder2 = new Folder('jQuery');
var file1 = new File('JavaScript 设计模式与开发实践');
var file2 = new File('精通jQuery');
var file3 = new File('重构与模式')
folder1.add(file1);
folder2.add(file2);
folder.add(folder1);
folder.add(folder2);
folder.add(file3);

var folder3 = new Folder('Nodejs');
var file4 = new File('深入浅出Node.js');
folder3.add(file4);
var file5 = new File('JavaScript 语言精髓与编程实践');

folder.add(folder3);
folder.add(file5);

folder.scan();
```

上面的组合对象中，保存了它下面的子节点的引用，当我们执行`scan`时，它是由上到下的。
但我们有时候需要让请求从下到上的冒泡传递，比如，删除文件，实际是从它的上层文件夹中删除。

```javascript
function Folder(name) {
  this.name = name
  this.parent = null //增加this.parent 属性
  this.files = []
}

Folder.prototype.add = function (file) {
  file.parent = this //设置父对象
  this.files.push(file)
}

Folder.prototype.scan = function () {
  console.log('开始扫描文件夹: ' + this.name)
  for (var i = 0, file, files = this.files; file = files[i++];) {
    file.scan()
  }
}

Folder.prototype.remove = function () {
  if (!this.parent) { //根节点或者树外的游离节点
    return
  }
  for (var files = this.parent.files, l = files.length - 1; l >= 0; l--) {
    var file = files[l]
    if (file === this) {
      files.splice(l, 1)
    }
  }
}

function File(name) {
  this.name = name
  this.parent = null
}

File.prototype.add = function () {
  throw new Error('不能添加在文件下面');
}

File.prototype.scan = function () {
  console.log('开始扫描文件: ' + this.name);
}

File.prototype.remove = function () {
  if (!this.parent) { //根节点或者树外的游离节点
    return;
  }
  for (var files = this.parent.files, l = files.length - 1; l >= 0; l--) {
    var file = files[l]
    if (file === this) {
      files.splice(l, 1)
    }
  }
}

var folder = new Folder('学习资料')
var folder1 = new Folder('JavaScript')
var file1 = new Folder('深入浅出Node.js')

folder1.add(new File('JavaScript 设计模式与开发实践'))
folder.add(folder1)
folder.add(file1)
folder1.remove()
folder.scan()
```