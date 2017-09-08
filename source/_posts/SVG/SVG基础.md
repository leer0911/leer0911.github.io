---
title: SVG基础
---

一个简单的SVG文档由`<svg>`根元素和基本的形状元素构成。另外还有一个g元素，它用来把若干个基本形状编成一个组。

- SVG的元素和属性必须按标准格式书写，因为XML是区分大小写的（这一点和html不同）
- SVG里的属性值必须用引号引起来，就算是数值也必须这样做。

# SVG文件的基本属性

- 最值得注意的一点是元素的渲染顺序。SVG文件全局有效的规则是"后来居上"，越后面的元素越可见。
- web上的svg文件可以直接在浏览器上展示，或者通过以下几种方法嵌入到HTML文件中：

  - 如果HTML是XHTML并且声明类型为application/xhtml+xml，可以直接把SVG嵌入到XML源码中。
  - 如果HTML是HTML5并且浏览器支持HTML5，同样可以直接嵌入SVG。然而为了符合HTML5标准，可能需要做一些语法调整。
  - 可以通过 object 元素引用SVG文件： `<object data="image.svg" type="image/svg+xml" />`
  - 类似的也可以使用 iframe 元素引用SVG文件： `<iframe src="image.svg"></iframe>`
  - 理论上同样可以使用 img 元素，但是在低于4.0版本的Firefox 中不起作用。
  - 最后SVG可以通过JavaScript动态创建并注入到HTML DOM中。 这样具有一个优点，可以对浏览器使用替代技术，在不能解析SVG的情况下，可以替换创建的内容。

**可以利用Network Monitor panel或者web-sniffer.net之类的网站来检查服务器是否给SVG文件发送正确的HTTP头，向web-sniffer.net提交你的一个SVG文件的链接，然后查看HTTTP 响应头。**

# 网格

对于所有元素，SVG使用的坐标系统或者说网格系统，和Canvas用的差不多（所有计算机绘图都差不多）。这种坐标系统是：以页面的左上角为(0,0)坐标点，坐标以像素为单位，x轴正方向是向右，y轴正方向是向下。注意，这和你小时候所教的绘图方式是相反的。但是在HTML文档中，元素都是用这种方式定位的。

# Fill 和 Stroke 属性

fill属性设置对象内部的颜色，stroke属性设置绘制对象的线条的颜色。

在SVG中你可以分别定义填充色和边框色的不透明度，属性fill-opacity控制填充色的不透明度，属性stroke-opacity控制描边的不透明度。

# 描边

- stroke-width属性定义了描边的宽度。
- stroke-linecap属性，控制边框终点的形状。三种可能值：

  - butt用直边结束线段，它是常规做法，线段边界90度垂直于描边的方向、贯穿它的终点。
  - square的效果差不多，但是会稍微超出实际路径的范围，超出的大小由stroke-width控制。
  - round表示边框的终点是圆角，圆角的半径也是由stroke-width控制的。

- stroke-linejoin属性，用来控制两条描边线段之间，用什么方式连接。它有三个可用的值，miter是默认值，表示用方形画笔在连接处形成尖角，round表示用圆角连接，实现平滑效果。最后还有一个值bevel，连接处会形成一个斜接。

- stroke-dasharray属性，将虚线类型应用在描边上

- fill-rule，用于定义如何给图形重叠的区域上色；
- stroke-miterlimit，定义什么情况下绘制或不绘制边框连接的miter效果；
- 还有stroke-dashoffset，定义虚线开始的位置。

# 用css定义样式

可以通过CSS来样式化填充和描边。语法和在html里使用CSS一样，只不过你要把background-color、border改成fill和stroke。注意，不是所有的属性都能用CSS来设置。上色和填充的部分一般是可以用CSS来设置的，比如fill，stroke，stroke-dasharray等，但是不包括下面会提到的渐变和图案等功能。另外，width、height，以及路径的命令等等，都不能用css设置。判断它们能不能用CSS设置还是比较容易的。

# 线性渐变

线性渐变沿着直线改变颜色，要插入一个线性渐变，你需要在SVG文件的defs元素内部，创建一个`<linearGradient>`节点。

# 图案

在我看来patterns（图案）是SVG中用到的最让人混淆的填充类型之一。它的功能非常强大，所以我认为他们值得讨论一下并且我们应至少对他们有最基本的了解。跟渐变一样，`<pattern>`需要放在SVG文档的`<defs>`内部。

# 文本

在一个SVG文档中，`<text>`元素内部可以放任何的文字。

- tspan

该元素用来标记大块文本的子部分，它必须是一个text元素或别的tspan元素的子元素。一个典型的用法是把句子中的一个词变成粗体红色。

- tref

terf元素允许引用已经定义的文本，高效地把它复制到当前位置。你可以使用xlink:href属性，把它指向一个元素，取得其文本内容。你可以独立于源样式化它、修改它的外观。

- textPath

该元素利用它的xlink:href属性取得一个任意路径，把字符对齐到路径，于是字体会环绕路径、顺着路径走：

# 基础变形

- 平移 `<rect x="0" y="0" width="10" height="10" transform="translate(30,40)" />`

- 旋转 `<rect x="20" y="20" width="20" height="20" transform="rotate(45)" />`

- 斜切 skewX()变形和skewY()变形

- 缩放 scale()变形改变了元素的尺寸
- 用matrix()实现复杂变形
- 坐标系统上的效果
- SVG嵌在SVG内部

# 剪切和遮罩

Clipping用来移除在别处定义的元素的部分内容。在这里，任何半透明效果都是不行的。它只能要么显示要么不显示。

Masking允许使用透明度和灰度值遮罩计算得的软边缘。

用opacity定义透明度,有一个简单方法可以用来为整个元素设置透明度。它就是opacity属性：
