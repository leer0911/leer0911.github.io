---
title: algolia不完全指南
date: 2017-10-12 11:46:43
tags: 
- hexo
- algolia
---

hexo可以集成站内搜索服务，本文将介绍一种基于[algolia](https://www.algolia.com/)中[docsearch](https://community.algolia.com/docsearch/)的使用方法。

**本文主要介绍如何自定义algolia的爬虫内容**

<!-- more -->

## algolia使用

- algolia官网注册账号（可直接使用的github的账号）
- 新建index
- API Keys 界面里包含 `Application ID` `Search-Only API Key`

刚接触algolia的同学可以参考[这篇](http://www.jianshu.com/p/fa2354d61e37)

## docsearch使用

```js
<link rel="stylesheet" href="https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.css" />
<script type="text/javascript" src="https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.js"></script>
<script type="text/javascript">
docsearch({
  apiKey: '<API_KEY>',
  indexName: '<INDEX_NAME>',
  inputSelector: '<YOUR_INPUT_DOM_SELECTOR>'
});
</script>
```

## docsearch-scraper使用

ubuntu环境下

``` bash
apt-get install python
git clone git@github.com:algolia/docsearch-scraper.git
cd docsearch-scraper
pip install --user -r requirements.txt
```

执行以下命令

``` bash
./docsearch
```

第一次执行会提示输入`APPLICATION_ID`及`API_KEY`，此处API_KEY对应algolia API Keys界面里的 `admin Key`

在`docsearch-scraper`目录下新建名为`test.json`的文件，写入相关配置，后执行

``` bash
./docsearch run test.json
```

## docsearch-configs

配置文件如下

``` json
{
    "index_name": "stripe", // 对应algolia里的indexName
    "start_urls": [
        "https://stripe.com/docs" // 待抓取开始网址 可为本地 http://localhost:4000 (hexo博客本地服务)
    ],
    "stop_urls": [
        "https://stripe.com/docs/api"
    ],
    "selectors": {
      "lvl0": "#content header h1",
      "lvl1": "#content article h1",
      "lvl2": "#content section h3",
      "lvl3": "#content section h4",
      "lvl4": "#content section h5",
      "lvl5": "#content section h6",
      "text": "#content header p,#content section p,#content section ol"
    },
    "selectors_exclude": [
        ".method-list",
        "aside.note"
    ]
}
```

至此一个hexo搜索功能搭建完毕，感谢algolia和hexo。同时可参考[vue 官方文档源码](https://github.com/vuejs/cn.vuejs.org)，可快速搭建自己的参考手册或教程类网站。

## 相关Github链接

- [algolia](https://github.com/algolia)
- [docsearch](https://github.com/algolia/docsearch)
- [docsearch-scraper](https://github.com/algolia/docsearch-scraper)
- [docsearch-configs](https://github.com/algolia/docsearch-configs)