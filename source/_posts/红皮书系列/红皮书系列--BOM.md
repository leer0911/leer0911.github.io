---
title: 《JS高级程序》BOM
date: 2016-7-8
---
BOM(浏览器对象模型)是web中真正的核心。BOM提供了很多对象，用于访问浏览器的功能，这些功能与网页内容无关。浏览器之间共有的对象成为了事实上的标准。W3C为了把浏览器中的JavaScript最基本的部分标准化，已经将BOM的主要方面纳入HTML5的规范中。

## window对象
BOM的核心对象是window，它表示浏览器的一个实例。window对象有双重角色，它既是通过JavaScript访问浏览器窗口的一个接口，有是 ECMAScript规定的global对象。这意味着在网页中定义的任何一个对象、变量和函数都以window作为其Global对象。
  * ### 全局作用域
  全局作用域中声明的变量、函数都会变成window对象的属性和方法。定义全局变量与在window对象上直接定义属性还是有差别的:全局变量不能通过delete操作符删除，而直接在window对象上定义的属性可以。
  ```js
    var age = 20;
    window.color = "red";
    delete window.age;
    delete window.color;
    alert(window.age);//29
    alert(window.color);//undefined
  ```
  使用var语句添加的window属性有一个名为[[Configurable]]的特性，这个特性的值被设置为false，因此这样定义的属性不可以通过delete操作符删除。

  * ### 窗口关系及框架
  如果页面中包含框架，则每个框架都拥有自己的window对象，并且保存在frames集合中。在frames集合中，可以通过数值索引(从0开始，从左至右，从上到下)或者框架名称来访问相应的window对象。每个window对象都有一个name属性，其中包含框架的名称。top对象指向最高(最外)层的框架，也就是浏览器窗口。除非最高层窗口是通过window.open()打开的，否则其window对象的name属性不会包含任何值。与框架有个的最后一个对象是self，它始终指向window;实际上window和self对象可以互换使用。引入self对象是为了与top和parent对象对应起来，因此它不格外包含其他值。

  * ### 窗口位置
  用来确定和修改window对象位置的属性和方法有很多。screenLeft和screenTop属性，分别用于表示窗口相对于屏幕左边和上边的位置。screenX和screenY。moveTo()和moveBy()方法可以准确地移动到一个新位置。moveTo()接收的是新位置的x和y值，而moveBy()接收的是在水平和垂直方向上移动的像素数。这两个方法都有可能被浏览器禁用。另外这两个方法都不适用于框架，只能对最外层的window对象使用。

  * ### 窗口位置
  具有innerWidth、innerHeight、outerWidth、outerHeight。兼容模式:
  ```js
  var pageWidth = window.innerWidth,
      pageHeight = window.innerHeight;
  if (typeof pageWidth != "number") {
      if (document.compatMode == "CSS1Compat") {
          pageWidth = document.documentElement.clientWidth;
          pageHeight = document.documentElement.clientHeight;
      } else {
          pageWidth = document.body.clientWidth;
          pageHeight = document.body.clientHeight;
      }
  }
  ```
  document.compatMode可以确定页面是否处于标准模式。标准模式下可以使用document.documentElement.clientWidth否则使用document.body.clientWidth。另外使用resizeTo()接收浏览器窗口的新宽度和新高度和resizeBy()接收新窗口与原窗口宽高之差。

  * ### 导航和打开窗口
  使用window.open()方法既可以导航到一个特定的URL，也可以打开一个新的浏览器窗口。可以接收4个参数:要加载的链接、窗口目标、一个特性字符串以及一个表示新页面是否取代浏览器历史记录中当前加载页面的布尔值。

  * ### 间歇调用和超时调用
  JavaScript是单线程语言，但它允许通过设置超时值和间歇时间值来调度代码在特定的时刻执行。超时调用用window对象的setTimeout()方法，虽然可以使用包含JavaScript代码的字符串，但由于传递字符串可能导致性能损失，因此不建议以字符串作为第一个参数。JavaScript是单线程序的解释器，因此一定时间内只能执行一段代码。为了控制要执行的代码，就有一个就JavaScript任务队列。调用setTimeout()之后，该方法会返回一个数值ID，表示超时调用。这个超时调用ID是几号执行代码的唯一标识符，可以用它来取消超时调用。要取消尚未执行的超时调用计划，可以调用clearTimeout()方法并将相应的超时调用ID作为参数传递给它:
  ```js
    var timeoutId = setTimeout(function(){
      alert("hello world");
    },1000);
    clearTimeout(timeoutId);
  ```
  超时调用的代码都是在全局作用域中执行的，因此函数中的this的值在严格模式下指向window对象，在严格模式下是undefined。设置间歇调用的方法是setInterval()，它接收的参数与setTimeout()相同;若要取消尚未执行的间调用，可以使用clearInterval()方法并传入相应的间歇调用ID，最好使用如下模式来模拟间歇调用。
  ```js
  var num = 0;
  var max = 10;

  function incrementNumber() {
      num++;
      //如果执行次数未达到 max 设定的值，则设置另一次超时调用
      if (num < max) {
          setTimeout(incrementNumber, 500);
      } else {
          alert("Done");
      }
  }
  setTimeout(incrementNumber, 500);
  ```

  * ### 系统对话框
  alert，confirm，prompt方法可以调用系统对话框想用户显示信息。系统对话框与浏览器中显示的网页没有关系，也不包含HTML。它们的外观由操作系统及浏览器设置决定，而不是由css决定。*通过这几个方法打开的对话框都是同步和模态的。也就是说，显示这些对话框的时候代码会停止执行，而关掉这些对话框后代码又会恢复执行。*

  * ### location对象
  它提供了与当前窗口中加载的文档有关的信息，还提供了一些导航功能。它既是window对象的属性，也是document对象的属性。它将URL解析为独立的片段，可以通过不同的属性访问这些片段。
    * hash 返回URL中的hash，如果有URL中不包含的散列，则返回 空字符串
    * host 返回服务器名称和端口号
    * hostname 返回不带端口号的服务器名称
    * href 返回当前加载页面的完整URL。而location对象的toString()方法也返回这个值
    * pathname 返回URL中的目录和文件名
    * port 返回端口号，如果不包含端口号则返回空字符串
    * protocol 返回页面使用的协议
    * search 返回URL的查询字符串，这个字符串以问号开头

  * ### navigator对象
    * appCodeName 浏览器的名称
    * appMinorVersion 次版本信息
    * appName 完整的浏览器名称
    * appVersion 浏览器的版本
    * buildID 浏览器编译版本
    * cookieEnabled 表示cookie是否启用
    * cupClass 客服的计算机中使用的CPU类型
    * language 浏览器的主语言
    * mimeType 浏览器中注册的MIME类型的数组
    * onLIne 表示浏览器是否连接到了因特网
    * platform 浏览器所在的系统平台

  * ### screen对象
    * availHeight 屏幕的像素高度减系统部件高度之后的值(只读)
    * availLeft 未被系统部件占用的最左侧的像素值(只读)
    * availTop 未被系统部件占用的最上方的像素值(只读)
    * availWidth 屏幕的像素宽度减系统部件高度之后的值(只读)
    * bufferDepth 读、写用于呈现屏外位图的位数
    * colorDepth 用于表现颜色的位数;多数系统都是32(只读)
    * deviceXDPI 屏幕实际的水平DPI(只读)
    * deviceYDPI 屏幕实际的垂直DPI(只读)
    * height 屏幕的像素高度
    * width 屏幕的像素宽度
    * left 当前屏幕距离左边的像素距离
    * top 当前屏幕距上边的像素距离

  * ### history对象
  history对象保存着用户上网的历史记录，从窗口被打开的那一刻算起。因为history是window对象的属性，因此每个浏览器窗口、每个标签乃至每个框架、都有自己的history对象与特定的window对象关联。使用go()方法可以在用户的历史记录中任意跳转，可以向前也可以向后。
  ```js
    history.go(-1);
    history.go(1);
    history.go(2);
    history.go('wrox.com');
    history.back();
    history.forward();
  ```
