---
title: JavaScript设计模式
---
# 面向对象的JavaScript

## 动态类型语言和鸭子类型
动态类型语言在编译时便已确定变量的类型，而动态类型语言的变量类型要到程序运行时才会具有某种类型。

鸭子类型:如果它走起路来像鸭子，叫起来也是鸭子，那么它就是鸭子。

## 多态
多态的实际含义是:同一操作作用于不同的对象上面，可以产生不同的解释和不用的执行结果。换句话说，给不用的对象发送同一个消息的时候，这些对象会根据这个消息分别给出不用的反馈。

```js
 var makeSound = function(animal) {
   animal.sound();
 }
 var Duck = function() {}
 Duck.prototype.sound = function(){
	console.log('gg');
 }
 var Chicken = function() {}
 Chicken.prototype.sound = function() {
   console.log('jj');
 }
 makeSound(new Duck());
 makeSound(new Chicken());
```

多态在面向对象程序设计中的作用
```js
var googleMap = {
	show:function() {
	  console.log('开始渲染谷歌地图');
	}
}
var renderMap = function() {
  googleMap.show();
}

renderMap();
```
优化代码
```js
var renderMap = function(map) {
    if (map.show instanceof  Function) {
        map.show();
    }
}
renderMap(googleMap);
renderMap(baiduMap);
```

## 封装
封装的目的是将信息隐藏。一般而言，我们讨论的是封装数据和封装实现。

### 封装数据
在JavaScript中,我们可以通过变量的作用域来实现封装特性，只能模拟出public和private这两种封装性。

除了ECMAScript6中提供的let之外，一般我们可以通过函数来创建作用域:
```js
var myObject = (function(){
 var __name = 'sven';
 return {
 	getName:function() {
 	  return  __name;
 	}
 }
}) 
```
可通过Symbol创建私有属性。

### 封装实现
封装的目的是将信息隐藏，封装应该被视为"任何形式的封装"，也就是说，封装不仅仅是隐藏数据，还包括隐藏实现细节、设计细节以及隐藏对象的类型等。封装使得对象之间的耦合变松散，对象之间只能通过暴露API接口来通信。

### 封装类型
封装类型是静态类型语言中一种重要的封装方式。一般而言，封装类型是通过抽象类和接口来进行的。把对象的真正类型隐藏在抽象类或者接口之后。相比对象的类型，客户更关心对象的行为。

在JavaScript中，并没有对抽象类和接口的支持。

### 封装变化
从设计模式的角度出发，封装在更重要的层面体现为封装变化。

考虑你的设计中哪些地方可能变化，这种方式与关注会导致重新设计的原因相反。"找到变化并封装之"设计模式一书共归纳了23中设计模式。从意图上区分，这23种设计模式分别划分为创建型模式、结构型模式和行为型模式。创建型模式，要创建一个对象是一种抽象行为，而具体创建什么对象则是可以变化的，创建型模式的目的就是封装创建对象的变化。而结构型模式封装的是对象之间的组合关系。行为型模式封装的是对象的行为变化。

通过封装变化的方式，把系统中稳定不变的部分和容易变化的部分分离开来，在系统的演变过程中，我们只需要替换那些容易变化的部分。如果这些部分已经封装好的，替换起来也相对容易。这可以最大程度地保证程序的稳定性和可扩展性。

## 原型模式和基于原型继承的JavaScript对象系统

原型模式不单是一种设计模式，也被称为一种编程泛型。

### 使用克隆的原型模式
原型模式的实现关键，是语言本身是否提供了clone方法。ECMAScript5提供了Object.create方法，可以用来克隆对象。
```js
 var Plane = function(){
	this.blood=100;
	this.attacklevel=1;
	this.defenselevel=1;
 };
var Plane = new Plane();
Plane.blood=500;
Plane.attacklevel=10;
Plane.defenselevel=7;
var clonePlane = Object.create(plane);
console.log(clonePlane);
```

### 克隆是创建对象的手段
原型模式的目的是提供一种便捷的方式去创建某个类型的对象，克隆只是创建这个对象的过程和手段。

# this、call和apply
## this
JavaScript的this总是指向一个对象,而具体指向哪个对象是在运行时基于函数的执行环境动态绑定的,而非函数被声明时的环境。

### this的指向
除去不常用的with和eval的情况,具体到实际应用中,this的指向大致可以分为以下4种。
- 作为对象的方法调用。
- 作为普通函数调用。
- 构造器调用。
- Function.prototype.call或Function.prototype.apply调用

当函数作为对象的方法被调用时,this指向该对象;
```js
var obj = {
	a:1,
	getA:function() {
	  alert(this===obj);//true
	  alert(this.a);//输出:1
	}
};
obj.getA();
```

当函数不作为对象的属性被调用时,也就是我们常说的普通函数方式,此时的this总是指向全局对象。在浏览器的JavaScript里，这个全局对象是window对象。

```js
window.name = 'globalName';
var getName = function() {
  return this.name;
};
// 或者:
var MyObject = {
	name:'sven',
	getName:function(){
		return this.name;
	}
}
var getName = MyObject.getName;
console.log(getName());
```

JavaScript没有类,但是可以从构造器中创建对象,同时也提供了new运算符，使得构造器看起来更像一个类。

除了宿主提供的一些内置函数,大部分JavaScript函数都可以当做构造器使用。构造器的外表跟普通函数一模一样，它们的区别在于被调用的方式。当用new运算符调用函数时,该函数总会返回一个对象,通常情况下,构造器里面的this就指向返回的这个对象,见如下代码:
```js
var Myclass = function() {
  this.name = 'sven';
};
var obj = new Myclass();
alert(obj.name);
```
但用new调用构造器时,还要注意一个问题,如果构造器显示地返回了一个Object类型的对象,那么此次运算结果最终会返回这个对象,而不是我们之前期待的this:
```js
var Myclass = function() {
  this.name = 'sven';
  return {
  	name:'anne'
  }
}

var obj = new Myclass();
alert(obj.name);
```
如果构造器不显示地返回任何数据,或者返回一个非对象类型的数据,就不会造成上述问题;

跟普通的函数调用相比,用Function.prototype.call或者Function.prototype.apply可以动态地改变传入函数的this:
```js
var obj1 = {
	name:'sven',
	getName:function() {
	  return this.name
	}
}

var obj2 = {
	name:'anne'
}

console.log(obj1.getName()); //输出 sven
console.log(obj1.getName.call(obj2)); //输出 anne
```
call和apply方法能很好地体现JavaScript的函数式语言特性,在JavaScript中,几乎每一次编写函数式语言风格的代码,都离不开call和apply。

## call和apply
它们的作用一模一样,区别仅在于传入参数形式的不同。

apply接受两个参数，第一个参数指定了函数体内的this对象的指向，第二个参数为一个带下表的集合，这个集合可以是数组,也可以为类数组,apply方法把这个集合中的元素作为参数传递给被调用的函数;

```js
var func = function(a,b,c) {
  alert([a,b,c]);
}
func.apply(null,[1,2,3]);
```
call传入的参数数量不固定,跟apply相同的是,第一个参数也是代表函数体内的this指向,从第二个参数开始往后,每个参数被依次传入函数:
```js
var func = function(a,b,c) {
  alert([a,b,c]);
}
func.call(null,1,2,3);
```
当调用一个函数时,JavaScript的解释器并不会计较形参和实参在数量和类型以及顺序上的区别。当使用call或者apply时,如果我们传入的第一个参数为null,函数体内的this会指向默认的宿主对象,在浏览器中则是window;有时候我们使用call或者apply的目的不在于指定this指向,而是借用其他对象的方法。那么我们可以传入null来替代某个具体的对象;
```js
Math.max.apply(null,[1,2,3]);
```

## call和apply的用途
### 改变this指向
call和apply最常见的的用途是改变函数内部的this指向,大部分浏览器都实现了内置的Function.prototype.bind,用来指定函数内部的this指向,即使没有原生的Function.prototype.bind实现,
```js
Function.prototype.bind = function(context) {
  var sele = this;
  return function() {
    return self.apply(context,argument);
  }
}
```

### 借用其他对象的方法
借用方法的第一种场景是"借用构造函数",通过这种技术,可以实现一些类似继承的效果:
```js
var A = function(name) {
  this.name= name;
};
var B = function() {
  A.apply(this.arguments);
}
B.prototype.getName = function() {
  return this.name 
}
var b = new B('sven');
console.log(b.getName());
```
