---
title: flex布局
---

# Flex布局是什么

Flex是Flexible Box的缩写,意为"弹性布局"，设置为flex布局以后,子元素的float、clear和vertical-align属性将失效。

# 基本概念

采用Flex布局的元素，成为Flex容器(flex container)，简称"容器"。它的所有子元素自动成为容器成员，称为Flex项目(flex item)，简称"项目"。

容器默认存在两个轴：水平的主轴(main axis)和垂直的交叉轴(cross axis)。主轴的开始位置叫做`main strat`，结束的位置叫做`main end`;交叉轴的开始位置叫做`cross start`，结束位置叫做`cross end`。项目默认延主轴排列。单个项目占据的主轴空间叫做`main size`，占据交叉轴空间叫做`cross size`。

# 容器的属性

- `flex-direction`
- `flex-wrap`
- `flex-flow`
- `justify-content`
- `align-items`
- `align-content`

## flex-direction属性

flex-direction属性决定主轴的方向(即项目的排列方向)。

`flex-directon:row | row-reverse | column | column-reverse`

- `row`(默认值):主轴为水平方向，起点在左端。
- `row-reverse`:主轴为水平方向，起点在右端。
- `column`:主轴为垂直方向，起点在上沿。
- `column-reverse`:主轴为垂直方向，起点在下沿。

## flex-wrap属性

默认情况下,项目都排在一条线(又称"轴线")上。flex-wrap属性定义，如果一条轴线排不下，如何换行。

`flex-wrap:nowrap|wrap|wrap-reverse;`

- `nowrap`默认不换行。
- `wrap`:换行，第一行在上方。
- `wrap-reverse`:换行，第一行在下方。

## flex-flow

`flex-flow`属性是`flex-direction`属性和`flex-wrap`属性的简写形式，默认值为`row nowrap`。

`flex-flow:flex-direction||flex-wrap`

## justify-content属性

justify-content属性定义了项目在主轴上的对其方式。

`justify-content:flex-start|flex-end|center|space-between|space-around`

`flex-strat`默认值:左对齐 `flex-end`:右对齐 `center`:居中 `space-between`:两端对齐,项目之间的间隔都相等。 `space-around`:每个项目两侧的间隔相等。所以,项目之间的间隔比项目与边框的间隔大一倍。

## align-items属性

align-items属性定义项目在交叉轴上如何对齐。

`align-items:flex-strat|flex-end|center|baseline|stretch;`

- `flex-start`:交叉轴的起点对齐。
- `flex-end`:交叉轴的终点对齐。
- `center`:交叉轴的中点对齐。
- `baseline`:项目的第一行文字的基线对齐。
- `stretch`:默认值:如果项目未设置高度或设置为auto，将占满整个容器的高度。

## align-content属性

align-content属性定义了多根轴线的对齐方式。如果项目只有一个轴线，该属性不起作用。

`align-content:flex-start|flex-end|center|space-between|space-around|stretch`

- `flex-start`:与交叉轴的起点对齐。
- `flex-end`:与交叉轴的终点对齐。
- `center`:与交叉轴的中点对齐。
- `space-between`:与交叉轴两端对齐，轴线之间的间隔平均分布。
- `space-around`:每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
- `stretch`:默认值;轴线占满整个交叉轴。

# 项目的属性

- `order`
- `flex-grow`
- `flex-shrink`
- `flex-basis`
- `flex`
- `align-self`

## order属性

order属性定义项目的排列顺序。数值越小，排列越靠前，默认值为0。

`order:<interger>`

## flex-grow属性

flex-grow属性定义项目的放大比例,默认值为0，即如果存在剩余空间，也不放大。

`flex-grow:<number>`

如果所有项目的flex-grow属性都为1，则它们将等分剩余空间。如果一个项目的flex-grow属性为2，其他项目都为1,则前者占据的剩余空间将比其他项多一倍。

## flex-shrink属性

flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。

如果所有项目的flex-shrink属性都为1,当空间不足时,都将等比例缩小。如果有一个项目的flex-shrink属性为0，其他项目都为1时,当空间不足时,前者不缩小。负值对该属性无效。

## flex-basis属性

flex-basis属性定义了分配多余空间之前，项目占据主轴空间，浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。

`flex-basis:length|auto`

## flex属性

flex属性是flex-grow,flex-shrink和flex-basis的缩写，默认值为`0 1 auto`。后两个属性可选。

`flex:none|[flex-grow flex-shrink||flex-basis]`

该属性有两个快捷值:auto(1 1 auto)和none(0 0 auto)。

## align-self属性

align-self属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。

`align-self:auto|flex-start |flex-end|center|baseline|stretch`;


```css
/* 0 0 auto */
flex: none;

/* One value, unitless number: flex-grow */
flex: 2;

/* One value, width/height: flex-basis */
flex: 10em;
flex: 30px;
flex: auto;
flex: content;

/* Two values: flex-grow | flex-basis */
flex: 1 30px;

/* Two values: flex-grow | flex-shrink */
flex: 2 2;

/* Three values: flex-grow | flex-shrink | flex-basis */
flex: 2 2 10%;

/* Global values */
flex: inherit;
flex: initial;
flex: unset;
```
