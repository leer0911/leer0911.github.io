---
title: Vue实战代码片段
---


# 数据相关

```js
// fetch获取数据
import {
  baseUrl
} from './env'

export default async(type = 'GET', url = '', data = {}, method = 'fetch') => {
  type = type.toUpperCase();
  url = baseUrl + url;

  if (type == 'GET') {
    let dataStr = ''; //数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&';
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }
  }

  if (window.fetch && method == 'fetch') {
    let requestConfig = {
      credentials: 'include',
      method: type,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: "cors",
      cache: "force-cache"
    }

    if (type == 'POST') {
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      })
    }

    try {
      var response = await fetch(url, requestConfig);
      var responseJson = await response.json();
    } catch (error) {
      throw new Error(error)
    }
    return responseJson
  } else {
    let requestObj;
    if (window.XMLHttpRequest) {
      requestObj = new XMLHttpRequest();
    } else {
      requestObj = new ActiveXObject;
    }

    let sendData = '';
    if (type == 'POST') {
      sendData = JSON.stringify(data);
    }

    requestObj.open(type, url, true);
    requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    requestObj.send(sendData);

    requestObj.onreadystatechange = () => {
      if (requestObj.readyState == 4) {
        if (requestObj.status == 200) {
          let obj = requestObj.response
          if (typeof obj !== 'object') {
            obj = JSON.parse(obj);
          }
          return obj
        } else {
          throw new Error(requestObj)
        }
      }
    }
  }
}
```

```js

/**
 * 创建临时数据
 */
const setpromise = data => {
  return new Promise((resolve, reject) => {
    resolve(data)
  })
}
```

```js
//将获取的数据按照A-Z字母开头排序
sortgroupcity(){
    let sortobj = {};
    for (let i = 65; i <= 90; i++) {
        if (this.groupcity[String.fromCharCode(i)]) {
            sortobj[String.fromCharCode(i)] = this.groupcity[String.fromCharCode(i)];
        }
    }
    return sortobj
}
```

```js
/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
}
```

```js
/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
}
```

```js
/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
}
```

```js
// 解码url地址，求去restaurant_category_id值
getCategoryId(url){
  let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name',''));
  if (/restaurant_category_id/gi.test(urlData)) {
    return JSON.parse(urlData).restaurant_category_id.id
  }else{
    return ''
  }
}
```

```js
//点击图标刷新页面
reload(){
    window.location.reload();
}
```

```js
/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
    let target;
    // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
    if (attr === 'scrollTop') {
        target = element.scrollTop;
    }else if(element.currentStyle){
        target = element.currentStyle[attr];
    }else{
        target = document.defaultView.getComputedStyle(element,null)[attr];
    }
    //在获取 opactiy 时需要获取小数 parseFloat
    return  NumberMode == 'float'? parseFloat(target) : parseInt(target);
}
```
