---
title: HTML5脚本编程
---

# 跨文档消息传递

跨文档消息传送（cross-document messaging），有时候简称为 XDM，指的是在来自不同域的页面间 传递消息。

XDM 的核心是 postMessage()方法。

postMessage()方法接收两个参数：一条消息和一个表示消息接收方来自哪个域的字符串。第二 个参数对保障安全通信非常重要，可以防止浏览器把消息发送到不安全的地方。来看下面的例子。


# 拖放 API

## 拖放事件
通过拖放事件，可以控制拖放相关的各个方面。其中最关键的地方在于确定哪里发生了拖放事件， 有些事件是在被拖动的元素上触发的，而有些事件是在放置目标上触发的。拖动某元素时，将依次触发下列事件：
* dragstart
* drag
* dragend

当某个元素被拖动到一个有效的放置目标上时，下列事件会依次发生
* dragenter
* dragover
* dragleave 或 drop

## 自定义放置目标
在拖动元素经过某些无效放置目标时，可以看到一种特殊的光标（圆环中有一条反斜线），表示不 能放置。虽然所有元素都支持放置目标事件，但这些元素默认是不允许放置的。如果拖动元素经过不允许放置元素，无论用户如何操作，都不会发生 drop 事件。不过，你可以把任何元素变成有效的放置 目标，方法是重写 dragenter 和 dragover 事件的默认行为。例如，假设有一个 ID 为"droptarget"的<div>元素，可以用如下代码将它变成一个放置目标。
```js
var droptarget = document.getElementById("droptarget");
EventUtil.addHandler(droptarget, "dragover", function (event) {
	EventUtil.preventDefault(event);
});
EventUtil.addHandler(droptarget, "dragenter", function (event) {
	EventUtil.preventDefault(event);
});
````

## dataTransfer对象
只有简单的拖放而没有数据变化是没有什么用的。为了在拖放操作时实现数据交换， IE 5 引入了 dataTransfer 对象，它是事件对象的一个属性，用于从被拖动元素向放置目标传递字符串格式的数据。
dataTransfer 对象有两个主要方法： getData()和 setData()。不难想象， getData()可以取 得由 setData()保存的值。 setData()方法的第一个参数，也是 getData()方法唯一的一个参数，是 一个字符串，表示保存的数据类型，取值为"text"或"URL"，如下所示
```js
//设置和接收文本数据
event.dataTransfer.setData("text", "some text");
var text = event.dataTransfer.getData("text");
//设置和接收 URL
event.dataTransfer.setData("URL", "http://www.wrox.com/");
var url = event.dataTransfer.getData("URL");
````

## dropEffect与effectAllowed
假设你想允许用户把文本框中的文本拖放到一个<div>元素中。首先，必须将 dropEffect 和 effectAllowed 设置为"move"。但是，由于<div>元素的放置事件的默认行为是什么也不做，所以文 本不可能自动移动。重写这个默认行为，就能从文本框中移走文本。然后你就可以自己编写代码将文本 插入到<div>中，这样整个拖放操作就完成了。如果你将 dropEffect 和 effectAllowed 的值设置为
"copy"，那就不会自动移走文本框中的文本。

## 可拖动
默认情况下，图像、链接和文本是可以拖动的，也就是说，不用额外编写代码，用户就可以拖动它 们。文本只有在被选中的情况下才能拖动，而图像和链接在任何时候都可以拖动。

让其他元素可以拖动也是可能的。 HTML5 为所有 HTML 元素规定了一个 draggable 属性，表 示元素是否可以拖动。图像和链接的 draggable 属性自动被设置成了 true，而其他元素这个属性 的默认值都是 false。要想让其他元素可拖动，或者让图像或链接不能拖动，都可以设置这个属性。 例如：
```html
<!-- 让这个图像不可以拖动 -->
<img src="smile.gif" draggable="false" alt="Smiley face">
<!-- 让这个元素可以拖动 -->
<div draggable="true">...</div>
```


# 音频与视频
两个标签就是<audio>和<video>。使用这两个元素时，至少要在标签中包含 src 属性，指向要加载的媒体文件。还可以设置 width 和 height 属性以指定视频播放器的大小，而为 poster 属性指定图像的 URI 可以在加载视频内容期间 显示一幅图像。另外，如果标签中有 controls 属性，则意味着浏览器应该显示 UI 控件，以便用户直 接操作媒体。位于开始和结束标签之间的任何内容都将作为后备内容，在浏览器不支持这两个媒体元素 的情况下显示

因为并非所有浏览器都支持所有媒体格式，所以可以指定多个不同的媒体来源。为此，不用在标签 中指定 src 属性，而是要像下面这样使用一或多个<source>元素。

## 属性
<video>和<audio>元素都提供了完善的 JavaScript 接口。下表列出了这两个元素共有的属性，通 过这些属性可以知道媒体的当前状态。
* autoplay 布尔值 取得或设置autoplay标志
* buffered 时间范围 表示已下载的缓冲的时间范围的对象
* bufferedBytes 字节范围 表示已下载的缓冲的字节范围的对象
* bufferingRate 整数 下载过程中每秒钟平均接收到的位数
* bufferingThrottled 布尔值 表示浏览器是否对缓冲进行了节流
* controls 布尔值 取得或设置controls属性，用于显示或隐藏浏览器内置的控件
* currentLoop 整数 媒体文件已经循环的次数
* currentSrc 字符串 当前播放的媒体文件的URL
* currentTime 浮点数 已经播放的秒数
* defaultPlaybackRate 浮点数 取得或设置默认的播放速度。默认值为1.0秒
* duration 浮点数 媒体的总播放时间（秒数）
* ended 布尔值 表示媒体文件是否播放完成
* loop 布尔值 取得或设置媒体文件在播放完成后是否再从头开始播放
* muted 布尔值 取得或设置媒体文件是否静音
* networkState 整数 表示当前媒体的网络连接状态： 0表示空， 1表示正在加载， 2表示
* 正在加载元数据， 3表示已经加载了第一帧， 4表示加载完成
* paused 布尔值 表示播放器是否暂停
* playbackRate 浮点数 取得或设置当前的播放速度。用户可以改变这个值，让媒体播放速
* 度变快或变慢，这与defaultPlaybackRate只能由开发人员修改
* 的defaultPlaybackRate不同
* played 时间范围 到目前为止已经播放的时间范围
* readyState 整数 表示媒体是否已经就绪（可以播放了）。 0表示数据不可用， 1表示
* 可以显示当前帧， 2表示可以开始播放， 3表示媒体可以从头到尾播放
* seekable 时间范围 可以搜索的时间范围
* seeking 布尔值 表示播放器是否正移动到媒体文件中的新位置
* src 字符串 媒体文件的来源。任何时候都可以重写这个属性
* start 浮点数 取得或设置媒体文件中开始播放的位置，以秒表示
* totalBytes 整数 当前资源所需的总字节数
* videoHeight 整数 返回视频（不一定是元素）的高度。只适用于<video>
* videoWidth 整数 返回视频（不一定是元素）的宽度。只适用于<video>
* volume 浮点数 取得或设置当前音量，值为0.0到1.0

## 事件
* abort 下载中断
* canplay 可以播放时； readyState值为2
* canplaythrough 播放可继续，而且应该不会中断； readyState值为3
* canshowcurrentframe 当前帧已经下载完成； readyState值为1
* dataunavailable 因为没有数据而不能播放； readyState值为0
* durationchange duration属性的值改变
* emptied 网络连接关闭
* empty 发生错误阻止了媒体下载
* ended 媒体已播放到末尾，播放停止
* error 下载期间发生网络错误
* load 所有媒体已加载完成。这个事件可能会被废弃，建议使用canplaythrough
* loadeddata 媒体的第一帧已加载完成
* loadedmetadata 媒体的元数据已加载完成
* loadstart 下载已开始
* pause 播放已暂停
* play 媒体已接收到指令开始播放
* playing 媒体已实际开始播放
* progress 正在下载
* ratechange 播放媒体的速度改变
* seeked 搜索结束
* seeking 正移动到新位置
* stalled 浏览器尝试下载，但未接收到数据
* timeupdate currentTime被以不合理或意外的方式更新
* volumechange volume属性值或muted属性值已改变
* waiting 播放暂停，等待下载更多数据

## 自定义媒体播放器
使用<audio>和<video>元素的 play()和 pause()方法，可以手工控制媒体文件的播放。组合使 用属性、事件和这两个方法，很容易创建一个自定义的媒体播放器，如下面的例子所示。
```html
<div class="mediaplayer">
<div class="video">
<video id="player" src="movie.mov" poster="mymovie.jpg"
width="300" height="200">
Video player not available.
</video>
</div>
<div class="controls">
<input type="button" value="Play" id="video-btn">
<span id="curtime">0</span>/<span id="duration">0</span>
</div>
</div>
```

以上基本的 HTML 再加上一些 JavaScript 就可以变成一个简单的视频播放器。以下就是 JavaScript 代码。
```js
//取得元素的引用
var player = document.getElementById("player"),
	btn = document.getElementById("video-btn"),
	curtime = document.getElementById("curtime"),
	duration = document.getElementById("duration");
//更新播放时间
duration.innerHTML = player.duration;
//为按钮添加事件处理程序
EventUtil.addHandler(btn, "click", function(event){
	if (player.paused){
		player.play();
		btn.value = "Pause";
	} else {
		player.pause();
		btn.value = "Play";
	}
});
//定时更新当前时间
setInterval(function(){
	curtime.innerHTML = player.currentTime;
}, 250);
```

## Audio类型
<audio>元素还有一个原生的 JavaScript 构造函数 Audio，可以在任何时候播放音频。从同为 DOM 元素的角度看， Audio 与 Image 很相似，但 Audio 不用像 Image 那样必须插入到文档中。只要创建一
个新实例，并传入音频源文件即可。

## 历史状态管理
历史状态管理是现代 Web 应用开发中的一个难点。在现代 Web 应用中，用户的每次操作不一定会 打开一个全新的页面，因此“后退”和“前进”按钮也就失去了作用，导致用户很难在不同状态间切换。 要解决这个问题，首选使用 hashchange 事件（第 13 章曾讨论过）。 HTML5 通过更新 history 对象为 管理历史状态提供了方便。 通过 hashchange 事件，可以知道 URL 的参数什么时候发生了变化，即什么时候该有所反应。而 通 过 状 态 管 理 API ， 能 够 在 不 加 载 新 页 面 的 情 况 下 改 变 浏 览 器 的 URL 。 为 此 ， 需 要 使 用 history.pushState()方法，该方法可以接收三个参数：状态对象、新状态的标题和可选的相对 URL。 例如：
```js
history.pushState({name:"Nicholas"}, "Nicholas' page", "nicholas.html");
```