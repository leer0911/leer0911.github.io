---
title: Ajax
---
Ajax是Asynchronous JavaScript - XML的的简写。这一技术能够向服务器请求额外的数据而无需卸载页面。ajax技术的核心是XMLHttpRequest对象(简称XHR)，其为向服务器发送请求和解析服务器响应提供了流畅的接口。以为着可以用XHR对象取得新数据，然后再通过DOM将新数据插入到页面中。虽然名字中包含XML的成分，但Ajax通信与数据格式无关;这种技术就是无须刷新页面即可从服务器取得数据，但不一定是XML数据。
# XMLHttpRequest对象
```js
function createXHR() {
	if (typeof XMLHttpRequest != "undefined") {
		return new XMLHttpRequest();
	} else if (typeof ActiveXObject != "undefined") {
		if (typeof arguments.callee.activeXString != "string") {
			var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
					"MSXML2.XMLHttp"],
				i, len;
			for (i = 0, len = versions.length; i < len; i++) {
				try {
					new ActiveXObject(versions[i]);
					arguments.callee.activeXString = versions[i];
					break;
				} catch (ex) {
//跳过
				}
			}
		}
		return new ActiveXObject(arguments.callee.activeXString);
	} else {
		throw new Error("No XHR object available.");
	}
}
```
由于其他浏览器中对XHR的实现与IE最早的实现是兼容的，因此就可以在所有浏览器中都以相同的方式使用上面创建的xhr对象。    

## XHR的用法
在使用XHR对象时，要调用的第一个方法时open()，它接受3个参数:要发送的请求的类型("get"、"post"等)、请求的URL和表示是否异步发送请求的布尔值。下面就是调用这个方法例子。
```js
xhr.open("get","example.php",false);
```
这行代码会启动一个针对example.php的GET请求。需要注意:一是URL相对于执行代码的当前页面(当然也可以使用绝对路径);而是调用open()方法并不会真正发送请求，而只是启动一个请求以备发送。
要发送特定的请求，必须调用send()方法;这里的send()方法接收一个参数，即要作为请求主题发送的数据。如果不需要通过请求主体发送数据，则必须传入null，因为这个参数对有些浏览器来说是必须的。调用send()之后，请求就会被分派到服务器。

由于这次请求是同步的，JavaScript代码会等到服务器响应之后再继续执行。在收到响应后，响应的数据会自动填充XHR对象的属性，相关的属性如下
* responseText: 作为响应主体被返回的文本。
* responseXML: 如果响应的内容类型是"text/xml"或"application/xml"，这个属性中将保存包含着响应数据的XML DOM文档。
* status: 响应的HTTP状态。
* statusText: HTTP状态的说明。
在接收到响应后的第一部是检查status属性，以确定响应已经成功返回。一般来说可以将HTTP状态代码为200作为成功的标志。此时，responseText属性的内容已经就绪，而且在内容类型正确的情况下，responseXML也应该能够访问了。此外状态码为304表示请求的资源并没有被修改。可以直接使用浏览器中缓存的版本;当然也以为着响应是有效的。为确保接收到适当的响应，应该:
```js
xhr.open("get", "example.txt", false);
xhr.send(null);
if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
	alert(xhr.responseText);
} else {
	alert("Request was unsuccessful: " + xhr.status);
}
```
像前面这样发送同步请求当然没有问题，但多数情况下，我们还是要发送异步请求，才能让 JavaScript 继续执行而不必等待响应。此时，可以检测 XHR 对象的 readyState 属性，该属性表示请求
/响应过程的当前活动阶段。这个属性可取的值如下。
* 0：未初始化。尚未调用 open()方法。
* 1：启动。已经调用 open()方法，但尚未调用 send()方法。
* 2：发送。已经调用 send()方法，但尚未接收到响应。
* 3：接收。已经接收到部分响应数据。
* 4：完成。已经接收到全部响应数据，而且已经可以在客户端使用了。

只要 readyState 属性的值由一个值变成另一个值，都会触发一次 readystatechange 事件。可 以利用这个事件来检测每次状态变化后 readyState 的值。通常，我们只对 readyState 值为 4 的阶 段感兴趣，因为这时所有数据都已经就绪。不过，必须在调用 open()之前指定 onreadystatechange
事件处理程序才能确保跨浏览器兼容性。下面来看一个例子
```js
var xhr = createXHR();
xhr.onreadystatechange = function(){
	if (xhr.readyState == 4){
		if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
			alert(xhr.responseText);
		} else {
			alert("Request was unsuccessful: " + xhr.status);
		}
	}
};
xhr.open("get", "example.txt", true);
xhr.send(null);
```
另外，在接收到响应之前还可以调用 abort()方法来取消异步请求，如下所示

## HTTP头部信息
每个 HTTP 请求和响应都会带有相应的头部信息，其中有的对开发人员有用，有的也没有什么用。 XHR 对象也提供了操作这两种头部（即请求头部和响应头部）信息的方法。
* Accept：浏览器能够处理的内容类型。
* Accept-Charset：浏览器能够显示的字符集。
* Accept-Encoding：浏览器能够处理的压缩编码。
* Accept-Language：浏览器当前设置的语言。
* Connection：浏览器与服务器之间连接的类型。
* Cookie：当前页面设置的任何 Cookie。
* Host：发出请求的页面所在的域 。
* Referer：发出请求的页面的 URI。注意， HTTP 规范将这个头部字段拼写错了，而为保证与规 范一致，也只能将错就错了。（这个英文单词的正确拼法应该是 referrer。）
* User-Agent：浏览器的用户代理字符串

使用 setRequestHeader()方法可以设置自定义的请求头部信息。这个方法接受两个参数：头部字段 的名称和头部字段的值。要成功发送请求头部信息，必须在调用 open()方法之后且调用 send()方法
之前调用 setRequestHeader()，如下面的例子所示。

```js
var xhr = createXHR();
xhr.onreadystatechange = function () {
	if (xhr.readyState == 4) {
		if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
			alert(xhr.responseText);
		} else {
			alert("Request was unsuccessful: " + xhr.status);
		}
	}
};
xhr.open("get", "example.php", true);
xhr.setRequestHeader("MyHeader", "MyValue");
xhr.send(null);
```

## GET请求
GET 是最常见的请求类型，最常用于向服务器查询某些信息。必要时，可以将查询字符串参数追加 到 URL 的末尾，以便将信息发送给服务器。对 XHR 而言，位于传入 open()方法的 URL 末尾的查询字 符串必须经过正确的编码才行。 使用 GET 请求经常会发生的一个错误，就是查询字符串的格式有问题。查询字符串中每个参数的名
称和值都必须使用 encodeURIComponent()进行编码，然后才能放到 URL 的末尾；而且所有名-值对
儿都必须由和号（&）分隔，如下面的例子所示。
```js
xhr.open("get", "example.php?name1=value1&name2=value2", true);
// 下面这个函数可以辅助向现有 URL 的末尾添加查询字符串参数：
function addURLParam(url, name, value) {
	url += (url.indexOf("?") == -1 ? "?" : "&");
	url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
	return url;
}
```

## POST请求
默认情况下，服务器对 POST 请求和提交 Web 表单的请求并不会一视同仁。因此，服务器端必须有 程序来读取发送过来的原始数据，并从中解析出有用的部分。不过，我们可以使用 XHR 来模仿表单提 交：首先将 Content-Type 头部信息设置为 application/x-www-form-urlencoded，也就是表单
提交时的内容类型，其次是以适当的格式创建一个字符串。
```js
function submitData(){
	var xhr = createXHR();
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4){
			if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
				alert(xhr.responseText);
			} else {
				alert("Request was unsuccessful: " + xhr.status);
			}
		}
	};
	xhr.open("post", "postexample.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var form = document.getElementById("user-info");
	xhr.send(serialize(form));
}
```

## XMLHttpRequest 2 级
XMLHttpRequest 1 级只是把已有的 XHR 对象的实现细节描述了出来。而 XMLHttpRequest 2 级则进一步 发展了 XHR。

### FormData
现代 Web 应用中频繁使用的一项功能就是表单数据的序列化， XMLHttpRequest 2 级为此定义了 FormData 类型。 FormData 为序列化表单以及创建与表单格式相同的数据（用于通过 XHR 传输）提供
了便利。下面的代码创建了一个 FormData 对象，并向其中添加了一些数据。
```js
    var xhr = createXHR();
    xhr.onreadystatechange = function () {
    	if (xhr.readyState == 4) {
    		if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
    			alert(xhr.responseText);
    		} else {
    			alert("Request was unsuccessful: " + xhr.status);
    		}
    	}
    };
    xhr.open("post", "postexample.php", true);
    var form = document.getElementById("user-info");
    xhr.send(new FormData(form));
```

### 超时设定
XHR 对象添加了一个 timeout 属性，表示请求在等待响应多少毫秒之后就终止。
```js
var xhr = createXHR();
xhr.onreadystatechange = function(){
	if (xhr.readyState == 4){
		try {
			if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
				alert(xhr.responseText);
			} else {
				alert("Request was unsuccessful: " + xhr.status);
			}
		} catch (ex){
//假设由 ontimeout 事件处理程序处理
		}
	}
};
xhr.open("get", "timeout.php", true);
xhr.timeout = 1000; //将超时设置为 1 秒钟（仅适用于 IE8+）
xhr.ontimeout = function(){
	alert("Request did not return in a second.");
};
xhr.send(null)
```

## overrideMimeType()方法
Firefox 最早引入了 overrideMimeType()方法，用于重写 XHR 响应的 MIME 类型。这个方法后 来也被纳入了 XMLHttpRequest 2 级规范。因为返回响应的 MIME 类型决定了 XHR 对象如何处理它，所 以提供一种方法能够重写服务器返回的 MIME 类型是很有用的。 比如，服务器返回的 MIME 类型是 text/plain，但数据中实际包含的是 XML。根据 MIME 类型，
即使数据是 XML， responseXML 属性中仍然是 null。通过调用 overrideMimeType()方法，可以保
证把响应当作 XML 而非纯文本来处理。
```js
var xhr = createXHR();
xhr.open("get", "text.php", true);
xhr.overrideMimeType("text/xml");
xhr.send(null);
```

## 进度事件
Progress Events 规范是 W3C 的一个工作草案，定义了与客户端服务器通信有关的事件。这些事件最 早其实只针对 XHR 操作，但目前也被其他 API 借鉴。有以下 6 个进度事件。
* loadstart：在接收到响应数据的第一个字节时触发。
* progress：在接收响应期间持续不断地触发。
* error：在请求发生错误时触发。
* abort：在因为调用 abort()方法而终止连接时触发。
* load：在接收到完整的响应数据时触发。
* loadend：在通信完成或者触发 error、 abort 或 load 事件后触发。

## 跨源资源共享
通过 XHR 实现 Ajax 通信的一个主要限制，来源于跨域安全策略。默认情况下， XHR 对象只能访 问与包含它的页面位于同一个域中的资源。这种安全策略可以预防某些恶意行为。

CORS（Cross-Origin Resource Sharing，跨源资源共享）是 W3C 的一个工作草案，定义了在必须访 问跨源资源时，浏览器与服务器应该如何沟通。 CORS 背后的基本思想，就是使用自定义的 HTTP 头部
让浏览器与服务器进行沟通，从而决定请求或响应是应该成功，还是应该失败

检测 XHR 是否支持 CORS 的最简单方式，就是检查 是否存在 withCredentials 属性。再结合检测 XDomainRequest 对象是否存在，就可以兼顾所有浏
览器了。

```js
    function createCORSRequest(method, url) {
    	var xhr = new XMLHttpRequest();
    	if ("withCredentials" in xhr) {
    		xhr.open(method, url, true);
    	} else if (typeof XDomainRequest != "undefined") {
    		vxhr = new XDomainRequest();
    		xhr.open(method, url);
    	} else {
    		xhr = null;
    	}
    	return xhr;
    }
    var request = createCORSRequest("get", "http://www.somewhere-else.com/page/");
    if (request) {
    	request.onload = function () {
    //对 request.responseText 进行处理
    	};
    	request.send();
    }
```

## 其他跨域技术
* 图像Ping
我们知道，一个网页可以从任何网页中加载图像，不 用担心跨域不跨域。也可以动态地创 建图像，使用它们的 onload 和 onerror 事件处理程序来确定是否接收到了响应。 动态创建图像经常用于图像 Ping。图像 Ping 是与服务器进行简单、单向的跨域通信的一种方式。 请求的数据是通过查询字符串形式发送的，而响应可以是任意内容，但通常是像素图或 204 响应。通过
图像 Ping，浏览器得不到任何具体的数据，但通过侦听 load 和 error 事件，它能知道响应是什么时
候接收到的。来看下面的例子。
```js
var img = new Image();
img.onload = img.onerror = function(){
alert("Done!");
};
img.src = "http://www.example.com/test?name=Nicholas";
```

* JSONP
JSONP 是 JSON with padding（填充式 JSON 或参数式 JSON）的简写，是应用 JSON 的一种新方法， 在后来的 Web 服务中非常流行。 JSONP 看起来与 JSON 差不多，只不过是被包含在函数调用中的 JSON， 就像下面这样。
```js
callback({ "name": "Nicholas" });
```

JSONP 由两部分组成：回调函数和数据。回调函数是当响应到来时应该在页面中调用的函数。回调 函数的名字一般是在请求中指定的。而数据就是传入回调函数中的 JSON 数据。下面是一个典型的 JSONP
请求。
```js
http://freegeoip.net/json/?callback=handleResponse
```

## Comet
Ajax 是一种从页面向服务器请求数据的技术，而 Comet 则是一种服务器向页面推送数据的技 术。 Comet 能够让信息近乎实时地被推送到页面上，非常适合处理体育比赛的分数和股票报价。
