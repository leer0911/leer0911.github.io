---
title: canvas
---

canvas负责在页面中设定一个区域，然后就可以通过JavaScript动态地在这个区域中绘制图形。canvas

# 基本用法

要使用canvas元素，必须先设置其width和height属性，指定可以绘图的区域大小。

要在这狂画布上绘图，需要取得绘图上下文。而取得绘图上下文对象的引用，需要调用getContext()方法并传入上下文的名字。传入"2D"，就可以取得2D上下文对象。

```javascript
var drawing = document.getElementById('drawing');
  if (drawing.getContext) {
    var context = drawing.getContext('2d');
  }
```

在使用canvas元素之前，首先要检测getContext()方法是否存在，这一步非常重要。有些浏览器会为HTML规范之外的元素创建默认的HTML元素对象。这种情况下，即使drawing变量中保存着一个有效的元素引用，也检测不到getContext()方法。

使用toDataURL()方法，可以导出在canvas元素上绘制的图像。这个方法接受一个参数，即图像的MIME类型格式，而且适合用于创建图像的任何上下文。比如要取得画布中的一副PNG格式的图像，可以使用以下代码。

```javascript
var drawing = document.getElementById("drawing");

  if (drawing.getContext) {
    //取得图像的数据URI
    var imgURI = drawing.toDataURL('image/png');

    var image = document.createElement('img');
    image.src = imgURI;
    document.body.appendChild(image);
  }
```

默认情况下，浏览器会将图像格式编码为PNG格式。

2D上下文的两种基本绘图操作时填充和描边。操作结果取决于两个属性：fillStyle和strokeStyle。这两个属性的值可以是字符串、渐变对象或模式对象，而且它们的默认值都是'#000'。

# 绘制矩形

矩形是唯一一种可以直接在2D上下文中绘制的形状。与矩形有关的方法包括fillRect()、strokeRect()和clearRect()。这三个方法都接收4个参数：矩形的x坐标、矩形的y坐标、矩形宽度和矩形高度。这些参数的单位都是像素。

首先，fillRect()方法在画布上绘制的矩形会填充指定的颜色。填充的颜色通过fillStyle属性指定，比如

```javascript
var drawing = document.getElementById('drawing');

  if (drawing.getContext) {
    var context = drawing.getContext('2d');
    context.fillStyle = '#f00';
    context.fillRect(10,10,50,50)
  }
```

strokeRect()方法再画布上绘制的矩形会使用指定的颜色描边。描边颜色通过strokeStyle属性指定。描边线条的宽度由lineWidth属性控制，该属性的值可以是任意整数。另外，通过lineCap属性可以控制线末端的形状是平头、圆头还是方头('butt'，'round'或'square')

通过lineJoin属性可以控制线条相交的方式是圆交、斜交还是斜接('round'、'bevel'或miter)。最后，clearRect()方法用于清除画布上的矩形区域。

# 绘制路径

2D绘制上下文支持很多在画布上绘制路径的方法。通过路径可以创造出复杂的形状和线条。要绘制路径，首先必须调用beginPath()方法。然后根据下列方法来实际绘制路径。

- arc(x,y,radius,startAngle,endAngle,counterclockwise)
- arcTo(x1,y1,x2,y2,radius)
- bezierCurveTo(c1x,c1y,c2x,c2y,x,y)
- lineTo(x,y)
- moveTo(x,y)

创建了路径后，接下来有几种可能的选择。如果想绘制一条连接到路径起点的线条，可以调用closePath()。如果路径已经完成，你想用fillStyle填充它，可以调用fill()方法。另外，还可以调用stroke()方法对路径描边。描边使用strokeStyle。最后还可以调用clip()，这个方法可以在路径上创建一个剪切区域。

在2D绘图上下文中，路径是一种主要的绘图方式，因为路径能为要绘制的图像提供更多控制。由于路径的使用很频繁，所以就有了一个名为isPointInpath()的方法。这个方法接收x和y坐标作为参数，用于在路径被关闭之前确定画布上的某一点是否位于路径上。

# 绘制文本

fillText()和strokeText()。这两个方法都可以接收4个参数：要绘制的文本字符串、x坐标、y坐标和可选的最大像素宽度。而且，这两个方法都以下列3个属性为基础。

- font
- textAlign
- textBaseline

# 变换

可以通过如下方法来修改变换矩阵。

- rotate
- scale
- translate(x,y)
- transform
- setTransform

# 绘制图像

```js
  var image = document.images[0];
  context.drawImage(image,10,10)
```

# 阴影
- shadowColor
- shadowOffsetX
- shadowOffsetY
- shadowBlur

# 模式
模式其实就是重复的图像。
