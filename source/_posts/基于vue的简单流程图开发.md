---
title: 基于vue的简单流程图开发
date: 2017-10-16 10:26:58
tags:
---

严重拖延症，一方面这项目模块纯属个人娱乐。另一方面，流程图这块涉及的东西还是蛮多的，这次也只是介绍一些简单的部分。拖了这么久，现在终于要开始硬着头皮写一篇基于vue+svg的流程图"伪教程"文章了。初次献丑，还请轻喷。

<!-- more -->

## 模块简介

[项目地址](https://github.com/leer0911/vue-flow)

![图片预览](https://leer0911.github.io/images/vueflow.png)

出于学习vue而非兼容的目的，本项目仅考虑现代浏览器( 谷歌 )，部分兼容问题还请见谅。

本模块的开发源于对流程图的简单需求( 纯UI实现，暂不存在业务逻辑 )，这里不赘诉vue-cli生成的目录结构(可以参考[这篇](http://www.jianshu.com/p/2769efeaa10a)或自行谷歌)。

项目实际用到的技术栈：SVG + vue + vuex

**功能介绍：**

- 画布缩放
- 节点( 开始,基础,判断等 )添加，删除
- 节点间连线( 直线/折线 )
- 文本添加
- 外部导入SVG图形
- 撤销与重做

## 画布缩放

考虑到画布缩放后布局需保持一致，这里通过修改`transform: scale(); transform-origin: ;` 来实现,节点则相对父层定位。

> TODO: SVG最优缩放解决方案?

## 节点相关

下面我简单说一下思路：

由于不存在业务逻辑，我把流程图简化为 `开始` `基础` `判断` 3个基础组件( 基于SVG )。

如:

```html
<template>
    <!-- 开始 -->
    <ellipse v-bind="style"></ellipse>
    <!-- 基础 -->
    <rect v-bind="style"></rect>
    <!-- 判断 -->
    <path v-bind="style"></path>
</template>
```

这里说一下判断这个组件( 后期可能出现复杂形状均以path实现 )，一般由AI软件直接导出相关形状。

左边工具栏跟画布中的相同图形源于同个组件，故设有两个样式，即 `defaultStyle` 和 `drawStyle`。之前有考虑过，如果流程图的图形复杂多变的话，那这种模式岂不是每一个组件都得人为定义。同样，采用导入SVG也有类似问题。因为如果图形大小都不确定的话，除了支持图形修改大小，否者将导致画布出现大小不一的图形。( 非常遗憾这方面没有做出突破，不过这将成为未来改进的方向。)

最开始采用的解决方案是以scale的方式，也就是统一让工具栏中的图形跟拖入画布中的图形成等比缩放关系。不过该方式会造成stroke也同比缩放，并非我们想要的。

所以目前暂时采用写死的方式。

注意: 在svg中 `ellipse` 定位相对于中心点，而rect定位是相对于左上角。

> TODO是否有办法将各组件定位源点设置为组件中心点。

### 节点渲染

节点渲染方面，由于之前是将图形作为组件，于是采用 `component + is` 的方式来渲染图形。同时也是以数据驱动的方式来渲染，即数据决定视图。

``` html
 <component v-for="(item,index) in nodeData" :is="item.type" :id="item.id" v-node inDraw></component>
```

拖动节点涉及镜像节点时：

``` html
<component :is="selNodeId" :transform="selNodeInfo.transform" v-if="isDragging" inDraw></component>
```

[代码直通车](https://github.com/leer0911/vue-flow/blob/master/src/views/flow/FlowMainCont.vue#L29)

### 新增节点

`drag` `drop` 的形式。采用该方式的好处是不需要模拟拖拽事件。也就是镜像什么的不需要自己做。( 画布内节点拖拽则使用原生模拟 )

[代码直通车](https://github.com/leer0911/vue-flow/blob/master/src/views/flow/FlowMainCont.vue#L401)


对节点的操作均以指令( directives )的形式( 直接操作DOM )。这引发了我对该类项目是否适合用vue类框架来做的疑问，从开发效率方面，还是首选vue，但是从性能方面，由于没有深入研究，并没有发言权。

> TODO 场景模拟，假设我们需要移动画布内节点，通过directives的el来获取节点，然后通过`el.onmousemove`来修改data中对应的translate来实现位置的更改。这里修改data来驱动视图是我们常用的方式，但是我想不通的就是`el.onmousemove`来修改data实现的双向数据绑定所带来的性能在这里是否有体现。

我所设想的是，是否涉及多依赖的时候，diff带来的性能提升才有价值。举个例子，我有一个列表，存在于data中的listData，然后在view中有多处关联listData。那此时操作listData比直接操作DOM来得更好些。

> 看过相关vitrualDOM的介绍，通过diff可以只操作变化的DOM。

### 获取SVG大小

获取节点大小使用 `getBoundingClientRect` ，同时由于前面做了缩放功能，这里获取节点大小时需要除以缩放比例来获取正确值。

```js
let obj = el.getElementsByTagName('g')[0]
let w = obj.getBoundingClientRect().width / _this.drawStyle.zoomRate
let h = obj.getBoundingClientRect().height / _this.drawStyle.zoomRate
let wh = {
    width: w,
    height: h
}
```

[代码直通车](https://github.com/leer0911/vue-flow/blob/master/src/views/flow/FlowMainCont.vue#L175)

### 节点操作总结

由于节点的显示是基于NodeData，所以增删其实就是对NodeData的增删。

[主要代码](https://github.com/leer0911/vue-flow/blob/master/src/views/flow/FlowMainCont.vue#L167)

## 连线相关

连线其实也只是用到了svg的`line`和`polyline`，这里跟节点类似，均以组件的形式存在，并以lineData驱动连线视图。所以最终连线的增删也是对数据的操作。

### 连接点的显示

<img src="https://leer0911.github.io/images/vueflow2.png" width="200">

首先是链接点的位置( 绿色远点位置 )，之前基于jquery做的流程图是用div布局，现在用svg增加了难度，由于svg不能使用position，所以无法基于当前元素定位。采用的是土办法，即用图形大小+padding动态获取4个点的位置。期间，由于4个连线节点与图形节点有空隙，当mouseover不处于图形或节点时，事件无法触发。在此是模拟一个区域来解决的。由于个人经验问题，这部分代码完全就是命令式的风格。勿喷

[代码直通车](https://github.com/leer0911/vue-flow/blob/master/src/views/flow/FlowMainCont.vue#L116)
[代码直通车2](https://github.com/leer0911/vue-flow/blob/master/src/views/flow/FlowMainCont.vue#L279)

### 连接处理

节点间连线做了两种情况：（这里不讲诉从mousedown至mouseup具体细节，可以看[这里](https://github.com/leer0911/vue-flow/blob/master/src/views/flow/FlowMainCont.vue#L492)）

其实很多人说，算法可以解决很多垃圾代码。可惜我还没掌握它的真谛，比如之前的图形组件，以及接下来的不同线条。其实都可以通过一定的算法得出来。我这里只讲讲最笨的方法，待我成长到能用算法来说话的时候，在回来好好理下这篇文章。

- line直线

直线无外乎就是两个点坐标，通过svg中的line来显示。这时候就得看项目的需求，我们假设最简单的情况，就是上面讲到过的4个连接点最为连线的起始或结束点。
下面是计算图形中4个点的坐标位置

```js

computeLine(direction, obj) { // low不止一点点
    let { top, left, width, height } = obj
    let w = width / 2
    let h = height / 2
    switch (direction) {
    case 't':
        top = top - h
        break
    case 'b':
        top = top + h
        break
    case 'l':
        left = left - w
        break
    case 'r':
        left = left + w
        break
    default:
        break
    }
    return { top, left }
}
```

- polyline折线

折线考虑的情况相对比较多一点，这边由于使用的是polyline，它的点位设置长这样子`points="125,96 183.5,96 183.5,399 242,399"`

这个时候一般会把字符转化为较为好操作的数组或对象。折线涉及的开始点跟结束点跟上面介绍直线的点位一样，不同的是中间线的位置，如果不考虑复杂的情况，

一般可以分为两种，上下，左右。通过获取开始与结束点的中点位置来确定中线即可以得到想要的折线。代码如下：（都是用简单粗暴的方式。）

```js
computePolyLine(start, end, direction) {
    let startPoint = {
    x: +(start.split(',')[0]),
    y: +(start.split(',')[1])
    }
    let endPoint = {
    x: +(end.split(',')[0]),
    y: +(end.split(',')[1])
    }
    let m1, m2
    switch (direction) {
    case 't':
    case 'b':
        let mY = startPoint.y + (endPoint.y - startPoint.y) / 2
        m1 = {
        x: startPoint.x,
        y: mY
        }
        m2 = {
        x: endPoint.x,
        y: mY
        }
        break
    case 'l':
    case 'r':
        let mX = startPoint.x + (endPoint.x - startPoint.x) / 2
        m1 = {
        x: mX,
        y: startPoint.y
        }
        m2 = {
        x: mX,
        y: endPoint.y
        }
        break
    default:
        break
    }
    return `${startPoint.x},${startPoint.y} ${m1.x},${m1.y} ${m2.x},${m2.y} ${endPoint.x},${endPoint.y}`
}
```

### 连线总结

节点跟连线在渲染以及操作的处理上大同小异，这里不确定是否为最佳实践的有两个地方，一是采用component+is的形式来渲染组件，二是采用 diretives的方式来操作DOM。连线的计算形式也略显简单，这确实是需要一定时间来成长的。扯偏了，在这简单总结一下，无论是哪种连线方式，我们需要做的就是正确获取对应点的位置，然后修改数据来驱动视图。不过能在各种复杂的情况下总结出算法，也是一种跨越，加油吧。

## 节点及连线的文本添加

节点及连线的文本添加原理都一样，这里采用的是设置 `contenteditable` 当contenteditable为true时，html结构自动添加文本节点并且可编辑。更多细节可以参考张鑫旭的[这篇](http://www.zhangxinxu.com/wordpress/tag/contenteditable/)

顺道讲一下`pointer-events`本模块有两个地方用到该css属性。一个是文本添加这块，以及头部工具栏部分。

CSS属性`pointer-events`允许作者控制特定的图形元素在何时成为鼠标事件的target。当未指定该属性时，SVG内容表现如同visiblePainted。

除了指定元素不成为鼠标事件的目标，none值还指示鼠标事件穿过该元素，并指向位于元素下面的元素。

更多细节关于`pointer-events`

[张鑫旭](http://www.zhangxinxu.com/wordpress/2011/12/css3-pointer-events-none-javascript/)
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/pointer-events)

> TODO 文本编辑虽已实现功能，但这块BUG较多，还未完善。

## 外部导入SVG

这边也是用到了HTML5的Drop功能，显示则是用到了svg的images。拖拽实现比较简单：

```js
dropHandle (e) {
    let reader = new FileReader()
    let file = e.dataTransfer.files[0]
    reader.onload = (e) => {
        this.userImages.push(e.target.result)
    }
    reader.readAsDataURL(file)
},
dragoverHandle () {
},
dragstart (imgSrc) {
    event.dataTransfer.setData('URL', imgSrc)
}
```

这边需要注意的是`@drop.stop.prevent="dropHandle"`  `@dragover.stop.prevent="dragoverHandle"`要阻止冒泡以及阻止浏览器默认行为。

还有一个要注意的是`dataTransfer.getData()`在dragover,dragenter,dragleave中无法获取数据的问题

根据W3C标准，drag data store有三种模式，Read/write mode, Read-only mode跟Protected mode。[细节](http://blog.csdn.net/azureternite/article/details/51415359)

Read/write mode
读/写模式，在dragstart事件中使用，可以添加新数据到drag data store中。

Read-only mode
只读模式，在drop事件中使用，可以读取被拖拽数据，不可添加新数据。

Protected mode
保护模式，在所有其他的事件中使用，数据的列表可以被枚举，但是数据本身不可用且不能添加新数据。



[深入](http://blog.csdn.net/liangklfang/article/details/48628171)

## 撤销与重做

这一功能本质上是没有完成的，因为采用了一种偷懒的方式，vuex 生成 State 快照，生产环境不建议使用。

基本原理就是通过vuex提交更高（mutation）来触发回调。以此来记录state 快照

[代码直通车](https://github.com/leer0911/vue-flow/blob/master/src/store/index.js#L8)

## 总结

本项目属于入门级的vue+vuex,但是并没有讲如何使用vue或者vuex，因为这些在官方文档其实都已经讲的非常清楚了。该项目也只是简单使用了如vue的自定义指令，MiXin等常用方法。诸如vue Render函数组件，不在本文谈论范围，这里简单讲下使用体验，render组件比较适合高自定义的组件（变化逻辑比较复杂）。因为一些简单组件其实更适合用tempalte的形式，虽然使用Render可以提高一定的性能( 减少了从tempalte到render这一步 )，但是很多现有的如sync，是render组件所不具备的（ 需自己实现 ）。vuex的使用，则需要注意的是object引用地址的问题。也就是说，要避免数据间的潜在影响。（虽然vuex自身也有规避这个问题）可以了解一下[immutable](http://facebook.github.io/immutable-js/docs/) 。

本教程主要讲述一个基于vue如何实现一个简单的流程图，更多引发的思考是，什么项目更适合使用这种MVVM模式的框架，以及如何发挥VitrualDOM的价值。其实上面几个章节的点随便拿个出来都可以深入探讨出很多技术问题，以后有机会再陆续深入。