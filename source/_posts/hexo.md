---
title: hexo入门指南
date: 2017-10-10 21:26:00
tags: hexo
---

hexo可用于快速搭建githubPage，是一个JS语言编写的静态网站生成器，主要作用是解析Markdown语法，并配合模板引擎，快速生成静态网站。

<!-- more -->

## 快速使用

> A fast, simple & powerful blog framework, powered by Node.js.

[hexo官网](https://hexo.io/)

``` bash
npm install hexo-cli -g

hexo init blog

cd blog

npm install

hexo server

hexo new "Hello Hexo" # 新建文章

hexo generate
```

## 实时监听文件修改

推荐使用hexo-browsersync

``` bash
npm install hexo-browsersync --save
```

**注意： 由于使用了hexo-browsersync在本地当文章字数过多时会出现乱码的情况，线上由于没该插件影响不会乱码。**

配置

> BrowserSync options are supported inside `_config.yml` file, e.g.:

````yaml
browsersync:
  logLevel: "warn"
  ghostMode:
    scroll: true
````

> You can check [BrowserSync options](http://www.browsersync.io/docs/options/) for more info. 

[browsersync](http://www.browsersync.io/)

## 一键部署

基于Git，首先安装 `hexo-deployer-git` 

``` bash
npm install hexo-deployer-git --save
```

其次在 `_config.yml` 中修改参数

``` bash
deploy:
  type: git
  repo: <repository url>
  branch: [branch]
  message: [message]
```

```bash
hexo g -d
```

## 插件

Hexo 有强大的插件系统，使您能轻松扩展功能而不用修改核心模块的源码。在 Hexo 中有两种形式的插件：

### 脚本（Scripts）

如果您的代码很简单，建议您编写脚本，您只需要把 JavaScript 文件放到 scripts 文件夹，在启动时就会自动载入。

### 插件（Packages）

如果您的代码较复杂，或是您想要发布到 NPM 上，建议您编写插件。首先，在 `node_modules` 文件夹中建立文件夹，文件夹名称开头必须为 `hexo-`，如此一来 Hexo 才会在启动时载入否则 Hexo 将会忽略它。

文件夹内至少要包含 2 个文件：一个是主程序，另一个是 `package.json`，描述插件的用途和所依赖的插件。


```
.
├── index.js
└── package.json

```

package.json 中至少要包含 name, version, main 属性，例如：

``` json
{
  "name": "hexo-my-plugin",
  "version": "0.0.1",
  "main": "index"
}
```

## 标签插件

> 标签插件帮助开发者在文章中快速插入内容。

``` js
/* global hexo */

'use strict';

hexo.extend.tag.register('note', function(args, content) {
  var className = args.shift();
  var header = '';
  var result = '';

  if (args.length) {
    header += '<strong class="note-title">' + args.join(' ') + '</strong>';
  }

  result += '<blockquote class="note ' + className + '">' + header;
  result += hexo.render.renderSync({text: content, engine: 'markdown'});
  result += '</blockquote>';

  return result;
}, true);
```

## next主题

> NexT 拥有丰富而简单的配置，结合第三方服务，打造属于您自己的博客

[next官网](http://theme-next.iissnan.com/)

### 安装

项目目录下执行`git clone https://github.com/iissnan/hexo-theme-next themes/next`

### 基础配置

在 Hexo 中有两份主要的配置文件，其名称都是 _config.yml。 其中，一份位于站点根目录下，主要包含 Hexo 本身的配置；另一份位于主题目录下，这份配置由主题作者提供，主要用于配置主题相关的选项。

在站点文件下

``` yml
theme: next # 主题选择
language: zh-Hans # 语言选择
```


在主题配置文件下

``` yml
scheme: Pisces # 主题样式
menu: # 菜单设置
  home: /
  archives: /archives
  #about: /about
  #categories: /categories
  tags: /tags
  #commonweal: /404.html
sidebar: # 侧栏位置
  position: left
  #头像设置
avatar: http://example.com/avatar.png
local_search:
  enable: true
```

### 集成服务

[搜索服务](http://theme-next.iissnan.com/third-party-services.html#algolia-search)

Local Search

``` bash
npm install hexo-generator-searchdb --save
```

### 内建标签

文本居中的引用 
```
{% cq %} blah blah blah {% endcq %}
```

突破容器宽度限制的图片 

```
{% fi /image-url, alt, title %}
```

Bootstrap Callout 

```
{% note class_name %} Content (md partial supported) {% endnote %}
```

其中，class_name 可以是以下列表中的一个值：

* default
* primary
* success
* info
* warning
* danger