---
title: cookies
---

Javascript是运行在客户端的脚本，因此一般是不能够设置Session的，因为Session是运行在服务器端的。
而cookie是运行在客户端的，所以可以用JS来设置cookie

JS中的全局变量或者静态变量的生命周期是有限的，当发生页面跳转或者页面关闭的时候，这些变量的值会重新载入，即没有达到保存的效果。解决这个问题的最好的方案是采用cookie来保存该变量的值，那么如何来设置和读取cookie呢？
首先需要稍微了解一下cookie的结构，简单地说：cookie是以键值对的形式保存的，即key=value的格式。各个cookie之间一般是以“;”分隔。


cookie操作在前端开发过程中经常遇到，当然如果只是用来存储一些简单用户数据，还是比较简单的，我们要做的可能只是设置cookie名，值，过期时间等，读取也只要根据cookie的名读取相应的cookie值就可以了。在复杂的应用中，光这些肯定就不够了。

# cookie的属性


# 设置cookies

假设在A页面中要保存变量username的值("jack")到cookie中,key值为name，则相应的JS代码为：

```js
  document.cookie="name="+username;
```

# 读取cookie

```js
var username=document.cookie.split(";")[0].split("=")[1];
// JS操作cookies方法!
// 写cookies
function setCookie(name,value){
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days*24*60*60*1000);
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
```

# 删除cookie
