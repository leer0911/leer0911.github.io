---
title: ECMASCript6汇总
---

# let

- 不存在变量提升
- 块级作用，可用来防止用来计数的循环变量泄露为全局变量。可替代立即执行函数（IIFE）
- 暂时性死区（TDZ）
- 不允许重复声明，因此不能在函数内部重新声明参数。

**ES5 规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明。ES6 引入了块级作用域，明确允许在块级作用域之中声明函数**

应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。

# const

const的作用域与let命令相同：只在声明所在的块级作用域内有效。

const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指针，const只能保证这个指针是固定的，至于它指向的数据结构是不是可变的，就完全不能控制了。

如果真的想将对象冻结，应该使用Object.freeze方法。

除了将对象本身冻结，对象的属性也应该冻结。下面是一个将对象彻底冻结的函数。

ES6 一共有6种声明变量的命令
`var function let const import class`

# global 对象

ES5的顶层对象，本身也是一个问题，因为它在各种实现里面是不统一的。

浏览器里面，顶层对象是window，但 Node 和 Web Worker 没有window。
浏览器和 Web Worker 里面，self也指向顶层对象，但是Node没有self。
Node 里面，顶层对象是global，但其他环境都不支持。

下面是两种勉强可以使用的方法。

```js
// 方法一
(typeof window !== 'undefined'
 ? window
 : (typeof process === 'object' &&
    typeof require === 'function' &&
    typeof global === 'object')
   ? global
   : this);

// 方法二
var getGlobal = function () {
if (typeof self !== 'undefined') { return self; }
if (typeof window !== 'undefined') { return window; }
if (typeof global !== 'undefined') { return global; }
throw new Error('unable to locate global object');
};

```

# 数组的解构赋值

从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。

可以从数组中提取值，按照对应位置，对变量赋值。

```js
  let [a, b, c] = [1, 2, 3];
```

这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值。

不完全解构

```js
let [a, [b], d] = [1, [2, 3], 4];
a // 1
b // 2
d // 4

```

对于 Set 结构，也可以使用数组的解构赋值。

```js
let [x, y, z] = new Set(['a', 'b', 'c']);
x // "a"
```

事实上，只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值。

```js
function* fibs() {
let a = 0;
let b = 1;
while (true) {
  yield a;
  [a, b] = [b, a + b];
}
}

let [first, second, third, fourth, fifth, sixth] = fibs();
sixth // 5
```

解构赋值允许指定默认值。

```js
let [foo = true] = [];
foo // true

let [x, y = 'b'] = ['a']; // x='a', y='b'
let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'

```

如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值。

```js
function f() {
console.log('aaa');
}

let [x = f()] = [1];
```

默认值可以引用解构赋值的其他变量，但该变量必须已经声明。
```js
let [x = 1, y = x] = [];     // x=1; y=1
let [x = 1, y = x] = [2];    // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = [];     // ReferenceError
```
上面最后一个表达式之所以会报错，是因为x用到默认值y时，y还没有声明。

# 对象的解构赋值

对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值。

```js
let { bar, foo } = { foo: "aaa", bar: "bbb" };
foo // "aaa"
bar // "bbb"

let { baz } = { foo: "aaa", bar: "bbb" };
baz // undefined
```

对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者。

```js
let { foo: baz } = { foo: "aaa", bar: "bbb" };
baz // "aaa"
foo // error: foo is not defined
```

上面代码中，foo是匹配的模式，baz才是变量。真正被赋值的是变量baz，而不是模式foo。

和数组一样，解构也可以用于嵌套结构的对象。

```js
var node = {
loc: {
  start: {
    line: 1,
    column: 5
  }
}
};

var { loc: { start: { line }} } = node;
line // 1
loc  // error: loc is undefined
start // error: start is undefined
```

对象的解构也可以指定默认值。

```js
var {x = 3} = {};
x // 3

var {x, y = 5} = {x: 1};
x // 1
y // 5

var {x:y = 3} = {};
y // 3

var {x:y = 3} = {x: 5};
y // 5

var { message: msg = 'Something went wrong' } = {};
msg // "Something went wrong"
```

默认值生效的条件是，对象的属性值严格等于undefined。

如果解构模式是嵌套的对象，而且子对象所在的父属性不存在，那么将会报错。

```js
// 报错
let {foo: {bar}} = {baz: 'baz'};
```

如果要将一个已经声明的变量用于解构赋值，必须非常小心。

对象的解构赋值，可以很方便地将现有对象的方法，赋值到某个变量。

let { log, sin, cos } = Math;

由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构。

# 字符串的解构赋值

类似数组的对象都有一个length属性，因此还可以对这个属性解构赋值。

```js
let {length : len} = 'hello';
len // 5
```

# 数值和布尔值的解构赋值

解构赋值时，如果等号右边是数值和布尔值，则会先转为对象。

解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错。

# 函数参数的解构赋值

```js
function add([x, y]){
return x + y;
}

add([1, 2]); // 3
```

函数参数的解构也可以使用默认值。

```js
function move({x = 0, y = 0} = {}) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]
```
```js
function move({x, y} = { x: 0, y: 0 }) {
return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]
```

undefined就会触发函数参数的默认值。

# 圆括号问题

如果模式中出现圆括号怎么处理。ES6的规则是，只要有可能导致解构的歧义，就不得使用圆括号。

## 不能使用圆括号的情况

变量声明语句中，不能带有圆括号。

```js
// 全部报错
let [(a)] = [1];

let {x: (c)} = {};
let ({x: c}) = {};
let {(x: c)} = {};
let {(x): c} = {};

let { o: ({ p: p }) } = { o: { p: 2 } };
```
函数参数中，模式不能带有圆括号。

```js
// 报错
function f([(z)]) { return z; }
```
赋值语句中，不能将整个模式，或嵌套模式中的一层，放在圆括号之中。

可以使用圆括号的情况只有一种：赋值语句的非模式部分，可以使用圆括号。

# 变量的解构赋值用途很多。

交换变量的值
```js
let x = 1;
let y = 2;

[x, y] = [y, x];
```

从函数返回多个值
```js
// 返回一个数组

function example() {
return [1, 2, 3];
}
let [a, b, c] = example();

// 返回一个对象

function example() {
return {
  foo: 1,
  bar: 2
};
}
let { foo, bar } = example();
```

函数参数的定义

```js
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});
```

提取JSON数据

```js
let jsonData = {
id: 42,
status: "OK",
data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "OK", [867, 5309]
```

函数参数的默认值

```js
jQuery.ajax = function (url, {
async = true,
beforeSend = function () {},
cache = true,
complete = function () {},
crossDomain = false,
global = true,
// ... more config
}) {
// ... do stuff
};
```

指定参数的默认值，就避免了在函数体内部再写`var foo = config.foo || 'default foo';`这样的语句。

```js
var map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key, value] of map) {
console.log(key + " is " + value);
}
// first is hello
// second is world
```

输入模块的指定方法
```js
  const { SourceMapConsumer, SourceNode } = require("source-map");
```

# 字符串扩展

## 字符串的遍历器接口

ES6为字符串添加了遍历器接口（详见《Iterator》一章），使得字符串可以被for...of循环遍历。

```js
for (let codePoint of 'foo') {
console.log(codePoint)
}
// "f"
// "o"
// "o"
```

## 模板字符串

```js
$('#result').append(`
There are <b>${basket.count}</b> items
 in your basket, <em>${basket.onSale}</em>
are on sale!
`);
```

```js
// 普通字符串
`In JavaScript '\n' is a line-feed.`

// 多行字符串
`In JavaScript this is
not legal.`

console.log(`string text line 1
string text line 2`);

// 字符串中嵌入变量
var name = "Bob", time = "today";
`Hello ${name}, how are you ${time}?`
```
模板字符串中嵌入变量，需要将变量名写在${}之中。

大括号内部可以放入任意的JavaScript表达式，可以进行运算，以及引用对象属性。

```js
var x = 1;
var y = 2;

`${x} + ${y} = ${x + y}`
// "1 + 2 = 3"

`${x} + ${y * 2} = ${x + y * 2}`
// "1 + 4 = 5"

var obj = {x: 1, y: 2};
`${obj.x + obj.y}`
// 3

```

模板字符串之中还能调用函数。

```js
function fn() {
return "Hello World";
}

`foo ${fn()} bar`
// foo Hello World bar
```

## 对象扩展

简洁表示法：

```js
  var obj = {foo}

  var objFn = {
    fn(){

    }
  }
```

属性名表达式

ES6 允许字面量定义对象时，用方法二（表达式）作为对象的属性名，即把表达式放在方括号内。

表达式还可以用于定义方法名。

```js
let obj = {
['h' + 'ello']() {
  return 'hi';
}
};

obj.hello() // hi
```

注意，属性名表达式与简洁表示法，不能同时使用，会报错。

有两种特殊情况：bind方法创造的函数，name属性返回bound加上原函数的名字；Function构造函数创造的函数，name属性返回anonymous。

如果对象的方法是一个 Symbol 值，那么name属性返回的是这个 Symbol 值的描述。


ES5比较两个值是否相等，只有两个运算符：相等运算符（==）和严格相等运算符（===）。它们都有缺点，前者会自动转换数据类型，后者的NaN不等于自身，以及+0等于-0。

Object.is就是部署这个算法的新方法。它用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。

不同之处只有两个：一是+0不等于-0，二是NaN等于自身。

Object.assign方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。

由于undefined和null无法转成对象，所以如果它们作为参数，就会报错。

Object.assign拷贝的属性是有限制的，只拷贝源对象的自身属性（不拷贝继承属性），也不拷贝不可枚举的属性（enumerable: false）。

Object.assign方法实行的是浅拷贝，而不是深拷贝。也就是说，如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用。

**注意，Object.assign可以用来处理数组，但是会把数组视为对象。**

### Object.assign方法有很多用处。

- 为对象添加属性
- 为对象添加方法
- 克隆对象
- 合并多个对象
- 为属性指定默认值
```js
const DEFAULTS = {
logLevel: 0,
outputFormat: 'html'
};

function processContent(options) {
options = Object.assign({}, DEFAULTS, options);
console.log(options);
// ...
}
```

### 属性的可枚举性

对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为。Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象。

```js
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, 'foo')
//  {
//    value: 123,
//    writable: true,
//    enumerable: true,
//    configurable: true
//  }
```

ES5有三个操作会忽略enumerable为false的属性。

for...in循环：只遍历对象自身的和继承的可枚举的属性
Object.keys()：返回对象自身的所有可枚举的属性的键名
JSON.stringify()：只串行化对象自身的可枚举的属性

ES6新增了一个操作Object.assign()，会忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。

这四个操作之中，只有for...in会返回继承的属性。实际上，引入enumerable的最初目的，就是让某些属性可以规避掉for...in操作。比如，对象原型的toString方法，以及数组的length属性，就通过这种手段，不会被for...in遍历到。

### 属性的遍历

ES6一共有5种方法可以遍历对象的属性。

（1）for...in

for...in循环遍历对象自身的和继承的可枚举属性（不含Symbol属性）。

（2）Object.keys(obj)

Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含Symbol属性）。

（3）Object.getOwnPropertyNames(obj)

Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含Symbol属性，但是包括不可枚举属性）。

（4）Object.getOwnPropertySymbols(obj)

Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有Symbol属性。

（5）Reflect.ownKeys(obj)

Reflect.ownKeys返回一个数组，包含对象自身的所有属性，不管是属性名是Symbol或字符串，也不管是否可枚举。

```js
const [a, ...b] = [1, 2, 3];
a // 1
b // [2, 3]
```


```js
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x // 1
y // 2
z // { a: 3, b: 4 }
```

解构赋值必须是最后一个参数，否则会报错。

```js
let { ...x, y, z } = obj; // 句法错误
let { x, ...y, ...z } = obj; // 句法错误
```

注意，解构赋值的拷贝是浅拷贝，即如果一个键的值是复合类型的值（数组、对象、函数）、那么解构赋值拷贝的是这个值的引用，而不是这个值的副本。

```js
let obj = { a: { b: 1 } };
let { ...x } = obj;
obj.a.b = 2;
x.a.b // 2
```

解构赋值不会拷贝继承自原型对象的属性。

```js
let o1 = { a: 1 };
let o2 = { b: 2 };
o2.__proto__ = o1;
let o3 = { ...o2 };
o3 // { b: 2 }
```

扩展运算符（...）用于取出参数对象的所有可遍历属性，拷贝到当前对象之中。

扩展运算符可以用于合并两个对象。

```js
let ab = { ...a, ...b };
// 等同于
let ab = Object.assign({}, a, b);
```

如果用户自定义的属性，放在扩展运算符后面，则扩展运算符内部的同名属性会被覆盖掉。

用来修改现有对象部分的部分属性就很方便了。

```js
let newVersion = {
...previousVersion,
name: 'New Name' // Override the name property
};
```

### Null 传导运算符

编程实务中，如果读取对象内部的某个属性，往往需要判断一下该对象是否存在。比如，要读取message.body.user.firstName，安全的写法是写成下面这样。

```js
const firstName = (message
&& message.body
&& message.body.user
&& message.body.user.firstName) || 'default';
```

这样的层层判断非常麻烦，因此现在有一个提案，引入了“Null 传导运算符”（null propagation operator）?.，简化上面的写法。

```js
  // const firstName = message?.body?.user?.firstName || 'default';
```

上面代码有三个`?.`运算符，只要其中一个返回null或undefined，就不再往下运算，而是返回undefined。

“Null 传导运算符”有四种用法。

```
obj?.prop // 读取对象属性
obj?.[expr] // 同上
func?.(...args) // 函数或对象方法的调用
new C?.(...args) // 构造函数的调用
```

```
// 如果 a 是 null 或 undefined, 返回 undefined
// 否则返回 a.b.c().d
a?.b.c().d

// 如果 a 是 null 或 undefined，下面的语句不产生任何效果
// 否则执行 a.b = 42
a?.b = 42

// 如果 a 是 null 或 undefined，下面的语句不产生任何效果
delete a?.b
```

## 函数的扩展

ES6 允许为函数的参数设置默认值，即直接写在参数定义的后面。
```js
function log(x, y = 'World') {
  console.log(x, y);
}

log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello
```

参数变量是默认声明的，所以不能用let或const再次声明。

```js
function foo(x = 5) {
  let x = 1; // error
  const x = 2; // error
}
```

另外，一个容易忽略的地方是，如果参数默认值是变量，那么参数就不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的。

```js
let x = 99;
function foo(p = x + 1) {
console.log(p);
}

foo() // 100

x = 100;
foo() // 101
```

参数默认值可以与解构赋值的默认值，结合起来使用。

```js
function foo({x, y = 5}) {
  console.log(x, y);
}

foo({}) // undefined, 5
foo({x: 1}) // 1, 5
foo({x: 1, y: 2}) // 1, 2
foo() // TypeError: Cannot read property 'x' of undefined
```

指定了默认值以后，函数的length属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，length属性将失真。

rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。

```js
function add(...values) {
  let sum = 0;

  for (var val of values) {
    sum += val;
  }

  return sum;
}

add(2, 5, 3) // 10
```

注意，rest 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错。

函数的length属性，不包括 rest 参数。

```js
(function(a) {}).length  // 1
(function(...a) {}).length  // 0
(function(a, ...b) {}).length  // 1
```

扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

替代数组的apply方法

```js
// ES5的写法
function f(x, y, z) {
// ...
}
var args = [0, 1, 2];
f.apply(null, args);

// ES6的写法
function f(x, y, z) {
// ...
}
var args = [0, 1, 2];
f(...args);
```

### 扩展运算符的应用

合并数组
与解构赋值结合
函数的返回值
字符串

扩展运算符还可以将字符串转为真正的数组。
```js
[...'hello']
// [ "h", "e", "l", "l", "o" ]
```

实现了Iterator接口的对象

```js
var nodeList = document.querySelectorAll('div');
var array = [...nodeList];
```

```js
var go = function*(){
  yield 1;
  yield 2;
  yield 3;
};

[...go()] // [1, 2, 3]
```

如果对没有iterator接口的对象，使用扩展运算符，将会报错

```js
var obj = {a: 1, b: 2};
let arr = [...obj]; // TypeError: Cannot spread non-iterable object
```

### 箭头函数

ES6允许使用“箭头”（=>）定义函数。

```js
  var f = v => v;
  // 等同于
  //
  var f = function(v) {
    return v;
  };
```

如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分。
```js
var f = () => 5;
// 等同于
var f = function () { return 5 };

var sum = (num1, num2) => num1 + num2;
// 等同于
var sum = function(num1, num2) {
return num1 + num2;
};
```

如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用return语句返回。

```js
  var sum = (num1, num2) => { return num1 + num2; }
```

由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号。

```js
  var getTempItem = id => ({ id: id, name: "Temp" });
```

箭头函数可以与变量解构结合使用。

```js
const full = ({ first, last }) => first + ' ' + last;

// 等同于
function full(person) {
return person.first + ' ' + person.last;
}
```

箭头函数的一个用处是简化回调函数。

```js
// 正常函数写法
[1,2,3].map(function (x) {
return x * x;
});

// 箭头函数写法
[1,2,3].map(x => x * x);
```

下面是rest参数与箭头函数结合的例子。

```js
const numbers = (...nums) => nums;

numbers(1, 2, 3, 4, 5)
// [1,2,3,4,5]

const headAndTail = (head, ...tail) => [head, tail];

headAndTail(1, 2, 3, 4, 5)
// [1,[2,3,4,5]]
```

### 使用注意点

（1）函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。

（2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。

（3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用Rest参数代替。

（4）不可以使用yield命令，因此箭头函数不能用作Generator函数。

**由于箭头函数没有自己的this，所以当然也就不能用call()、apply()、bind()这些方法去改变this的指向。**

下面是一个部署管道机制（pipeline）的例子，即前一个函数的输出是后一个函数的输入。

```js
const pipeline = (...funcs) =>
val => funcs.reduce((a, b) => b(a), val);

const plus1 = a => a + 1;
const mult2 = a => a * 2;
const addThenMult = pipeline(plus1, mult2);

addThenMult(5)
// 12
```
### 绑定 this
函数绑定运算符是并排的两个双冒号（::），双冒号左边是一个对象，右边是一个函数。该运算符会自动将左边的对象，作为上下文环境（即this对象），绑定到右边的函数上面。

```js
foo::bar;
// 等同于
bar.bind(foo);

foo::bar(...arguments);
// 等同于
bar.apply(foo, arguments);

const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
return obj::hasOwnProperty(key);
}
```

由于双冒号运算符返回的还是原对象，因此可以采用链式写法。

```js
// 例一
import { map, takeWhile, forEach } from "iterlib";

getPlayers()
::map(x => x.character())
::takeWhile(x => x.strength > 100)
::forEach(x => console.log(x));

// 例二
let { find, html } = jake;

document.querySelectorAll("div.myClass")
::find("p")
::html("hahaha");

```

### 尾调用优化

尾调用（Tail Call）是函数式编程的一个重要概念，本身非常简单，一句话就能说清楚，就是指某个函数的最后一步是调用另一个函数。


## Promise 对象

所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

1）对象的状态不受外界影响。
2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。

Promise也有一些缺点。首先，无法取消Promise，一旦新建它就会立即执行，无法中途取消。

ES6规定，Promise对象是一个构造函数，用来生成Promise实例。

```js
var promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。它们是两个函数，由JavaScript引擎提供，不用自己部署。

Promise实例生成以后，可以用then方法分别指定Resolved状态和Reject状态的回调函数。

```js
promise.then(function(value) {
// success
}, function(error) {
// failure
});
```

Promise新建后就会立即执行。

```js
let promise = new Promise(function(resolve, reject) {
console.log('Promise');
resolve();
});

promise.then(function() {
console.log('Resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// Resolved
```

then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。因此可以采用链式写法，即then方法后面再调用另一个then方法。

Promise.prototype.catch方法是.then(null, rejection)的别名，用于指定发生错误时的回调函数。

```js
getJSON('/posts.json').then(function(posts) {
// ...
}).catch(function(error) {
// 处理 getJSON 和 前一个回调函数运行时发生的错误
console.log('发生错误！', error);
});
```

Promise.all方法用于将多个Promise实例，包装成一个新的Promise实例。

```js
  var p = Promise.all([p1, p2, p3]);
```

p的状态由p1、p2、p3决定，分成两种情况。

（1）只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。

（2）只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。

```js
// 生成一个Promise对象的数组
var promises = [2, 3, 5, 7, 11, 13].map(function (id) {
  return getJSON("/post/" + id + ".json");
});

Promise.all(promises).then(function (posts) {
// ...
}).catch(function(reason){
// ...
});
```

Promise.race方法的参数与Promise.all方法一样，如果不是 Promise 实例，就会先调用下面讲到的Promise.resolve方法，将参数转为 Promise 实例，再进一步处理。

有时需要将现有对象转为Promise对象，Promise.resolve方法就起到这个作用。

```js
  var jsPromise = Promise.resolve($.ajax('/whatever.json'));
```

使用Generator函数管理流程，遇到异步操作的时候，通常返回一个Promise对象。

```js
function getFoo () {
  return new Promise(function (resolve, reject){
    resolve('foo');
  });
}

var g = function* () {
  try {
    var foo = yield getFoo();
    console.log(foo);
  } catch (e) {
    console.log(e);
  }
};

function run (generator) {
  var it = generator();

  function go(result) {
    if (result.done) return result.value;

    return result.value.then(function (value) {
      return go(it.next(value));
    }, function (error) {
      return go(it.throw(error));
    });
  }

  go(it.next());
}

run(g);
```
