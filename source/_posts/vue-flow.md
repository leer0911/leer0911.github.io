---
title: vue-flow
date: 2017-10-16 10:26:58
tags:
---

严重拖延症，一方面这项目模块纯属个人娱乐。另一方面，精力( 能力 )不足。好的，现在终于要开始硬着头皮写一篇基于vue+svg的流程图"伪教程"文章了。初次献丑，还请轻喷。

<!-- more -->

## 模块简介

[项目地址](https://github.com/leer0911/vue-flow)

[其他用心在做的vue项目](https://juejin.im/post/59097cd7a22b9d0065fb61d2)

出于学习vue而非兼容的目的，本项目仅考虑现代浏览器( 谷歌 )，部分兼容问题还请见谅。

本模块的开发源于对流程图的简单需求( 纯UI实现，暂不存在业务逻辑 )，这里不赘诉vue-cli生成的目录结构(可以参考[这篇](http://www.jianshu.com/p/2769efeaa10a)或自行谷歌)。

项目实际用到的技术栈：SVG + vue + vuex

**功能介绍：**

- 画布缩放
- 节点( 开始,基础,判断等 )添加，删除
- 节点间连线( 直线/折线 )
- 外部导入SVG图形
- 撤销与重做

## 画布缩放

考虑到画布缩放后布局需保持一致，这里通过修改`transform: scale(); transform-origin: ;` 来实现,节点相对父层定位。

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

注意: `ellipse` 定位相对于中心点，而rect定位是相对于左上角。

左边工具栏跟画布中的相同图形源于同个组件，故设有两个样式，即 `defaultStyle` 和 `drawStyle`。之前有考虑过，如果流程图的图形复杂多变的话，那这种模式岂不是每一个组件都得人为定义。同样采用导入SVG也有类似问题。因为如果图形大小都不确定的话，除了支持修改大小，否者将无法统一风格。( 非常遗憾这方面没有做出突破，不过这将成为未来改进的方向。)

最开始是采用scale的方式，也就是在工具栏中的图形跟画布中的成等比缩放关系。不过该方式会造成stroke也同比缩放，并非我们想要的。所以目前暂时采用这种低效的方式。

> TODO是否有办法将各组件定位源点设置为组件中心点。

### 节点渲染

节点渲染方面，由于之前是将图形作为组件，于是采用 `component + is` 的方式来渲染图形。同时也是以数据驱动的方式来渲染，即数据之间决定视图。

``` html
 <component v-for="(item,index) in nodeData" :is="item.type" :id="item.id" v-node inDraw></component>
```

拖动节点涉及镜像节点时：

``` html
<component :is="selNodeId" :transform="selNodeInfo.transform" v-if="isDragging" inDraw></component>
```

### 新增节点

`drag` `drop` 的形式。采用该方式的好处是不需要模拟拖拽事件。也就是镜像什么的不需要自己做。( 画布内节点拖拽则使用原生模拟 )

对节点的操作均以指令( directives )的形式( 直接操作DOM )。这引发了我对该类项目是否适合用vue类框架来做的疑问，从开发效率方面，还是首选vue，但是从性能方面，由于没有深入研究，并没有发言权。

> TODO 场景模拟，假设我们需要移动画布内节点，通过directives的el来获取节点，然后通过`el.onmouseover`来修改data中对应的translate来实现位置的更改。这里修改data来驱动视图是我们常用的方式，但是我想不通的就是`el.onmouseover`来修改data实现的双向数据绑定所带来的性能在这里是否有体现。

我所设想的是，是否涉及多依赖的时候，diff带来的性能提升才有价值。举个例子，我有一个列表，存在于data中的listData，然后在view中有多处关联listData。那此时操作listData比直接操作DOM来得更好些。

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

### 节点操作总结

由于节点的显示是基于NodeData，所以增删其实就是对NodeData的操作。