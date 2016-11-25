---
title: DOM
---
 DOM(文档对象模型)对针对HTML和XML文档的一个API(应用程序编程接口)。DOM描绘了一个层次化的节点树。允许开发人员添加、移除和修改页面的某一部分。DOM脱胎于DHTML(动态HTML)，但现在它已经成为表现和操作页面标记的正则的跨平台，语言中立的方式。IE中所有DOM对象都是以COM对象形式实现的。这以为着IE中的DOM对象与原生的JavaScript对象的行为或活动特点并不一致。

## 节点层次
DOM可以将任何HTMl或XML文档描绘成一个由多层节点构成的结构。文档节点是每个节点的根节点。文档元素是文档的最外层元素，文档中的其他所有元素都包含在文档元素中。每个文档只能有一个文档元素。在HTML中文档元素始终都是`<html>`元素。在XML中没有预定义的元素，因此任何元素都可能成为文档元素。
  * ### Node类型
  DOM1级定义了一个Node接口，该接口将由DOM中所有节点类型实现。JavaScript中的所有节点类型都继承自Node类型，因此所有的节点类型都共享着相同的节本属性和方法。每个节点都有一个nodeType属性，用于表明节点的类型。
   * Node.ELEMENT_NODE(1);
   * Node.ATTRIBUTE_NODE(2);
   * Node.TEXT_NODE(3);
   * Node.CDATA_SECTION_NODE(4);
   * Node.ENTITY_REFERENCE_NODE(5);
   * Node.PROCESSING_INSTRUCTION_NODE(6);
   * Node.COMMENT_NODE(7);
   * Node.DOCUMENT_NODE(8);
   * Node.DOCUMENT_TYPE_NODE(9);
   * Node.DOCUMENT_FRAGMENT_NODE(10);
   * Node.NOTATION_NODE(11);

 * ### 节点关系
 每个节点都有一个childNode属性，其中保存着一个NodeList对象。NodeList是一种类数组对象，用于保存一组有序节点，可以通过位置来访问这些节点。它实际上是基于DOM结构动态执行查询的结果，因此DOM结构的变化能够自动反映在NodeList对象中。可以用方括号，也可以用item()方法。
 ```js
  var firstchild = someNode.childNodes[0];
  var secondchild = someNode.childNodes.item(1);
 ```

 * ### 操作节点
 因为关系指针都是只读的，所以DOM提供了一些操作节点的方法。其中，最常用的方法是appendChild()，用于向childNodes列表的末尾添加一个节点。如果需要把节点放在childNodes列表中某个特定的位置上，而不是放在末尾，那么可以使用insertBefore()方法。
 这个方法接受两个参数:要插入的节点和作为参照的节点。插入节点后，被插入的节点会变成参照节点的前一个同胞节点，同事被方法返回。如果参照节点是null，则insertBefore()和appendChild()执行相同的操作。要替换节点则用replaceChild()方法接受的两个参数是:要插入的节点和要替换的节点。要替换的节点将由这个方法返回并从文档树中移除，同时由要插入的节点占据其位置。如果想移除而非替换节点可以使用removeChild()方法。这个方法接受一个参数，即要移除的节点。被移除的节点将成为方法的返回值。通过replaceChild()和removeChild()移除的节点仍然归文档所有，只不过在文档中已经没有了自己的位置。前面介绍的方法都是操作某个节点的子节点，也就是说，要使用这几个方法必须先取得父节点(使用parentNode属性)。另外不是所有类型的节点都有子节点。

 * ### 其他方法
 有两个方法是所有类型的节点都有的。第一个就是cloneNode()，用于创建调用这个方法的节点的一个完全的副本。cloneNode()方法接受一个布尔值参数，表示是否执行深复制。也就是复制节点及其整个节点树;如果参数为false则执行浅复制，即只复制几点本身。复制后的返回的节点副本归文档所有，但并没有为它指定父节点。因此，这个节点副本就成为了一个"孤儿"，除非通过appendChild()、insertBefore(或replaceChild)将它添加到文档中。cloneNode()方法不会复制添加到DOM节点中的JavaScript属性。最后一个方法是normalize()，这个方法唯一的作用是用来处理文档树中的文本节节点。

 * ### Document类型
 JavaScript通过Document类型表示文档。在浏览器中，document对象是HTMLDocument(继承自Document类型)的一个实例，表示整个HTML页面。特征:
  * nodeType的值为9;
  * nodeName的值为"#document";
  * nodeValue的值为null;
  * parentNode的值为null;
  * ownerDocument的值为null;
  * 其子节点可能是一个DocumentType(最多一个)、Element(最多一个)processingInstruction或comment。
 Document类型可以表示HTML页面或者其他基于XML的文档。不过最常见的应用还是作为HTMLDocument实例的document对象。通过整个文档对象，不仅可以取得与页面有关的信息，而且还能操作页面的外观及其底层的结构。
    * #### 文档子节点
    访问文档子节点的快捷方式:第一个就是documentElement属性，另一个是通过childNodes列表访问文档元素，所有浏览器都支持document.documentElement和document.body属性。Document另一个可能的子节点是DocumentType节点，通常将`<!DOCTYPE>`标签看成一个与文档其他部分不同的实体，可以通过doctype属性来访问它的信息。

    * #### 文档信息
    作为HTMLDocument的一个实例，document对象还有一些标准的Document对象所没有的属性。这些属性提供了document对象所表现的网页的一些信息。其中第一个属性就是title，URL、domain和referrer
    ```js
      // 取得完整的URL
      var url = document.URL;
      // 取得域名
      var domain = document.domain;
      // 取得来源页面的URL
      var referrer = document.referrer;
    ```
    通过把document.domain的值修改为相同值，来自不同子域的页面的JavaScript就可以互相通信了。浏览器对domain属性还有一个限制，如果域名一开始是"松散的(loose)"那么不能将它再设置为"紧绷的"(tight)。

    * #### 查找元素
    Document类型提供了两种方法:getElementById()和getElementByTagName()。HTMLCollection对象作为一个"动态"集合。还有一个getElementByName()方法

    * #### 特殊集合
    除了属性和方法，document对象还有一些特殊的集合。这些集合都是HTMLCollection对象，为访问文档常用的部分提供了快捷方式，包括:
      * document.anchors 包含文档中所有带name特性的`<a>元素`;
      * document.forms 包含文档中所有的`<form>元素`与document.getElementByTagName('form')结果一样;
      * document.images;
      * document.links;

    * #### 特殊集合
    由于DOM分为多个级别，也包含多个部分。因此检测浏览器实现了DOM的哪些部分就十分必要。document.implementation属性就是为此听相应信息和功能的对象，与浏览器对DOM的实现直接对应。DOM1级只为document.implementation添加了一个方法，即hasFeature()。这个方法接受两个参数:要检测的DOM功能的名称及版本号。

    * #### 文档写入
    将输出流写入到网页中的能力体现在一下4个方法中:write()，writeln()，open()和close()。其中，write()和writeln()方法都接受一个字符串参数，即要写入到输出流中的文本。write()会原样写入，而writeln()则会在字符串的末尾添加一个换行符`(\n)`。

 * ### Element类型
   * Element类型用于表现XML或HTML元素，提供了对元素标签名，子节点及特性的访问。Element节点具有一下特征:
    * nodeType 的值为1;
    * nodeName 的值为元素的标签名;
    * nodeValue 的值为null;
    * parentNode可能是Document或Element;
    * 其子节点可能是Element，Text，comment，processingInstruction，CDATAsection或EntityReference;
   * 每个HTML元素中都存在的下列标准特性。
    * id 元素在文档中的唯一标识符。
    * title 有关元素的附加说明信息，一般通过工具提示条显示出来。
    * lang 元素内容的语言代码
    * dir 语言的方向
    * className 类名
    每个元素都有一个或多个特性，这些特性的用途是给出相应元素或内容的附加信息。操作特性的DOM方法主要有三个:getAttribute()，setAttribute()和removeAttribute()这三个方法可以针对任何特性使用，包括哪些以HTMLElement类型属性的形式定义的特性。根据HTML5规范，自定义特性应该加上data-前缀以便验证。公认的特性可以通过访问属性的形式读取。getAttribute("style")返回一个对象，而getAttribute("onclick")返回一个函数。
  * attributes属性
  Element类型是使用attributes属性的唯一一个DOM节点类型。attributes属性中包含一个NameNodeMap，与NodeList类似，也是一个动态集合。
  * 创建元素
  使用document.createElement()方法可以创建新元素
  * 元素的子节点
  元素可以有任意数目的子节点和后代节点，因为元素可以是其他元素的子节点。
