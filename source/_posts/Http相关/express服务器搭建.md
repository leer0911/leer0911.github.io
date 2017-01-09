---
title: express服务器搭建
---

通过 npm init 命令为你的应用创建一个 package.json 文件。

```bash
$ npm init
```

接下来安装 Express 并将其保存到依赖列表中：

```bash
$ npm install express --save
```

创建一个名为 app.js 的文件，然后将下列代码复制进去：

```bash
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
```

通过如下命令启动此应用：

```bash
$ node app.js
```

通过应用生成器工具 express 可以快速创建一个应用的骨架。

通过如下命令安装：

```bash
$ npm install express-generator -g
```

在当前工作目录下创建一个命名为 myapp 的应用

```bash
$ express myapp
```

启动这个应用

```bash
> set DEBUG=myapp & npm start
```

一个简单的 Express 路由

```js
// 对网站首页的访问返回 "Hello World!" 字样
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// 网站首页接受 POST 请求
app.post('/', function (req, res) {
  res.send('Got a POST request');
});

// /user 节点接受 PUT 请求
app.put('/user', function (req, res) {
  res.send('Got a PUT request at /user');
});

// /user 节点接受 DELETE 请求
app.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user');
});
```
