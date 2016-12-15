---
title: Json
---

# DOM2级核心
JSON(JavaScript Object Notation，JavaScript对象表示法)。JSON是JavaScript的一个严格的子集，利用了JavaScript中的一些模式来表示结构化数据。

## 语法
JSON的语法可以表示以下三种类型的值。
* 简单值:使用与JavaScript相同的语法，可以在JSON中表示字符串、数值、布尔值和null，但不支持JavaScript中的特殊值undefined。
* 对象:对象作为一种复杂的数据类型，表示的是一组无序的键值对。而每个键值对中的值可以是简单值，也可以是复杂数据类型的值。
* 数组:数组也是一种复杂数据类型，表示一组有序的值得列表，可以通过数值索引来访问其中的值。数值的值也可以是任意类型:简单值，对象或数值。

JSON不支持变量、函数或对象实例，它是一种表示结构化数据的格式，虽然与JavaScript中表示数据的某些语法相同，但它不局限于JavaScript的范畴。

JavaScript字符串与JSON字符串最大的区别在于，JSON字符串必须使用双引号(单引号会导致语法错误)。布尔值和null也是有效的JSON形式

JSON中的对象要求给属性加引号，与JavaScript的字面量相比，JSON对象有两个地方不一样。首先，没有声明变量(JSON中没有变量的概念)。其次，没有末尾分号

## 解析与序列化
可以把JSON数据结构解析为有用的JavaScript对象。与XML数据结构要解析成DOM文档而且从中提取数据极为麻烦相比，JSON可以解析为JavaScript对象的优势及其明显。早期的JSON解析器基本上就是使用JavaScript的eval()函数。由于JSON是JavaScript语法的子集，因此eval()函数可以解析、解释并返回JavaScript对象和数组。但使用eval()对JSON数据结构求值存在风险，因为可能会执行一些恶意代码。

JSON对象有两个方法:stringfy()和parse()。在简单情况下，这两个方法分别用于把JavaScript对象序列化为JSON字符串和把JSON字符串解析为原生JavaScript值。列如`
```js
var book = {
title: "Professional JavaScript",
authors: [
"Nicholas C. Zakas"
],
edition: 3,
year: 2011
};
var jsonText = JSON.stringify(book);
```
这个例子使用 JSON.stringify()把一个 JavaScript 对象序列化为一个 JSON 字符串，然后将它保 存在变量 jsonText 中。默认情况下， JSON.stringify()输出的 JSON 字符串不包含任何空格字符或 缩进，因此保存在 jsonText 中的字符串如下所示
```js
{"title":"Professional JavaScript","authors":["Nicholas C. Zakas"],"edition":3,
"year":2011}
```
将 JSON 字符串直接传递给 JSON.parse()就可以得到相应的 JavaScript 值。例如，使用下列代码 就可以创建与 book 类似的对象：
```js
var bookCopy = JSON.parse(jsonText);
```
## 序列化选项
实际上， JSON.stringify()除了要序列化的 JavaScript 对象外，还可以接收另外两个参数，这两 个参数用于指定以不同的方式序列化 JavaScript 对象。第一个参数是个过滤器，可以是一个数组，也可 以是一个函数；第二个参数是一个选项，表示是否在 JSON 字符串中保留缩进。单独或组合使用这两个 参数，可以更全面深入地控制 JSON 的序列化。

1. 过滤结果
如果过滤器参数是数组，那么 JSON.stringify()的结果中将只包含数组中列出的属性。来看下 面的例子。

```js
var book = {
	"title": "Professional JavaScript",
	"authors": [
		"Nicholas C. Zakas"
	],
	edition: 3,
	year: 2011
};
var jsonText = JSON.stringify(book, ["title", "edition"]);
```
JSON.stringify()的第二个参数是一个数组，其中包含两个字符串： "title"和"edition"。这 两个属性与将要序列化的对象中的属性是对应的，因此在返回的结果字符串中，就只会包含这两个属性：
```js
{"title":"Professional JavaScript","edition":3}
```
如果第二个参数是函数，行为会稍有不同。传入的函数接收两个参数，属性（键）名和属性值。根 据属性（键）名可以知道应该如何处理要序列化的对象中的属性。属性名只能是字符串，而在值并非键 值对儿结构的值时，键名可以是空字符串

```js
var book = {
"title": "Professional JavaScript",
"authors": [
"Nicholas C. Zakas"
],
edition: 3,
year: 2011
};
var jsonText = JSON.stringify(book, function(key, value){
switch(key){
case "authors":
return value.join(",")
case "year":
return 5000;
case "edition":
return undefined;
default:
return value;
}
});
```
## toJSON()方法
有时候， JSON.stringify()还是不能满足对某些对象进行自定义序列化的需求。在这些情况下， 可以给对象定义 toJSON()方法，返回其自身的 JSON 数据格式。原生 Date 对象有一个 toJSON()方法， 能够将 JavaScript的 Date 对象自动转换成 ISO 8601日期字符串（与在 Date 对象上调用 toISOString() 的结果完全一样）。
```js
var book = {
	"title": "Professional JavaScript",
	"authors": [
		"Nicholas C. Zakas"
	],
	edition: 3,
	year: 2011,
	toJSON: function () {
	}
};
var jsonText = JSON.stringify(book);
```
## 解析选项
JSON.parse()方法也可以接收另一个参数，该参数是一个函数，将在每个键值对儿上调用。为了 区别 JSON.stringify()接收的替换（过滤）函数（replacer），这个函数被称为还原函数（reviver）， 但实际上这两个函数的签名是相同的——它们都接收两个参数，一个键和一个值，而且都需要返回一 个值。 如果还原函数返回 undefined，则表示要从结果中删除相应的键；如果返回其他值，则将该值插 入到结果中。在将日期字符串转换为 Date 对象时，经常要用到还原函数。例如：
```js
ar
book = {
	"title": "Professional JavaScript",
	"authors": [
		"Nicholas C. Zakas"
	],
	edition: 3,
	year: 2011,
	releaseDate: new Date(2011, 11, 1)
};
var jsonText = JSON.stringify(book);
var bookCopy = JSON.parse(jsonText, function (key, value) {
	if (key == "releaseDate") {
		return new Date(value);
	} else {
		return value;
	}
});
alert(bookCopy.releaseDate.getFullYear());
```



