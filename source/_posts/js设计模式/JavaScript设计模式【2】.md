---
title: JavaScript设计模式【2】
---

# 单例模式

单例模式的定义是：保证一个类仅有一个实例，并提供一个访问它的全局访问点。

```javascript
var Singleton = function (name) {
    this.name = name;
    this.instance = null;
  };

  Singleton.prototype.getName = function () {
    alert(this.name);
  }

  Singleton.getInstance = function (name) {
    if (!this.instance) {
      this.instance = new Singleton(name);
    }
    return this.instance;
  }

  var a = Singleton.getInstance('sven1');
  var b = Singleton.getInstance('sven2');

  alert(a===b); //true

  // 或者
  var Singleton = function (name) {
    this.name = name;
  }

  Singleton.prototype.getName = function () {
    alert(this.name);
  }

  Singleton.getInstance = (function () {
    var instance = null;
    return function (name) {
      if(!instance){
        instance = new Singleton(name);
      }
      return instance;
    }
  })();
```

## 透明的单例模式

```javascript
var CreateDiv = (function () {
    var instance;
    var CreateDiv = function (html) {
      if (instance) {
        return instance;
      }
      this.html = html;
      this.init();
      return instance = this;
    }

    CreateDiv.prototype.init = function () {
      var div = document.CreateElement('div');
      div.innerHTML = this.html;
      document.body.appendChild(div);
    };

    return CreateDiv;
  })();

  var a = new CreateDiv('sven1');
  var b = new CreateDiv('sven2');

  alert(a===b); //true
```

## 用代理实现单例模式

```javascript
var CreateDiv = function (html) {
    this.html = html;
    this.init();
  };

  CreateDiv.prototype.init = function () {
    var div = document.CreateElement('div');
    div.innerHTML = this.html;
    document.body.appendChild(div);
  }

  var ProxySingletonCreateDiv = (function () {
    var instance;
    alert('msg');
    return function (html) {
      if (!instance) {
        instance = new CreateDiv(html);
      }
      return instance;
    }
  })();

  var a = new ProxySingletonCreateDiv('sven1');
  var b = new ProxySingletonCreateDiv('sven2');

  alert(a===b);
```

## JavaScript中的单例

传统的单例模式实现在JavaScript中并不适用，无异于穿棉衣洗澡。单例模式的核心是确保只有一个实例，并提供全局访问。全局变量不是单例模式。但在JavaScript开发中，我们经常会把全局变量当成单例来使用。

例如；

```javascript
var a = {};
```

### 使用命名空间

动态地创建命名空间：

```javascript
var MyApp = {};
  MyApp.namespace = function (name) {
    var parts = name.split('.');
    var current = MyApp;
    for(var i in parts){
      if (!current[parts[i]]) {
        current[parts[i]]={};
      }
      current = current[parts[i]];
    }
  };
```

### 使用闭包封装私有变量

这种方法把一些变量封装在闭包的内部，只暴露一些接口跟外界通信：

```javascript
var user = (function () {
    var __name = 'sven',
        __age = 29;

    return {
      getUserInfo: function () {
        return __name + '-' + __age;
      }
    }
  })();
```

## 惰性单例

单事件发生时才生产实例。

```javascript
var createLoginLayer = (function () {
    var div;
    return function () {
      if(!div){
        div = document.CreateElement('div');
        div.innerHTML = '我是登录浮窗';
        div.style.display = 'none';
        document.body.appendChild(div);
      }

      return div;
    }
  })();
```

以上代码违反了单一职责原则，创建对象和管理单例的逻辑都放在createLoginLayer对象内部。

```javascript
var getSingle = function (fn) {
    var result;
    return function () {
      return result || (result = fn.apply(this,arguments));
    }
  }
```

# 策略模式

策略模式的定义是：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。

策略模式的目的就是将算法的使用与算法的实现分离开来。

```javascript
var strategies = {
    "S": function (salary) {
      return salary*4;
    },
    "A": function (salary) {
      return salary*3;
    },
    "B": function (salary) {
      return salary*2;
    }
  };

  var calculateBonus = function (level,salary) {
    return strategies[level](salary);
  };

  console.log(calculateBonus('S',20000));
  console.log(calculateBonus('A',10000));
```

## 多态在策略模式中的体现

```javascript
var Animate = function (dom) {
    this.dom = dom;
    this.startTime = 0;
    this.startPos = 0;
    this.endPos = 0;
    this.propertyName = null;
    this.easing = null;
    this.duration = null;
  };

  Animate.prototype.start = function (propertyName,endPos,duration,easing) {
    this.startTime = +new Date;
    this.startPos = this.dom.getBoundingClientRect()[propertyName];
    this.propertyName = propertyName;
    this.endPos = endPos;
    this.duration = duration;
    this.easing = tween[easing];

    var self = this;
    var timeId = setInterval(function () {
      if (self.step()===false) {
        clearInterval(timeId);
      }
    },19);
  }

  Animate.prototype.step = function () {
    var t = +new Date;
    if (t>=this.stratTime + this.duration) {
      this.update(this.endPos);
      return false;
    }
  }

  Animate.prototype.update = function (pos) {
    this.dom.style[this.propertyName] = pos + 'px';
  }
```

策略模式指的是定义一系列的算法，并且把它们封装起来。

### 表单校验

```javascript
var strategies = {
    isNonEmpty: function (value,errorMsg) {
      if(value === ''){
        return errorMsg;
      }
    },
    minLength: function (value,length,errorMsg) {
      if (value.length<length) {
        return erroeMsg;
      }
    },
    isMobile: function (value,errorMsg) {
      if (!/(^1[3][5][8][0-9]{9}$)/.test(value)) {
        return errorMsg;
      }
    }
  }

  var validateFunc = function () {
    var validator = new Validator();

    validator.add(registerForm.userName,'isNonEmpty','用户名不能为空')
    validator.add(registerForm.password,'minLength:6','密码长度不能少于6位')
    validator.add(registerForm.phoneNumber,'isMobile','手机号码格式不正确')

    var errorMsg = validator.start();
    return erroeMsg;
  };

  var registerForm = document.getElementsById('registerForm');
  registerForm.onsubmit = function () {
    var errorMsg = validateFunc();
    if (errorMsg) {
      alert(errorMsg);
      return false;
    }
  };

  var Validator = function () {
    this.cache = [];
  }

  Validator.prototype.add = function (dom,rule,erroeMsg) {
    var ary = rule.split(':');
    this.cache.push(function () {
      var strategy = ary.shift();
      ary.unshift(dom.value);
      ary.push(errorMsg);
      return strategies[strategy].apply(dom,ary);
    });
  }

  Validator.prototype.start = function () {
    for (var i = 0; validateFunc; validateFunc = this.cache[i++];) {
      var msg = validateFunc();
      if (msg) {
        return msg;
      }
    }
  };
```

优化代码

```javascript
/***********************策略对象**************************/
var strategies = {
    isNonEmpty: function(value, errorMsg) {
        if (value === '') {
            return errorMsg;
        }
    },
    minLength: function(value, length, errorMsg) {
        if (value.length < length) {
            return errorMsg;
        }
    },
    isMobile: function(value, errorMsg) {
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    }
};
/***********************Validator 类**************************/
var Validator = function() {
    this.cache = [];
};
Validator.prototype.add = function(dom, rules) {
    var self = this;
    for (var i = 0, rule; rule = rules[i++];) {
        (function(rule) {
            var strategyAry = rule.strategy.split(':');
            var errorMsg = rule.errorMsg;
            self.cache.push(function() {
                var strategy = strategyAry.shift();
                strategyAry.unshift(dom.value);
                strategyAry.push(errorMsg);
                return strategies[strategy].apply(dom, strategyAry);
            });
        })(rule)
    }
};
Validator.prototype.start = function() {
    for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
        var errorMsg = validatorFunc();
        if (errorMsg) {
            return errorMsg;
        }
    }
};
/***********************客户调用代码**************************/
var registerForm = document.getElementById('registerForm');
var validataFunc = function() {
    var validator = new Validator();
    validator.add(registerForm.userName, [{
        strategy: 'isNonEmpty',
        errorMsg: '用户名不能为空'
    }, {
        strategy: 'minLength:6',
        errorMsg: '用户名长度不能小于 10 位'
    }]);
    validator.add(registerForm.password, [{
        strategy: 'minLength:6',
        errorMsg: '密码长度不能小于 6 位'
    }]);
    validator.add(registerForm.phoneNumber, [{
        strategy: 'isMobile',
        errorMsg: '手机号码格式不正确'
    }]);
    var errorMsg = validator.start();
    return errorMsg;
}
registerForm.onsubmit = function() {
    var errorMsg = validataFunc();
    if (errorMsg) {
        alert(errorMsg);
        return false;
    }
};
```

- 策略模式利用组合，委托和多态等技术和思想，可以有效地避免多重条件选择语句。
- 策略模式提供了对开放和封闭原则的完美支持，将算法封装在独立的strategy中，使得它们易于切换，易于理解，易于扩张。
- 策略模式中的算法可以复用在系统的其他地方，从而避免许多重复的复制黏贴工作。
- 在策略模式中利用组合和委托来让Context拥有执行算法的能力，这也是继承的一种更轻便的替代方案。

# 代理模式

代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问。

保护代理：过滤请求。虚拟代理：把一些开销很大的对象，延迟到真正需要它的时候才去创建。

## 虚拟代理实现图片预加载

```javascript
var myImage = (function () {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);

    return {
      setSrc: function (src) {
        imgNode.src = src;
      }
    }
  })();

  myImage.setSrc('http://imgcache.qq.com/a.jpg');
```

用占位图提示用户图片正在加载。

```javascript
var myImage = (function () {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);

    return {
      setSrc: function (src) {
        imgNode.src = src;
      }
    }
  })();

  var proxyImage = (function () {
    var img = new Image;
    img.onload = function () {
      myImage.setSrc(this.src);
    }
    return {
      setSrc: function (src) {
        myImage.setSrc('loading.gif');
        img.src = src;
      }
    }
  })();

  proxyImage.setSrc('a.jpg');
```

面向对象设计的原则：单一职责原则。

单一职责原则指的是，就一个类(通常也包括对象和函数等)而言，应该仅有一个引起它变回的原因。如果一个对象承担多项职责，这意味着这个对象将变得巨大，引起它变化的原因可能会有多个。面向对象设计ᴁҴ将行为分布到细ዡ度的对象之中，如果一个对象承ઝ的职责过多， 等于把这些职责ᏸ合到了一起，这种ᏸ合会࠭致ᑠि和ͯ内ᐐ的设计。当变化发ၶ时，设计可能 会ᥒ到意外的ᆠ。

职责被定义为"引起变化的原因"另外，在面向对象的程序设计中，大多数情况下，若违反其他任何原则，同时将违反开放，封闭原则。

## 虚拟代理合并HTTP请求

在web开发中，也许最大的开销就是网络请求。

## 缓存代理

缓存代理可以为一些开销大的运算结果提供暂时的存储，在下次运算时，如果传递进来的参数跟之前一致，则可以直接返回前面存储的运算结果。

```javascript
var mult = function () {
    console.log('开始计算乘积');
    var a = 1;
    for (var i = 0; i < arguments.length; i++) {
      a = a*arguments[i]
    }

    return a;
  }

  // 加入缓存代理函数
  var proxyMult = (function () {
    var cache = {};
    return function () {
      var args = Array.prototype.join.call(arguments,',');
      if (args in cache) {
        return cache[args];
      }
      return cache[args] = mult.apply(this,arguments);
    }
  })();
```

## 缓存代理用于ajax异步请求数据

## 用高阶函数动态创建代理

```javascript
/**************** 计算˱ሤ *****************/
var mult = function() {
    var a = 1;
    for (var i = 0, l = arguments.length; i < l; i++) {
        a = a * arguments[i];
    }
    return a;
};
/**************** 计算加和 *****************/
var plus = function() {
    var a = 0;
    for (var i = 0, l = arguments.length; i < l; i++) {
        a = a + arguments[i];
    }
    return a;
};
/**************** 创建缓存代ူ的工ԇ *****************/
var createProxyFactory = function(fn) {
    var cache = {};
    return function() {
        var args = Array.prototype.join.call(arguments, ',');
        if (args in cache) {
            return cache[args];
        }
        return cache[args] = fn.apply(this, arguments);
    }
};
var proxyMult = createProxyFactory(mult),
    proxyPlus = createProxyFactory(plus);
alert(proxyMult(1, 2, 3, 4)); // 输出： 24
alert(proxyMult(1, 2, 3, 4)); // 输出： 24
alert(proxyPlus(1, 2, 3, 4)); // 输出： 10
alert(proxyPlus(1, 2, 3, 4)); // 输出： 10
```

## 其他代理

防火墙代理，远程代理，保护代理，智能引用代理，写时复制代理。

代理模式包括许多小分类，在 JavaScript 开发中最常用的是ᘾ拟代理和缓存代理。虽然代理 模式非常有用，但我们在编写业务代码的时候，往往不需要去ᮔ先࿮测是否需要使用代理模式。 当真正发现不方便直接᝺问某个对象的时候，再编写代理也不ᤌ。

# 迭代器模式

迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。

迭代器模式可以把迭代的过程从业务逻辑中分离出来，在使用迭代器模式之后，即使不关心对象的内部构造。也可以按顺序访问其中的每个元素。

迭代器模式无非就是循环访问聚合对象中的各个元素。

迭代器可以分为内部迭代器和外部迭代器，它们有各自的适用场景。

# 发布订阅模式

发布订阅模式又叫观察者模式。它定义对象的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。在JavaScript开发中，我们一般用事件模型来替代传统的发布订阅模式。

```javascript
var event = {
    clientList: [],
    listen: function(key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = [];
        }
        this.clientList[key].push(fn); // ᝠ᫝的๖息添加进缓存列表
    },
    trigger: function() {
        var key = Array.prototype.shift.call(arguments), // (1);
            fns = this.clientList[key];
        if (!fns || fns.length === 0) { // 如果没有ፄ定对应的๖息
            return false;
        }
        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments); // (2) // arguments 是 trigger 时ࣛʼ的参数
        }
    }
};
var installEvent = function(obj) {
    for (var i in event) {
        obj[i] = event[i];
    }
};

// 取消订阅的事件
event.remove = function(key, fn) {
    var fns = this.clientList[key];
    if (!fns) { // 如果 key 对应的๖息没有被̠ᝠ᫝，则ᄯଋ返回
        return false;
    }
    if (!fn) { // 如果没有͛入Хͳ的回调函数，表ᇧ需要取๖ key 对应๖息的੝有ᝠ᫝
        fns && (fns.length = 0);
    } else {
        for (var l = fns.length - 1; l >= 0; l--) { // ԥՓ᥅Ԋᝠ᫝的回调函数列表
            var _fn = fns[l];
            if (_fn === fn) {
                fns.splice(l, 1); // Ѻ除ᝠ᫝Ꮷ的回调函数
            }
        }
    }
};
var salesOffices = {};
var installEvent = function(obj) {
    for (var i in event) {
        obj[i] = event[i];
    }
}
installEvent(salesOffices);
salesOffices.listen('squareMeter88', fn1 = function(price) { // 小明ᝠ᫝๖息
    console.log('͈格= ' + price);
});
salesOffices.listen('squareMeter88', fn2 = function(price) { // 小ጙᝠ᫝๖息
    console.log('͈格= ' + price);
});
salesOffices.remove('squareMeter88', fn1); // Ѻ除小明的ᝠ᫝
salesOffices.trigger('squareMeter88', 2000000); // 输出： 2000000
```

# 命令模式

命令模式中的命令指的是一个执行某些特定事情的指令。

命令模式最常见的应用场景是：有时候需要向某些对象发送请求，但是并不知道请求的接受者是谁，也不知道被请求的操作是什么。此时希望用一种松耦合的方式来设计程序，使得请求发送者和请求接收者能够消除彼此之间的耦合关系。

命令模式的由来，其实是回调函数的一个面向对象的替代品。

用闭包实现的命令模式如下代码所示：

```javascript
var setCommand = function (button,func) {
    button.onclick = function () {
      func();
    }
  }

  var MenuBar = {
    refresh: function () {
      console.log('刷新菜单界面');
    }
  };

  var refreshMenuBarCommand = function (receiver) {
    return function () {
      receiver.refresh();
    };
  }

  var refreshMenuBarCommand = refreshMenuBarCommand(MenuBar);
  setCommand(button1,refreshMenuBarCommand);
```

命令模式的作用不仅是封装运算快，而且可以很方便地给命令对象增加撤销操作。

```javascript
var Ryu = {
    attack: function () {
      console.log('攻击');
    },
    defense: function () {
      console.log('防御');
    },
    jump: function () {
      console.log('跳跃');
    },
    crouch: function () {
      console.log('蹲下');
    }
  };

  var makeCommand = function (receiver,state) {
    return function () {
      receiver[state]();
    }
  };

  var commands = {
    '119':'jump',
    '115':'crouch',
    '97':'defense',
    '100':'attack'
  };

  var commandStack = [];

  document.onkeypress = function (ev) {
    var keyCode = ev.keyCode,
        command = makeCommand(Ryu,commands[keyCode]);

    if (command) {
      command();
      commandStack.push(command);
    }
  }

  document.getElementById('replay').onclick = function () {
    var commmand;
    while (command = commandStack.shift()) {
      command();
    }
  };
```

对象的生命周期几乎是永久的,除非我们主动去回收它。也就是说,命令对象的生命周期跟初始请求发生的时间无关，command对象的execute方法可以在程序运行的任何时刻执行。

# 组合模式

组合模式就是用小的子对象来构建更大的对象，而这些小的子对象本身也许是由更小的孙对象构成。

组合模式将对象组合成树形结构，以表示"部分-整体"的层次结构。除了用来表示树形结构之外，组合模式的另一个好处是通过帝乡的多态性表现，使得用户对单个对象和组合对象的使用具有一致性。

# 模板方法模式

基于继承的设计模式:模板方法模式。

## 模板方法模式的定义和组成

模板方法模式是一种只需使用继承就可以实现的非常简单的模式。

模板方法模式由两部分结构组成，第一部分是抽象父类，第二部分是具体的实现子类。通常在抽象父类中封装了子类的算法框架，包括实现一些公共方法以及封装子类中所有方法的执行顺序。子类通过继承这个抽象类,也继承整个算法结构,并且可以选择重写父类的方法。

```javascript
//创建抽象类-饮料
  var Beverage = function () {};

  Beverage.prototype.boilWater = function () {
    console.log('把水煮沸');
  };

  Beverage.prototype.brew = function () {}
  Beverage.prototype.pourInCup = function () {}
  Beverage.prototype.addCondiments = function () {}

  Beverage.prototype.init = function () {
    this.boilWater();
    this.brew();
    this.pourInCup();
    this.addCondiments();
  };

  //创建Coffee子类
  var Coffee = function () {};
  Coffee.prototype = new Beverage();
```

Beverage.prototype.init才是所谓的模板方法。原因是该方法中封装了子类的算法框架,它作为一个算法的模板,指导子类以何种顺序去执行哪些方法。

模板方法模式是一种严重依赖抽象类的设计模式。JavaScript在语言层面并没有提供对抽象类的支持,我们也很难模拟抽象类的实现。

由于抽象类不能实例化,那么这个抽象类一定是用来被某些具体类继承的。

模板方法模式的适用场景,UI组件。

- 初始化一个div容器;
- 通过ajax请求拉取相应的数据;
- 把数据渲染到div容器里面，完成组件的构造;
- 通知用户组件渲染完毕。

## 钩子方法

放置钩子是隔离变化的一种常见手段。我们在父类中容易变化的地方放置钩子，钩子可以有一个默认的实现,究竟要不要"挂钩",这由子类自行决定。

模板方法模式是一种典型的通过封装变化提高系统扩展性的设计模式。

# 享元模式

享元模式是一种用于性能优化的模式,核心是运用共享技术来有效支持大量细粒度的对象。

如果系统中因为创建了大量类似的对象而导致内存占用过高，享元模式就非常有用了。

享元模式要求将对象的属性划分为内部状态与外部状态(状态在这里通常指属性)。享元模式的目标是尽量减少共享对象的数量。

- 内部状态存储于对象内部。
- 内部状态可以被一些对象共享。
- 内部状态独立于具体的场景，通常不会改变。
- 外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享。

享元模式是一种用时间换空间的优化模式。

享元模式是一种很好的性能优化方案，但它也会带来一些复杂性的问题。

下列情况发生时可以使用享元模式。

- 一个程序中使用了大量的相似对象。
- 由于使用了大量对象,造成很大的内存开销。
- 对象的大多数状态都可以变为外部状态。
- 剥离出对象的外部状态之后，可以用相对较少的共享对象取代大量对象。

# 职责链模式

职责链模式的定义是:使多个对象都有机会处理请求。从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求。直到有一个对象处理它为止。

```javascript
var order500 = function (orderType,pay,stock) {
    if (orderType === 1 && pay === true) {
      console.log('500元定金预购,得到100优惠券');
    }else{
      return 'nextSuccessor';
    }
  };

  var order200 = function (orderType,pay,stock) {
    if (orderType === 1 && pay === true) {
      console.log('500元定金预购,得到100优惠券');
    }else{
      return 'nextSuccessor';
    }
  };

  var orderNormal = function (orderType,pay,stock) {
    if (stock > 0) {
      console.log('普通购买,无优惠券');
    }else{
      console.log('手机库存不足');
    }
  };

  // 接下来需要把函数包装进职责链节点
  // Chain.prototype.setNextSuccessor 指定在链中的下一个节点
  // Chain.prototype.passRequest 传递请求给某个节点

  var Chain = function (fn) {
    this.fn = fn;
    this.successor = null;
  };

  Chain.prototype.setNextSuccessor = function (successor) {
    return this.successor = successor;
  };

  Chain.prototype.passRequest = function () {
    var ret = this.fn.apply(this,arguments);

    if (ret === 'nextSuccessor') {
      return this.successor && this.successor.passRequest.apply(this.successor,arguments);
    }

    return ret;
  }

  // 现在我们把3个订单函数分别包装成职责链的节点:

  var chainOrder500 = new Chain(order500);
  var chainOrder200 = new Chain(order200);
  var chainOrderNormal = new Chain(orderNormal);

  // 然后指定节点在职责链中的顺序:

  chainOrder500.setNextSuccessor(chainOrder200);
  chainOrder200.setNextSuccessor(chainOrderNormal);

  //最后把请求传递给第一个节点:
  chainOrder500.passRequest(1,true,500);
  chainOrder500.passRequest(2,true,500);
  chainOrder500.passRequest(3,true,500);
  chainOrder500.passRequest(1,false,0);
```

异步职责链:

```javascript
var fn1 = new Chain(function () {
    console.log(1);
    return 'nextSuccessor';
  });

  var fn2 = new Chain(function () {
    console.log(2);
    var self = this;
    setTimeout(function () {
      self.next();
    },1000);
  });

  var fn3 = new Chain(function () {
    console.log(3);
  })

  fn1.setNextSuccessor(fn2).setNextSuccessor(fn3);
  fn1.passRequest();
```

职责链模式的最大优点就是解耦了请求发送者和N个接收者之间的复杂关系，由于不知道链中的哪个节点可以处理你发出的请求，所以你只需要把请求传递给第一个节点即可。

使用了职责链模式之后，链中的节点对象可以灵活地拆分重组。增加或删除一个节点，或者改变节点在链中的位置都是轻而易举的事情。

职责链模式还有一个优点，那就是可以手动指定起始节点。从性能方面考虑，我们要避免过长的职责链带来的性能损耗。

## 用AOP实现职责链

```javascript
Function.prototype.after = function (fn) {
    var self = this;
    return function () {
      var ret = self.apply(this,arguments);
      if (ret === 'nextSuccessor') {
        return fn.apply(this,arguments);
      }

      return ret;
    }
  }

  var order = order500yuan.after(order200yuan).after(orderNormal)
```

# 中介者模式

面向对象设计鼓励将行为分布到各个对象中，把对象划分成更小的粒度，有助于增强对象的可复用性，但由于这些细粒度对象之间的联系激增，又有可能会反过来降低它们的可复用性。

中介者模式的作用就是接触对象与对象之间的紧耦合关系。增加一个中介者对象后，所有的相关对象都通过中介者对象来通信，而不是相互引用，所以当一个对象发生改变时，只需要通知中介者对象即可。

中介者使各对象之间耦合松散，而且可以独立地改变他们之间的交互。

中介者模式使网状的多对多关系变成了相对简单的一对多关系。

中介者模式是迎合迪米特法则的一种实现。迪米特法则也叫最少知识原则，是指一个对象应该尽可能少地了解另外的对象。

中介模式使各个对象之间得以解耦，以中介者和对象之间的一对多关系取代了对象之间的网状多对多关系。

缺点是系统中会新增一个中介者对象，因为对象之间交互的复杂性，转移成了中介者对象的复杂性。

# 装饰者模式

在传统的面向对象语言中，给对象添加功能常常使用继承的方式，但是继承的方式并不灵活，还会带来许多问题:一方面会导致超类和子类之间存在强耦合性，当超类改变时，子类也会随之改变。

```js
  var plane {
    fire: function () {
      console.log('发射普通子弹');
    }
  }

  var missileDecorator = function () {
    console.log('发射导弹');
  }

  var atomDecorator = function () {
    console.log('发射原子弹');
  }

  var fire1 = plane.fire;

  plane.fire = function () {
    fire1();
    missileDecorator();
  }

  var fire2 = plane.fire;

  plane.fire = function () {
    fire2();
    atomDecorator();
  }

  plane.fire();
```

# 状态模式

状态模式的关键是区分失误内部的状态，事物内部状态的改变往往会带来事物的行为改变。
