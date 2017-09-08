---
title: vue基础
---

# 独立构建VS运行时构建

有两种构建方式，独立构建和运行构建。它们的区别在于前者包含模板编译器而后者不包含。

模板编译用于编译 Vue 模板字符串成纯 JavaScript 渲染函数。如果你想用 template 选项， 你需要编译。

模板编译器的职责是将模板字符串编译为纯 JavaScript 的渲染函数。如果你想要在组件中使用 template 选项，你就需要编译器。

- 独立构建包含模板编译器并支持 template 选项。 它也依赖于浏览器的接口的存在，所以你不能使用它来为服务器端渲染。
- 运行时构建不包含模板编译器，因此不支持 template 选项，只能用 render 选项，但即使使用运行时构建，在单文件组件中也依然可以写模板，因为单文件组件的模板会在构建时预编译为 render 函数。运行时构建比独立构建要轻量30%，只有 17.14 Kb min+gzip大小。

默认 NPM 包导出的是 运行时 构建。为了使用独立构建，在 webpack 配置中添加下面的别名：

```js
resolve: {
  alias: {
    'vue$': 'vue/dist/vue.common.js'
  }
}
```

# 渲染性能

在 React 里，当某个组件的状态发生变化时，它会以该组件为根，重新渲染整个组件子树。
如要避免不必要的子组件的重渲染，你需要显式地在所有地方实现 shouldComponentUpdate 检测并使用不可变的数据结构。在 Vue 中，组件的依赖是在渲染过程中自动追踪的，所以系统能精确知晓哪个组件确实需要被重渲染。
这意味着，未经优化的 Vue 相比未经优化的 React 要快的多。由于 Vue 改进过渲染性能，甚至全面优化过的 React 通常也会慢于开箱即用的 Vue。

假如你要开发一个对性能要求比较高的数据可视化或者动画的应用时，你需要了解到下面这点：在开发中，Vue 每秒最高处理 10 帧，而 React 每秒最高处理不到 1 帧。
这是由于 React 有大量的检查机制，这会让它提供许多有用的警告和错误提示信息。我们同样认为这些是很重要的，但是我们在实现这些检查时，也更加密切地关注了性能方面。

ReactNative 能使你用相同的组件模型编写有本地渲染能力的 APP（iOS 和 Android）。能同时跨多平台开发，对开发者是非常棒的。相应地，Vue 和 Weex 会进行官方合作，Weex 是阿里的跨平台用户界面开发框架，Weex 的 JavaScript 框架运行时用的就是 Vue。这意味着在 Weex 的帮助下，你使用 Vue 语法开发的组件不仅仅可以运行在浏览器端，还能被用于开发 iOS 和 Android 上的原生应用。


在 Vue 中指令和组件分得更清晰。指令只封装 DOM 操作，而组件代表一个自给自足的独立单元 —— 有自己的视图和数据逻辑。在 Angular 中两者有不少相混的地方。

# 组件

组件系统是 Vue 的另一个重要概念，因为它是一种抽象，允许我们使用小型、自包含和通常可复用的组件构建大型应用。仔细想想，几乎任意类型的应用界面都可以抽象为一个组件树：

# 构造器

在实例化 Vue 时，需要传入一个选项对象，它可以包含数据、模板、挂载元素、方法、生命周期钩子等选项。

可以扩展 Vue 构造器，从而用预定义选项创建可复用的组件构造器：

```js
var MyComponent = Vue.extend({
// 扩展选项
})
// 所有的 `MyComponent` 实例都将以预定义的扩展选项被创建
var myComponentInstance = new MyComponent()
```

# 属性和方法

每个 Vue 实例都会代理其 data 对象里所有的属性

注意只有这些被代理的属性是响应的。

除了 data 属性， Vue 实例暴露了一些有用的实例属性与方法。这些属性与方法都有前缀 $，以便与代理的 data 属性区分。

# 实例生命周期
每个 Vue 实例在被创建之前都要经过一系列的初始化过程。例如，实例需要配置数据观测(data observer)、编译模版、挂载实例到 DOM ，然后在数据变化时更新 DOM 。在这个过程中，实例也会调用一些 生命周期钩子 ，这就给我们提供了执行自定义逻辑的机会。

# 模板语法

在底层的实现上， Vue 将模板编译成虚拟 DOM 渲染函数。结合响应系统，在应用状态改变时， Vue 能够智能地计算出重新渲染组件的最小代价并应用到 DOM 操作上。

通过使用 v-once 指令，你也能执行一次性地插值，当数据改变时，插值处的内容不会更新。但请留心这会影响到该节点上所有的数据绑定

注意，你不能使用 v-html 来复合局部模板，因为 Vue 不是基于字符串的模板引擎。组件更适合担任 UI 重用与复合的基本单元。

修饰符（Modifiers）是以半角句号 . 指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。例如，.prevent 修饰符告诉 v-on 指令对于触发的事件调用 event.preventDefault()：

```js
  <form v-on:submit.prevent="onSubmit"></form>
```

Vue 2.x 中，过滤器只能在 mustache 绑定和 v-bind 表达式（从 2.1.0 开始支持）中使用，因为过滤器设计目的就是用于文本转换。为了在其他指令中实现更复杂的数据变换，你应该使用计算属性。

过滤器函数总接受表达式的值作为第一个参数。

# 计算属性

计算属性是基于它们的依赖进行缓存的。计算属性只有在它的相关依赖发生改变时才会重新求值。这就意味着只要 message 还没有发生改变，多次访问 reversedMessage 计算属性会立即返回之前的计算结果，而不必再次执行函数。

计算属性默认只有 getter ，不过在需要时你也可以提供一个 setter ：

Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。这么做，除了使 Vue 变得非常快之外，还有一些有用的好处。例如，如果你允许用户在不同的登录方式之间切换:

注意， v-show 不支持 <template> 语法，也不支持 v-else。
# 条件渲染
v-if 是“真正的”条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。
v-if 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
相比之下， v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。
一般来说， v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件不太可能改变，则使用 v-if 较好。

# 列表渲染
 v-for 还支持一个可选的第二个参数为当前项的索引。
 ```html
 <ul id="example-2">
<li v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>
</ul>
 ```
你也可以用 of 替代 in 作为分隔符，因为它是最接近 JavaScript 迭代器的语法：

```html
  <div v-for="item of items"></div>
```
你也可以用 v-for 通过一个对象的属性来迭代。
```html
<ul id="repeat-object" class="demo">
<li v-for="value in object">
  {{ value }}
</li>
</ul>
```

在自定义组件里，你可以像任何普通元素一样用 v-for 。然而他不能自动传递数据到组件里，因为组件有自己独立的作用域。为了传递迭代数据到组件里，我们要用 props ：

```html
<my-component
v-for="(item, index) in items"
v-bind:item="item"
v-bind:index="index">
</my-component>
```
不自动注入 item 到组件里的原因是，因为这使得组件会紧密耦合到 v-for 如何运作。在一些情况下，明确数据的来源可以使组件可重用。

Vue 包含一组观察数组的变异方法，所以它们也将会触发视图更新。这些方法如下：

push()
pop()
shift()
unshift()
splice()
sort()
reverse()

变异方法(mutation method)，顾名思义，会改变被这些方法调用的原始数组。相比之下，也有非变异(non-mutating method)方法，例如： filter(), concat(), slice() 。这些不会改变原始数组，但总是返回一个新数组。当使用非变异方法时，可以用新数组替换旧数组：


你可能认为这将导致 Vue 丢弃现有 DOM 并重新渲染整个列表。幸运的是，事实并非如此。 Vue 实现了一些智能启发式方法来最大化 DOM 元素重用，所以用一个含有相同元素的数组去替换原来的数组是非常高效的操作。

有时也需要在内联语句处理器中访问原生 DOM 事件。可以用特殊变量 $event 把它传入方法：

在事件处理程序中调用 event.preventDefault() 或 event.stopPropagation() 是非常常见的需求。尽管我们可以在 methods 中轻松实现这点，但更好的方式是：methods 只有纯粹的数据逻辑，而不是去处理 DOM 事件细节。
为了解决这个问题， Vue.js 为 v-on 提供了 事件修饰符。通过由点(.)表示的指令后缀来调用修饰符。

.stop
.prevent
.capture
.self
.once

```html
  <!-- 阻止单击事件冒泡 -->
  <a v-on:click.stop="doThis"></a>
  <!-- 提交事件不再重载页面 -->
  <form v-on:submit.prevent="onSubmit"></form>
  <!-- 修饰符可以串联  -->
  <a v-on:click.stop.prevent="doThat"></a>
  <!-- 只有修饰符 -->
  <form v-on:submit.prevent></form>
  <!-- 添加事件侦听器时使用事件捕获模式 -->
  <div v-on:click.capture="doThis">...</div>
  <!-- 只当事件在该元素本身（而不是子元素）触发时触发回调 -->
  <div v-on:click.self="doThat">...</div>
  <!-- 点击事件将只会触发一次 -->
  <a v-on:click.once="doThis"></a>
```

Vue 允许为 v-on 在监听键盘事件时添加按键修饰符：

```html
<!-- 只有在 keyCode 是 13 时调用 vm.submit() -->
<input v-on:keyup.13="submit">

<!-- 同上 -->
<input v-on:keyup.enter="submit">
<!-- 缩写语法 -->
<input @keyup.enter="submit">

<!-- .enter
.tab
.delete (捕获 “删除” 和 “退格” 键)
.esc
.space
.up
.down
.left
.right -->
```

# 为什么在html中监听事件

你可能注意到这种事件监听的方式违背了关注点分离（separation of concern）传统理念。不必担心，因为所有的 Vue.js 事件处理方法和表达式都严格绑定在当前视图的 ViewModel 上，它不会导致任何维护上的困难。实际上，使用 v-on 有几个好处：
扫一眼 HTML 模板便能轻松定位在 JavaScript 代码里对应的方法。
因为你无须在 JavaScript 里手动绑定事件，你的 ViewModel 代码可以是非常纯粹的逻辑，和 DOM 完全解耦，更易于测试。
当一个 ViewModel 被销毁时，所有的事件处理器都会自动被删除。你无须担心如何自己清理它们。

在默认情况下， v-model 在 input 事件中同步输入框的值与数据 (除了 上述 IME 部分)，但你可以添加一个修饰符 lazy ，从而转变为在 change 事件中同步：

```js
  <input v-model.lazy="msg" >
```

# 组件

在 Vue.js 中，父子组件的关系可以总结为 props down, events up 。父组件通过 props 向下传递数据给子组件，子组件通过 events 给父组件发送消息。看看它们是怎么工作的。

组件实例的作用域是孤立的。这意味着不能(也不应该)在子组件的模板内直接引用父组件的数据。要让子组件使用父组件的数据，我们需要通过子组件的props选项。

子组件要显式地用 props 选项声明它期待获得的数据：

```js
Vue.component('child', {
  // 声明 props
  props: ['message'],
  // 就像 data 一样，prop 可以用在模板内
  // 同样也可以在 vm 实例中像 “this.message” 这样使用
  template: '<span>{{ message }}</span>'
})
```

组件实例的作用域是孤立的。这意味着不能(也不应该)在子组件的模板内直接引用父组件的数据。要让子组件使用父组件的数据，我们需要通过子组件的props选项。

当使用 DOM 作为模版时（例如，将 el 选项挂载到一个已存在的元素上）, 你会受到 HTML 的一些限制，因为 Vue 只有在浏览器解析和标准化 HTML 后才能获取模版内容。尤其像这些元素` <ul> ， <ol>， <table> ， <select> `限制了能被它包裹的元素，` <option> `只能出现在其它元素内部。

prop 是单向绑定的：当父组件的属性变化时，将传导给子组件，但是不会反过来。这是为了防止子组件无意修改了父组件的状态——这会让应用的数据流难以理解
。

另外，每次父组件更新时，子组件的所有 prop 都会更新为最新值。这意味着你不应该在子组件内部改变 prop 。如果你这么做了，Vue 会在控制台给出警告。

为什么我们会有修改prop中数据的冲动呢？通常是这两种原因：
prop 作为初始值传入后，子组件想把它当作局部数据来用；
prop 作为初始值传入，由子组件处理成其它数据输出。

注意在 JavaScript 中对象和数组是引用类型，指向同一个内存空间，如果 prop 是一个对象或数组，在子组件内部改变它会影响父组件的状态。

我们知道，父组件是使用 props 传递数据给子组件，但如果子组件要把数据传递回去，应该怎样做？那就是自定义事件！

每个 Vue 实例都实现了事件接口(Events interface)，即：
- 使用 $on(eventName) 监听事件
- 使用 $emit(eventName) 触发事件

Vue的事件系统分离自浏览器的EventTarget API。尽管它们的运行类似，但是$on 和 $emit 不是addEventListener 和 dispatchEvent 的别名。

另外，父组件可以在使用子组件的地方直接用 v-on 来监听子组件触发的事件。

> 不能用$on侦听子组件抛出的事件，而必须在模板里直接用v-on绑定

父组件：
```js
<parent>
  <child :child-msg="msg"></child>//这里必须要用 - 代替驼峰
</parent>

data(){
  return {
      msg: [1,2,3]
  };
}
```

子组件通过props来接收数据:

```js
  props: ['childMsg']

  props: {
    childMsg: Array //这样可以指定传入的类型，如果类型不对，会警告
  }

  props: {
    childMsg: {
        type: Array,
        default: [0,0,0] //这样可以指定默认的值
    }
  }
```

子组件与父组件通信

那么，如果子组件想要改变数据呢？这在vue中是不允许的，因为vue只允许单向数据传递，这时候我们可以通过触发事件来通知父组件改变数据，从而达到改变子组件数据的目的.

```html
子组件:
<template>
  <div @click="up"></div>
</template>

methods: {
  up() {
      this.$emit('upup','hehe'); //主动触发upup方法，'hehe'为向父组件传递的数据
  }
}
<div>
    <child @upup="change" :msg="msg"></child> //监听子组件触发的upup事件,然后调用change方法
</div>
methods: {
    change(msg) {
        this.msg = msg;
    }
}
```


如果2个组件不是父子组件那么如何通信呢？这时可以通过eventHub来实现通信.
所谓eventHub就是创建一个事件中心，相当于中转站，可以用它来传递事件和接收事件.

```html
  let Hub = new Vue(); //创建事件中心
  <div @click="eve"></div>
methods: {
    eve() {
        Hub.$emit('change','hehe'); //Hub触发事件
    }
}

<div></div>
created() {
    Hub.$on('change', () => { //Hub接收事件
        this.msg = 'hehe';
    });
}

这样就实现了非父子组件之间的通信了.原理就是把Hub当作一个中转站！
```

有时候两个组件也需要通信(非父子关系)。在简单的场景下，可以使用一个空的 Vue 实例作为中央事件总线

# slot

父组件模板的内容在父组件作用域内编译；子组件模板的内容在子组件作用域内编译。

类似地，分发内容是在父作用域内编译。

# 单个slot
假定 my-component 组件有下面模板：

```html
<div>
<h2>我是子组件的标题</h2>
<slot>
  只有在没有要分发的内容时才会显示。
</slot>
</div>
```
父组件模版：

```html
<div>
<h1>我是父组件的标题</h1>
<my-component>
<p>这是一些初始内容</p>
<p>这是更多的初始内容</p>
</my-component>
</div>
```
# 具名slot
```html
<div class="container">
<header>
<slot name="header"></slot>
</header>
<main>
<slot></slot>
</main>
<footer>
<slot name="footer"></slot>
</footer>
</div>


<app-layout>
  <h1 slot="header">这里可能是一个页面标题</h1>
  <p>主要内容的一个段落。</p>
  <p>另一个主要段落。</p>
  <p slot="footer">这里有一些联系信息</p>
</app-layout>
```

作用域插槽是一种特殊类型的插槽，用作使用一个（能够传递数据到）可重用模板替换已渲染元素。
在子组件中，只需将数据传递到插槽，就像你将 prop 传递给组件一样：

在父级中，具有特殊属性 scope 的 <template> 元素，表示它是作用域插槽的模板。scope 的值对应一个临时变量名，此变量接收从子组件中传递的 prop 对象：

作用域插槽更具代表性的用例是列表组件，允许组件自定义应该如何渲染列表每一项：

```html
<my-awesome-list :items="items">
  <!-- 作用域插槽也可以是具名的 -->
  <template slot="item" scope="props">
    <li class="my-fancy-item">{{ props.text }}</li>
  </template>
</my-awesome-list>
```

# 动态组件
通过使用保留的 `<component> `元素，动态地绑定到它的 is 特性，我们让多个组件可以使用同一个挂载点，并动态切换：

```html
var vm = new Vue({
  el: '#example',
  data: {
    currentView: 'home'
  },
  components: {
    home: { /* ... */ },
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})

<component v-bind:is="currentView">
  <!-- 组件在 vm.currentview 变化时改变！ -->
</component>
```

也可以直接绑定到组件对象上：

```js
var Home = {
  template: '<p>Welcome home!</p>'
  }
  var vm = new Vue({
  el: '#example',
  data: {
  currentView: Home
  }
})
```

# keep-alive

如果把切换出去的组件保留在内存中，可以保留它的状态或避免重新渲染。为此可以添加一个 keep-alive 指令参数：

```html
<keep-alive>
  <component :is="currentView">
    <!-- 非活动组件将被缓存！ -->
  </component>
</keep-alive>
```

# 编写可复用组件

在编写组件时，记住是否要复用组件有好处。一次性组件跟其它组件紧密耦合没关系，但是可复用组件应当定义一个清晰的公开接口。

在编写组件时，记住是否要复用组件有好处。一次性组件跟其它组件紧密耦合没关系，但是可复用组件应当定义一个清晰的公开接口。
Vue 组件的 API 来自三部分 - props, events 和 slots ：
Props 允许外部环境传递数据给组件
Events 允许组件触发外部环境的副作用
Slots 允许外部环境将额外的内容组合在组件中。

```html
<my-component
:foo="baz"
:bar="qux"
@event-a="doThis"
@event-b="doThat"
>
<img slot="icon" src="...">
<p slot="main-text">Hello!</p>
</my-component>
```

# 子组件索引

尽管有 props 和 events ，但是有时仍然需要在 JavaScript 中直接访问子组件。为此可以使用 ref 为子组件指定一个索引 ID 。例如：

```html
<div id="parent">
  <user-profile ref="profile"></user-profile>
</div>
```

```js
var parent = new Vue({ el: '#parent' })
// 访问子组件
var child = parent.$refs.profile
```

# 异步组件

在大型应用中，我们可能需要将应用拆分为多个小模块，按需从服务器下载。为了让事情更简单， Vue.js 允许将组件定义为一个工厂函数，动态地解析组件的定义。Vue.js 只在组件需要渲染时触发工厂函数，并且把结果缓存起来，用于后面的再次渲染。例如：

```js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // Pass the component definition to the resolve callback
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

# 递归组件

组件在它的模板内可以递归地调用自己，不过，只有当它有 name 选项时才可以：

# 对低开销的静态组件使用 v-once

尽管在 Vue 中渲染 HTML 很快，不过当组件中包含大量静态内容时，可以考虑使用 v-once 将渲染结果缓存起来，就像这样：

```js
Vue.component('terms-of-service', {
template: '\
  <div v-once>\
    <h1>Terms of Service</h1>\
    ... a lot of static content ...\
  </div>\
'
})
```

# 深入响应式原理
把一个普通 JavaScript 对象传给 Vue 实例的 data 选项，Vue 将遍历此对象所有的属性，并使用 Object.defineProperty 把这些属性全部转为 getter/setter。Object.defineProperty 是仅 ES5 支持，且无法 shim 的特性，这也就是为什么 Vue 不支持 IE8 以及更低版本浏览器的原因。

每个组件实例都有相应的 watcher 实例对象，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。

getter，setter，watcher，renderFunction，virtualDom

Vue 不能检测到对象属性的添加或删除。由于 Vue 会在初始化实例时对属性执行 getter/setter 转化过程，所以属性必须在 data 对象上存在才能让 Vue 转换它，这样才能让它是响应的。

Vue 不允许在已经创建的实例上动态添加新的根级响应式属性(root-level reactive property)。然而它可以使用 Vue.set(object, key, value) 方法将响应属性添加到嵌套的对象上：

# 异步队列更新

例如，当你设置 vm.someData = 'new value' ，该组件不会立即重新渲染。当刷新队列时，组件会在事件循环队列清空时的下一个“tick”更新。多数情况我们不需要关心这个过程，但是如果你想在 DOM 状态更新后做点什么，这就可能会有些棘手。虽然 Vue.js 通常鼓励开发人员沿着“数据驱动”的方式思考，避免直接接触 DOM，但是有时我们确实要这么做。为了在数据变化之后等待 Vue 完成更新 DOM ，可以在数据变化之后立即使用 Vue.nextTick(callback) 。这样回调函数在 DOM 更新完成后就会调用。例如：

```js
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'new message' // 更改数据
vm.$el.textContent === 'new message' // false
Vue.nextTick(function () {
vm.$el.textContent === 'new message' // true
})
```

在组件内使用 vm.$nextTick() 实例方法特别方便，因为它不需要全局 Vue ，并且回调函数中的 this 将自动绑定到当前的 Vue 实例上：
```js
Vue.component('example', {
template: '<span>{{ message }}</span>',
data: function () {
  return {
    message: 'not updated'
  }
},
methods: {
  updateMessage: function () {
    this.message = 'updated'
    console.log(this.$el.textContent) // => '没有更新'
    this.$nextTick(function () {
      console.log(this.$el.textContent) // => '更新完成'
    })
  }
}
})
```

# Render函数
Vue 推荐在绝大多数情况下使用 template 来创建你的 HTML。然而在一些场景中，你真的需要 JavaScript 的完全编程的能力，这就是 render 函数，它比 template 更接近编译器。

# 混合是一种灵活的分布式复用 Vue 组件的方式。混合对象可以包含任意组件选项。以组件使用混合对象时，所有混合对象的选项将被混入该组件本身的选项。

```js
// 定义一个混合对象
var myMixin = {
  created: function () {
  this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}
// 定义一个使用混合对象的组件
var Component = Vue.extend({
mixins: [myMixin]
})
var component = new Component() // -> "hello from mixin!"
```

当组件和混合对象含有同名选项时，这些选项将以恰当的方式混合。比如，同名钩子函数将混合为一个数组，因此都将被调用。另外，混合对象的 钩子将在组件自身钩子 之前 调用 ：
```js
var mixin = {
created: function () {
  console.log('混合对象的钩子被调用')
}
}
new Vue({
mixins: [mixin],
created: function () {
  console.log('组件钩子被调用')
}
})
// -> "混合对象的钩子被调用"
// -> "组件钩子被调用"

```

值为对象的选项，例如 methods, components 和 directives，将被混合为同一个对象。 两个对象键名冲突时，取组件对象的键值对。

```js
var mixin = {
methods: {
  foo: function () {
    console.log('foo')
  },
  conflicting: function () {
    console.log('from mixin')
  }
}
}
var vm = new Vue({
mixins: [mixin],
methods: {
  bar: function () {
    console.log('bar')
  },
  conflicting: function () {
    console.log('from self')
  }
}
})
vm.foo() // -> "foo"
vm.bar() // -> "bar"
vm.conflicting() // -> "from self"
```

也可以全局注册混合对象。 注意使用！ 一旦使用全局混合对象，将会影响到 所有 之后创建的 Vue 实例。使用恰当时，可以为自定义对象注入处理逻辑。

```js
// 为自定义的选项 'myOption' 注入一个处理器。
Vue.mixin({
created: function () {
  var myOption = this.$options.myOption
  if (myOption) {
    console.log(myOption)
  }
}
})
new Vue({
myOption: 'hello!'
})
// -> "hello!"
```

# 自定义指令
```js
// 注册一个全局自定义指令 v-focus
Vue.directive('focus', {
// 当绑定元素插入到 DOM 中。
inserted: function (el) {
// 聚焦元素
el.focus()
}
})
```

指令定义函数提供了几个钩子函数（可选）：
bind: 只调用一次，指令第一次绑定到元素时调用，用这个钩子函数可以定义一个在绑定时执行一次的初始化动作。
inserted: 被绑定元素插入父节点时调用（父节点存在即可调用，不必存在于 document 中）。
update: 被绑定元素所在的模板更新时调用，而不论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新（详细的钩子函数参数见下）。
componentUpdated: 被绑定元素所在模板完成一次更新周期时调用。
unbind: 只调用一次， 指令与元素解绑时调用。
接下来我们来看一下钩子函数的参数 (包括 el，binding，vnode，oldVnode) 。

# 插件

插件通常会为Vue添加全局功能。插件的范围没有限制——一般有下面几种：
添加全局方法或者属性，如: vue-element
添加全局资源：指令/过滤器/过渡等，如 vue-touch
通过全局 mixin方法添加一些组件选项，如: vuex
添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现。
一个库，提供自己的 API，同时提供上面提到的一个或多个功能，如 vue-router
Vue.js 的插件应当有一个公开方法 install 。这个方法的第一个参数是 Vue 构造器 , 第二个参数是一个可选的选项对象:

```js
MyPlugin.install = function (Vue, options) {
// 1. 添加全局方法或属性
Vue.myGlobalMethod = function () {
  // 逻辑...
}
// 2. 添加全局资源
Vue.directive('my-directive', {
  bind (el, binding, vnode, oldVnode) {
    // 逻辑...
  }
  ...
})
// 3. 注入组件
Vue.mixin({
  created: function () {
    // 逻辑...
  }
  ...
})
// 4. 添加实例方法
Vue.prototype.$myMethod = function (options) {
  // 逻辑...
}
}
```

通过全局方法 Vue.use() 使用插件:

Vue.use(MyPlugin, { someOption: true })


Vue.use 会自动阻止注册相同插件多次，届时只会注册一次该插件。
一些插件，如 vue-router 如果 Vue 是全局变量则自动调用 Vue.use() 。不过在模块环境中应当始终显式调用 Vue.use() :

```js
// 通过 Browserify 或 Webpack 使用 CommonJS 兼容模块
var Vue = require('vue')
var VueRouter = require('vue-router')
// 不要忘了调用此方法
Vue.use(VueRouter)
```
