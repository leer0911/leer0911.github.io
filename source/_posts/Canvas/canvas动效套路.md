---
title: canvas动效套路
---

# canvas画布的工作原理

canvas的工作原理和我们的显示器是一样的，都是不断的刷新绘制，刷新绘制，只不过显示器的刷新是实时的，而canvas的刷新手手动触发的，当然如果我们只想在canvas上实现静态的效果，是没必要不断刷新的。

举个简单例子，如果我们希望一个圆圈圈从画布左边移到画布右边的效果，我们可以在第1秒的时候让圆圈圈在最左边，然后下一秒的时候，先用黑板擦把我们的圆圈圈擦掉，然后再重新画圆圈圈再往右偏一点的样子，就这样不断擦不断绘，我们肉眼看到的就是一个动画效果了，有点类似于放电影。

```js
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
// 清除画布
context.clearRect(0, 0, canvas.width, canvas.height);
```

# canvas画布的不断绘制

在以前我们都是使用定时器进行绘制，但是现在建议使用requestAnimationFrame来实现刷新绘制，为了向下兼容，我们一般会做类似下面的处理：

```js
// requestAnimationFrame的向下兼容处理
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function(fn) {
      setTimeout(fn, 17);
  };
}

var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

// 画布渲染
var render = function () {
    // 清除画布
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制
    draw();

    // 继续渲染
    requestAnimationFrame(render);
};

render();
```

# 需要一个运动坐标变量

```js
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

// 坐标变量
var x = 0;

// 绘制方法
var draw = function () {
  ball.x = x;
};

// 画布渲染
var render = function () {
  // 清除画布
  context.clearRect(0, 0, canvas.width, canvas.height);

  // 位置变化
  x++;

  // 绘制
  draw();

  // 继续渲染
  requestAnimationFrame(render);
};

render();
```

通常有两种处理方法，一种是变量管理，有一个大变量，变量里面放的都是小变量，类似于`[{},{},{},...]`这种数据结构；还有一种是走实例化对象，变量存储在实例对象上，很显然，后面一种对变量的管理要更加方便和易于理解。

# 实例对象管理canvas图形颗粒变量

假设圆圈圈实例名称是Ball，则有：
```js
var Ball = function () {
  this.x = 0;

  this.draw = function () {
     // 根据此时x位置重新绘制圆圈圈
     // ...
  };
};
```

```js
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

// 存储实例
var store = {};

// 实例方法
var Ball = function () {
this.x = 0;

this.draw = function () {
   // 根据此时x位置重新绘制圆圈圈
   // ...
};
};

// 假设就一个圆圈圈
store[0] = new Ball();

// 绘制画布上所有的圆圈圈的方法
var draw = function () {
// 位置变化
store[0].x++;
// 根据新位置绘制圆圈圈
store[0].draw();
};

// 画布渲染
var render = function () {
// 清除画布
context.clearRect(0, 0, canvas.width, canvas.height);

// 绘制画布上所有的圆圈圈
draw();

// 继续渲染
requestAnimationFrame(render);
};

render();
```

# 随机多个实例对象坐标尺寸透明度等属性

假设现在有10个圆圈圈，如果每个圈圈的起始位置和运动速度都是一样的，是很无趣的，此时，我们就可以借助Math.random()构建随机属性，半径啊，位移速度啊，坐标都可以，如下代码：
```js
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

// 存储实例
var store = {};

// 实例方法
var Ball = function () {
    // 随机x坐标也就是横坐标，以及变化量moveX，以及半径r
    this.x = Math.random() * canvas.width;
    this.moveX = Math.random();
    this.r = 5 + 5 * Math.random();

    this.draw = function () {
       // 根据此时x位置重新绘制圆圈圈
       // ...
    };
};

// 假设10个圆圈圈
for (var indexBall = 0; indexBall < 10; indexBall += 1) {
    store[indexBall] = new Ball();
}

// 绘制画布上10个圆圈圈
var draw = function () {
    for (var index in store) {
        // 位置变化
        store[index].x += store[index].moveX;
        if (store[index].x > canvas.width) {
            // 移动到画布外部时候从左侧开始继续位移
            store[index].x = -2 * store[index].r;
        }
        // 根据新位置绘制圆圈圈
        store[index].draw();
    }
};

// 画布渲染
var render = function () {
    // 清除画布
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制画布上所有的圆圈圈
    draw();

    // 继续渲染
    requestAnimationFrame(render);
};

render();
```

# 补全圆圈圈的canvas绘制

```js
var Ball = function () {
  // 随机x坐标也就是横坐标，以及变化量moveX，以及半径r
  this.x = Math.random() * canvas.width;
  this.moveX = Math.random();
  this.r = 5 + 5 * Math.random();

  this.draw = function () {
     // 根据此时x位置重新绘制圆圈圈
     context.beginPath();
     context.fillStyle="#369";
     context.arc(this.x, canvas.height / 2, this.r, 0, Math.PI*2);
     context.closePath();
     context.fill();
  };
};
```

# 掌握常见的曲线函数

也就是要有一定的数学功力，无论是CSS3的transform变幻还是我们平时所见的各种动画效果，其本质上都是数学函数运动和矩阵变换，因此，要想再图形可视化以及视觉动效领域有所建树，数学不能差。

通常而言，常见的图形绘制，或者运动轨迹之类，都是需要借助数学函数的，比方所我早些年写过的抛物线相关的文章“JavaScript与元素间的抛物线轨迹运动”，又或者本文的六角星效果。这些图形绘制所需要的数学知识仅仅高中程度就可以，算是比较简单的，拿这里的六角星举例：

六角星实际上是两个等边三角形组成，且六个顶点正好在一个圆上，如下图所示：
```js
x=a+r*cosθ
y=b+r*sinθ

var arrPos = [
  [a + r * Math.cos(0), b + r * Math.sin(0)],
  [a + r * Math.cos(Math.PI * 2 / 3), b + r * Math.sin(Math.PI * 2 / 3)],
  [a + r * Math.cos(Math.PI * 2 / -3), b + r * Math.sin(Math.PI * 2 / -3)],
  [a + r * Math.cos(Math.PI / 3), b + r * Math.sin(Math.PI / 3)],
  [a + r * Math.cos(Math.PI / -3), b + r * Math.sin(Math.PI / -3)],
  [a + r * Math.cos(Math.PI), b + r * Math.sin(Math.PI)]
]

context.beginPath();
context.moveTo(arrPos[0][0], arrPos[0][1]);
context.lineTo(arrPos[1][0], arrPos[1][1]);
context.lineTo(arrPos[2][0], arrPos[2][1]);
context.closePath();
context.fillStyle = '#fff';
context.fill();

context.beginPath();
context.moveTo(arrPos[3][0], arrPos[3][1]);
context.lineTo(arrPos[4][0], arrPos[4][1]);
context.lineTo(arrPos[5][0], arrPos[5][1]);
context.closePath();
context.fillStyle = '#fff';
context.fill();
```
