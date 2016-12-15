---
title: JavaScript与XML
---

# DOM2级核心
在document.implementation中引入了createDocument()方法。可以使用以下语法来创建一个空白的XML文档:
```js
    var xmldom = document.implementation.createDocument(namespaceUri,root,doctype);
    var xmldom = document.implementation.createDocument("","root",null);
```

## DOMPareser类型
为了将XML解析为DOM文档，Firefox引入了DOMPareser类型;在解析XML之前，首先必须创建一个DOMParser的实例，然后再调用parseFromString()方法。
```js
var parser = new DOMParser();
var xmldom = parser.parseFromString("<root><child/></root>", "text/xml");
alert(xmldom.documentElement.tagName); //"root"
alert(xmldom.documentElement.firstChild.tagName); //"child"
var anotherChild = xmldom.createElement("child");
xmldom.documentElement.appendChild(anotherChild);
var children = xmldom.getElementsByTagName("child");
alert(children.length); //2
```
## XMLserializer类型
其提供了相反的功能将dom文档序列化为xml字符串要序列化dom文档首先必须创建xmlserializer的实例，然后将文档传入其serializeToString()方法，如下面的例子所示。
```js
var serializer = new XMLSerializer();
var xml = serializer.serializeToString(xmldom);
alert(xml);
```
