---
title: ECMASCript6编程风格
---

# 块级作用域

## let 取代 var

`let`完全可以取代var,变量只在代码块内有效,避免变量提升

## 全局常量和线程安全

在`let`和`const`之间,建议优先使用`const`,尤其是在全局环境,不应该设置变量,只应该设置常量。

`const`可以提醒阅读程序的人,这个变量不应该改变;比较符合函数式编程思想,运算不改变值,只新建值,而且有利于将来分布式运算;而且JavaScript编译器会对const进行优化,多使用`const`有利于提高程序运行效率,本质区别在于编译器内部处理不同。

所有函数都应该设置成常量。长远看来,JavaScript可能会有多线程的实现,这样有利于保证线程安全。

# 字符串

静态字符串一律使用单引号或反引号,不使用双引号。动态字符串使用反引号。

```javascript
// bad
const a = "foobar";
const b = 'foo' + a + 'bar';

// acceptable
const c = `foobar`;

// good
const a = 'foobar';
const b = `foo${a}bar`;
const c = 'foobar';
```

# 解构赋值

使用数组成员对变量赋值时,优先使用解构赋值。

```javascript
const arr = [1, 2, 3, 4];

// bad
const first = arr[0];
const second = arr[1];

// good
const [first, second] = arr;
```

函数的参数如果是对象的成员,优先使用解构赋值。

```javascript
// bad
function getFullName(user) {
const firstName = user.firstName;
const lastName = user.lastName;
}

// good
function getFullName(obj) {
const { firstName, lastName } = obj;
}

// best
function getFullName({ firstName, lastName }) {
}
```

如果函数返回多个值,优先使用对象的解构赋值,而不是数组的解构赋值。这样便于以后添加返回值,以及更改返回值的顺序。

```javascript
// bad
function processInput(input) {
  return [left, right, top, bottom];
}

// good
function processInput(input) {
  return { left, right, top, bottom };
}

const { left, right } = processInput(input);
```

# 对象

单行定义的对象,最后一个成员不以逗号结尾。多行定义的对象,最后一个成员以逗号结尾。

```javascript
// bad
const a = { k1: v1, k2: v2, };
const b = {
  k1: v1,
  k2: v2
};

// good
const a = { k1: v1, k2: v2 };
const b = {
  k1: v1,
  k2: v2,
};
```

对象尽量静态化,一旦定义,就不得随意添加新的属性。如果添加属性不可避免,要使用`Object.assign`方法。

```javascript
// bad
const a = {};
a.x = 3;

// if reshape unavoidable
const a = {};
Object.assign(a, { x: 3 });

// good
const a = { x: null };
a.x = 3;
```

如果对象的属性名是动态的,可以在创造对象的时候,使用属性表达式定义。

```javascript
// bad
const obj = {
  id: 5,
  name: 'San Francisco',
};
obj[getKey('enabled')] = true;

// good
const obj = {
  id: 5,
  name: 'San Francisco',
  [getKey('enabled')]: true,
};
```

另外,对象的属性和方法,尽量采用简洁表达式,这样易于描述和书写。

```javascript
var ref = 'some value';

// bad
const atom = {
    ref: ref,

    value: 1,

    addValue: function(value) {
        return atom.value + value;
    },
};

// good
const atom = {
    ref,

    value: 1,

    addValue(value) {
        return atom.value + value;
    },
};
```

# 数组

使用扩展运算符(...)拷贝数组。

```javascript
// bad
  const len = items.length;
  const itemsCopy = [];
  let i;
  for(i=0;i<len;i++){
    itemsCopy[i] = items[i];
  }
  // good
  const itemsCopy = [...items];
```

使用Array.from方法,将类似数组的对象转为数组。

```javascript
const foo = document.querySelectorAlll('.foo');
  const nodes = Array.from(foo);
```

# 函数

立即执行函数可以写成箭头函数的形式。

```javascript
(()=>{
    console.log('welcome to the internet');
  })();
```

那些需要使用函数表达式的场合,尽量使用箭头函数代替。因为这样更简洁,而且绑定了this。

```javascript
//good
  [1,2,3].map((x) => {
    return x*x;
  })
  // best
  [1,2,3].map(x => x*x);
```

箭头函数取代Function.prototype.bind,不应再用self/_this/that绑定this。

```javascript
// bad
const self = this;
const boundMethod = function (...params) {
    return method.apply(self,params);
}

// acceptable
const boundMethod = method.bind(this);

// best
const boundMethod = (...params) => method.apply(this,params);
```

简单的,单行的,不会复用的函数,建议采用箭头函数。如果函数体比较复杂,行数较多,还是应该采用传统函数的写法。

所有配置项都应该集中在一个对象,放在最后一个参数,布尔值不可以直接作为参数。

```javascript
// bad
  function divide(a,b,option=false) {
  }
  // good
  function divide(a,b,{option = false}={}) {
  }
```

不要再函数体内使用arguments变量,使用rest运算符(...)代替。因为rest运算符显示表明你想要获取参数,而且arguments是一个类似数组的对象,而rest运算符可以提供一个真正的数组。

```javascript
// bad
function concatenateAll() {
  const args = Array.prototype.slice.call(arguments);
return args.join('');
}

// good
function concatenateAll(...args) {
  return args.join('');
}
```

使用默认语法设置函数参数的默认值。

```javascript
// bad
function handleThings(opts) {
  opts = opts || {};
}

// good
function handleThings(opts = {}) {
// ...
}
```

# Map结构

注意区分Object和map,只有模拟现实世界的实体对象时,才使用Object。如果只是需要key:value的数据结构,使用map结构,因为map有内建的遍历机制。

```javascript
let map = new Map(arr);
  for (let key of map.keys()) {
    console.log(key);
  }
  for (let value of map.values()) {
    console.log(value);
  }
  for (let item of map.entries()) {
    console.log(item[0],item[1]);
  }
```

# class

总是使用class,取代需要prototype的操作。因为class的写法更简洁，更易于理解。

```javascript
// bad
  function Queue(contens = []) {
    this._queue = [...contents];
  }
  Queue.prototype.pop = function () {
    const value = this._queue[0];
    this._queue.splice(0,1);
    return value;
  }

  // good
  class Queue{
    constructor(contens=[]){
      this._queue = [...contents];
    }
    pop(){
      const value = this._queue[0];
      this._queue.splice(0,1);
      return value;
    }
  }
```

使用extends实现继承,因为这样更简单,不会有破坏instanceof运算的危险。

```javascript
// bad
  const inherits = require('inherit');
  function peekableQueue(contents) {
    Queue.apply(this,contents);
  }
  inherit(peekableQueue,Queue);
  peekableQueue.prototype.peek = function function_name(argument) {
    return this._queue[0];
  }

  // good
  class peekableQueue extends Queue{
    peek(){
      return this._queue[0];
    }
  }
```

# 模块

首先,Module语法是JavaScript模块的标准写法,坚持使用这种写法。使用import取代require。

```js
  //bad
  const moduleA = require('moduleA');
  const func1 = moduleA.func1;
  const func2 = moduleA.func2;

  // good
  import {func1,func2} from 'moduleA';
```

使用export取代module.exports。

```js
// commonJs的写法
var React = require('react');

var Breadcrumbs = React.createClass({
  render(){
    return <nav/>;
  }
});

module.exports = Breadcrumbs;

// es6写法
import React from 'react';

const Breadcrumbs = React.createClass({
  render(){
    return <nav/>;
  }
});

export default Breadcrumbs
```

如果模块只有一个输出值,就使用export default,如果模块有多个输出值,就不使用export default,不要export default与普通的export同时使用。

不要再模块输入中使用通配符。因为这样可以确保你的模块之中,有一个默认输出(export default)。

```js
  import * as MyObject './importModule';

  import MyObject from './importModule';
```

如果模块默认输出一个函数,函数名的首字母应该小写。

```js
  function makeStyleGuide() {
  }
  export default makeStyleGuide;
```

如果模块默认输出一个对象,对象名的首字母应该大写。

```js
const StyleGuide = {
  es6:{

  }
};

export default StyleGuide;
```
