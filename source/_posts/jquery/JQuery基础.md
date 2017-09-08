---
title: Jquery
---

# 总体架构

入口模块：构造JQuery对象

功能模块：属性操作，事件系统，DOM遍历，DOM操作，样式操作，AJax，动画

底层支持模块：工具方法，回调函数列表，异步队列，浏览器功能测试，数据缓存，队列，选择器

# 构造jQuery对象

## `jQuery(selector,[context])`

context可以用来限定查找范围，否则匹配从根元素document开始。

```js
  $('div').click(function (e) {
    // body...
    $('span',this).addClass('a');
  })
```

复杂的选择器或指定了上下文的，通过jQuery的find方法查找。

## `jQuery.(html,[,ownerDocument]),jQuery(html,props)）`

如果传入的参数是html代码，则创建一个包含这些DOM元素的jQuery对象。

参数props可以是val，css，text，data，width，height，offset。也可以是任意类型的事件类型。

```js
  // $('<div>',{
  //   'class':'text',
  //   'text':'aaa',
  //   'click':function(){
  //     $(this).toggleClass('test');
  //   }
  // }）
```

## `jQuery(element),jQuery(elementArray),jQuery(object)`

将值封装到jQuery对象中并返回，可用于事件监听和自定义事件。

如果传入的是一个函数，则在document上绑定一个ready事件监听。

如果传入的是一个jquery对象，则创建该jquery对象的副本并返回。副本与传入的jquery对象引用完全相同的DOM元素。

如果不传入任何参数，则返回一个空jquery对象。

## 总体结构

最外层是自调用匿名函数，当jquer初始化时，包含在自调用匿名函数里面的JavaScript代码将被执行。

jquery暴露给全局作用域window，并定义别名$.

jquery使用内部new创建并返回另一个构造函数的实例来省去new操作符生成对象。

jquery.fn是jquery.prototype的简写。

使用自调用匿名函数，可以实现高内聚低耦合的设计思想。

## jQuery.fn.init(selector,context,rootJQuery)`

$(function)是$(document).ready(selector)的简写

12个分支：
```js
  // ！selector
  // selector.nodeType
  // "body"
  // "string" : 单个标签，复杂html代码，#id
  // function
  // $($())
```

## jquery.bulidFragment(args,nodes,scripts)

先创建一个文档片段DocumentFragment，调用jquery.clean(elems,context,fragment,scripts)将html代码转换为DOM元素，存储在的文档片段中

## jquery.clean(elems,context,fragment,scripts)

转换HTML代码中的DOM元素，提取其中的script元素。

## jquery.extend(),jquery.fn.extend()

用于合并两个或多个对象的属性到第一个对象。

`Jquery.extend([deep],object,object1,[objectN]),Jquery.fn.extend();`

deep表示是否深度合并（递归合并），如果仅提供一个对象，代表在jquery或jquery.fn上扩展属性或方法。
