---
title: Web Workers
---

>>> Web Workers是一种机制，通过它可以使一个脚本操作在与Web应用程序的主执行线程分离的后台线程中运行。这样做的优点是可以在单独的线程中执行繁琐的处理，让主（通常是UI）线程运行而不被阻塞/减慢。

一个 worker 是使用构造函数创建的一个对象（例如,Worker()）, 运行一个命名的 JavaScript文件 — 这个文件包含了将在 worker 线程中运行的代码，并且 worker 在与当前 window不同的另一个全局上下文中运行。

Web Worker为Web内容在后台线程中运行脚本提供了一种简单的方法。线程可以执行任务而不干扰用户界面。

Worker 接口会生成真正的操作系统级别的线程，如果你不太小心，那么并发(concurrency)会对你的代码产生有趣的影响。然而，对于 web worker 来说，与其他线程的通信点会被很小心的控制，这意味着你很难引起并发问题。你没有办法去访问非线程安全的组件或者是 DOM，此外你还需要通过序列化对象来与线程交互特定的数据。所以你要是不费点劲儿，还真搞不出错误来。

创建一个新的 worker 十分简单。你所要做的就是调用 Worker() 构造函数，指定一个要在 worker 线程内运行的脚本的 URI，如果你希望能够收到 worker 的通知，可以将 worker 的 onmessage 属性设置成一个特定的事件处理函数。

>>>URI，是uniform resource identifier，统一资源标识符，用来唯一的标识一个资源。而URL是uniform resource locator，统一资源定位器，它是一种具体的URI，即URL可以用来标识一个资源，而且还指明了如何locate这个资源。而URN，uniform resource name，统一资源命名，是通过名字来标识资源，比如`mailto:java-net@java.sun.com`。也就是说，URI是以一种抽象的，高层次概念定义统一资源标识，而URL和URN则是具体的资源标识的方式。URL和URN都是一种URI。

## 生成 worker

创建一个新的 worker 十分简单。你所要做的就是调用 Worker() 构造函数，指定一个要在 worker 线程内运行的脚本的 URI，如果你希望能够收到 worker 的通知，可以将 worker 的 onmessage 属性设置成一个特定的事件处理函数。

```js
var myWorker = new Worker("my_task.js");

myWorker.onmessage = function (oEvent) {
console.log("Called back by the worker!\n");
};
```

## 传递数据

在主页面与 worker 之间传递的数据是通过拷贝，而不是共享来完成的。传递给 worker 的对象需要经过序列化，接下来在另一端还需要反序列化。页面与 worker 不会共享同一个实例，最终的结果就是在每次通信结束时生成了数据的一个副本。大部分浏览器使用结构化拷贝来实现该特性。

## Web Workers API
