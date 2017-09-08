---
title: React基础
---

React是一个用于组建用户界面的JavaScript库，让你以更简单的方式来创建交互式用户界面。

- 当数据改变时，React将高效的更新和渲染需要更新的组件。声明性视图使你的代码更可预测，更容易调试。
- 构建封装管理自己的状态的组件，然后将它们组装成复杂的用户界面。由于组件逻辑是用JavaScript编写的，而不是模板，所以你可以轻松地通过您的应用程序传递丰富的数据，并保持DOM状态。
- 一次学习随处可写，学习React，你不仅可以将它用于Web开发，也可以用于React Native来开发Android和iOS应用。

# ReactDOM.render()

ReactDOM.render 是 React 的最基本方法，用于将模板转为 HTML 语言，并插入指定的 DOM 节点。

```js
ReactDOM.render(
<h1>Hello, world!</h1>,
document.getElementById('example')
);
```

# JSX

JSX 是一个看起来很像 XML 的 JavaScript 语法扩展。 每一个XML标签都会被JSX转换工具转换成纯JavaScript代码，使用JSX，组件的结构和组件之间的关系看上去更加清晰。
JSX并不是React必须使用的，但React官方建议我们使用 JSX , 因为它能定义简洁且我们熟知的包含属性的树状结构语法。

```js
React.render(//使用JSX
  <div>
      <div>
          <div>content</div>
      </div>
  </div>,
  document.getElementById('example')
);
React.render(//不使用JSX
  React.createElement('div', null,
      React.createElement('div', null,
          React.createElement('div', null, 'content')
      )
  ),
  document.getElementById('example')
);
```

# HTML标签 与 React组件 对比

React 可以渲染 HTML 标签 (strings) 或 React 组件 (classes)。
要渲染 HTML 标签，只需在 JSX 里使用小写字母开头的标签名。

# JavaScript 表达式

要使用 JavaScript 表达式作为属性值，只需把这个表达式用一对大括号 ({}) 包起来，不要用引号 (“”)。


```js
// 输入 (JSX):
var person = <Person name={window.isLoggedIn ? window.name : ''} />;
// 输出 (JS):
var person = React.createElement(
Person,
{name: window.isLoggedIn ? window.name : ''}
);
```

# 子节点表达式

同样地，JavaScript 表达式可用于描述子结点：

```js
// 输入 (JSX):
var content = <Container>{window.isLoggedIn ? <Nav /> : <Login />}</Container>;
// 输出 (JS):
var content = React.createElement(
Container,
null,
window.isLoggedIn ? React.createElement(Nav) : React.createElement(Login)
);
```

# 注释

JSX 里添加注释很容易；它们只是 JS 表达式而已。你只需要在一个标签的子节点内(非最外层)用 {} 包围要注释的部分。

```js
class ReactDemo extends Component {
render() {
return (
  <View style={styles.container}>
    {/*标签子节点的注释*/}
    <Text style={styles.welcome}
      //textAlign='right'
      textShadowColor='yellow'
      /*color='red'
      textShadowRadius='1'*/
      >
      React Native!
    </Text>
  </View>
);
}
}
```

# 不要试图去修改组件的属性

不推荐做法：

```js
var component = <Component />;
component.props.foo = x; // 不推荐
component.props.bar = y; // 不推荐
```

这样修改组件的属性，会导致React不会对组件的属性类型（propTypes）进行的检查。从而引发一些预料之外的问题。

推荐做法：

```js
  var component = <Component foo={x} bar={y} />;
```


# 延展属性（Spread Attributes）

你可以使用 JSX 的新特性 - 延展属性：

```js
var props = {};
props.foo = x;
props.bar = y;
var component = <Component {...props} />;
```

传入对象的属性会被复制到组件内。

它能被多次使用，也可以和其它属性一起用。注意顺序很重要，后面的会覆盖掉前面的。

```js
var props = { foo: 'default' };
var component = <Component {...props} foo={'override'} />;
console.log(component.props.foo); // 'override'
```

# Component

React 允许将代码封装成组件（component），然后像插入普通 HTML 标签一样，在网页中插入这个组件。

```js
var HelloMessage = React.createClass({
render: function() {
  return <h1>Hello {this.props.name}</h1>;
}
});
ReactDOM.render(
<HelloMessage name="John" />,
document.getElementById('example')
);
```
上面代码中，变量 HelloMessage 就是一个组件类。模板插入 <HelloMessage /> 时，会自动生成 HelloMessage 的一个实例。所有组件类都必须有自己的 render 方法，用于输出组件。

- 组件类的第一个字母必须大写。

- 组件类只能包含一个顶层标签。

# 组件的属性(props)

我们可以通过this.props.xx的形式获取组件对象的属性，对象的属性可以任意定义，但要避免与JavaScript关键字冲突。

# 遍历对象的属性：

this.props.children会返回组件对象的所有属性。
React 提供一个工具方法 React.Children 来处理 this.props.children 。我们可以用 React.Children.map或React.Children.forEach 来遍历子节点。

```js
var NotesList = React.createClass({
render: function() {
  return (
    <ol>
    {
      React.Children.map(this.props.children, function (child) {
        return <li>{child}</li>;
      })
    }
    </ol>
  );
}
});
ReactDOM.render(
<NotesList>
  <span>hello</span>
  <span>world</span>
</NotesList>,
document.body
);
```

# PropTypes

组件的属性可以接受任意值，字符串、对象、函数等等都可以。有时，我们需要一种机制，验证别人使用组件时，提供的参数是否符合要求。
组件类的PropTypes属性，就是用来验证组件实例的属性是否符合要求。

```js
var MyTitle = React.createClass({
propTypes: {
  title: React.PropTypes.string.isRequired,
},
render: function() {
   return <h1> {this.props.title} </h1>;
 }
});
```

此外，getDefaultProps 方法可以用来设置组件属性的默认值。

```js
var MyTitle = React.createClass({
getDefaultProps : function () {
  return {
    title : 'Hello World'
  };
},
render: function() {
   return <h1> {this.props.title} </h1>;
 }
});
ReactDOM.render(
<MyTitle />,
document.body
);
```

# ref 属性(获取真实的DOM节点)

组件并不是真实的 DOM 节点，而是存在于内存之中的一种数据结构，叫做虚拟 DOM （virtual DOM）。只有当它插入文档以后，才会变成真实的 DOM 。根据 React 的设计，所有的 DOM 变动，都先在虚拟 DOM 上发生，然后再将实际发生变动的部分，反映在真实 DOM上，这种算法叫做 DOM diff ，它可以极大提高网页的性能表现。

但是，有时需要从组件获取真实 DOM 的节点，这时就要用到 ref 属性。

```js
var MyComponent = React.createClass({
handleClick: function() {
  this.refs.myTextInput.focus();
},
render: function() {
  return (
    <div>
      <input type="text" ref="myTextInput" />
      <input type="button" value="Focus the text input" onClick={this.handleClick} />
    </div>
  );
}
});
ReactDOM.render(
<MyComponent />,
document.getElementById('example')
);
```

上面代码中，组件 MyComponent 的子节点有一个文本输入框，用于获取用户的输入。这时就必须获取真实的 DOM 节点，虚拟 DOM 是拿不到用户输入的。为了做到这一点，文本输入框必须有一个 ref 属性，然后 `this.refs.[refName]` 就会返回这个真实的 DOM 节点。
需要注意的是，由于 `this.refs.[refName]` 属性获取的是真实 DOM ，所以必须等到虚拟 DOM 插入文档以后，才能使用这个属性，否则会报错。上面代码中，通过为组件指定 Click 事件的回调函数，确保了只有等到真实 DOM 发生 Click 事件之后，才会读取 `this.refs.[refName]` 属性。
React 组件支持很多事件，除了 Click 事件以外，还有 KeyDown 、Copy、Scroll 等，完整的事件清单请查看官方文档。

> 心得：ref属性在开发中使用频率很高，使用它你可以获取到任何你想要获取的组件的对象，有个这个对象你就可以灵活地做很多事情，比如：读写对象的变量，甚至调用对象的函数。

# state

上文讲到了props，因为每个组件只会根据props 渲染了自己一次，props 是不可变的。为了实现交互，可以使用组件的 state 。this.state 是组件私有的，可以通过getInitialState()方法初始化，通过调用 this.setState() 来改变它。当 state 更新之后，组件就会重新渲染自己。
render() 方法依赖于 this.props 和 this.state ，框架会确保渲染出来的 UI 界面总是与输入（ this.props 和 this.state ）保持一致。


# 初始化state

通过getInitialState() 方法初始化state，在组件的生命周期中仅执行一次，用于设置组件的初始化 state 。
```js
  getInitialState:function(){
   return {favorite:false};
 }
```

# 更新 state
通过this.setState()方法来更新state，调用该方法后，React会重新渲染相关的UI。
this.setState({favorite:!this.state.favorite});

```js
var FavoriteButton=React.createClass({
getInitialState:function(){
  return {favorite:false};
},
handleClick:function(event){
  this.setState({favorite:!this.state.favorite});
},
render:function(){
  var text=this.state.favorite? 'favorite':'un favorite';
  return (
    <div type='button' onClick={this.handleClick}>
      You {text} this. Click to toggle.
    </div>
  );
}
});

```

# render

ReactComponent render()
render() 方法是必须的。
当该方法被回调的时候，会检测 this.props 和 this.state，并返回一个单子级组件。该子级组件可以是虚拟的本地 DOM 组件（比如 <div /> 或者 React.DOM.div()），也可以是自定义的复合组件。
你也可以返回 null 或者 false 来表明不需要渲染任何东西。实际上，React 渲染一个<noscript> 标签来处理当前的差异检查逻辑。当返回 null 或者 false 的时候，this.getDOMNode() 将返回 null。

render() 函数应该是纯粹的，也就是说该函数不修改组件的 state，每次调用都返回相同的结果，不读写 DOM 信息，也不和浏览器交互（例如通过使用 setTimeout）。如果需要和浏览器交互，在 componentDidMount() 中或者其它生命周期方法中做这件事。保持 render() 纯粹，可以使服务器端渲染更加切实可行，也使组件更容易被理解。

> 心得：不要在render()函数中做复杂的操作，更不要进行网络请求，数据库读写，I/O等操作。

# getInitialState

object getInitialState() 初始化组件状态，在组件挂载之前调用一次。返回值将会作为 this.state 的初始值。

> 心得：通常在该方法中对组件的状态进行初始化。

# getDefaultProps

object getDefaultProps()
设置组件属性的默认值，在组件类创建的时候调用一次，然后返回值被缓存下来。如果父组件没有指定 props 中的某个键，则此处返回的对象中的相应属性将会合并到 this.props （使用 in 检测属性）。

```js
getDefaultProps() {
  return {
    title: '',
    popEnabled:true
  };
},
```
该方法在任何实例创建之前调用，因此不能依赖于 this.props。另外，getDefaultProps() 返回的任何复杂对象将会在实例间共享，而不是每个实例拥有一份拷贝。

> 心得：该方法在你封装一个自定义组件的时候经常用到，通常用于为组件初始化默认属性。

# PropTypes

object propTypes
propTypes 对象用于验证传入到组件的 props。

```js
// var NavigationBar=React.createClass({
// propTypes: {
//   navigator:React.PropTypes.object,
//   leftButtonTitle: React.PropTypes.string,
//   leftButtonIcon: Image.propTypes.source,
//   popEnabled:React.PropTypes.bool,
//   onLeftButtonClick: React.PropTypes.func,
//   title:React.PropTypes.string,
//   rightButtonTitle: React.PropTypes.string,
//   rightButtonIcon:Image.propTypes.source,
//   onRightButtonClick:React.PropTypes.func
// },
```

> 心得：在封装组件时，对组件的属性通常会有类型限制，如：组件的背景图片，需要Image.propTypes.source类型，propTypes便可以帮你完成你需要的属性类型的检查。

# mixins
array mixins
mixin 数组允许使用混合来在多个组件之间共享行为。更多关于混合的信息，可参考Reusable Components。

> 心得：由于ES6不再支持mixins，所以不建议在使用mixins，我们可以用另外一种方式来替代mixins，请参考：React Native之React速学教程(下)-ES6不再支持Mixins。

# statics

object statics
statics 对象允许你定义静态的方法，这些静态的方法可以在组件类上调用。例如：

```js
var MyComponent = React.createClass({
statics: {
  customMethod: function(foo) {
    return foo === 'bar';
  }
},
render: function() {
}
});
MyComponent.customMethod('bar');  // true
```

在这个块儿里面定义的方法都是静态的，你可以通过ClassName.funcationName的形式调用它。
注意
这些方法不能获取组件的 props 和 state。如果你想在静态方法中检查 props 的值，在调用处把 props 作为参数传入到静态方法。

# displayName

string displayName
displayName 字符串用于输出调试信息。JSX 自动设置该值；可参考JSX in Depth。

# isMounted

boolean isMounted()，当组件被渲染到DOM，该方法返回true，否则返回false。该方法通常用于异步任务完成后修改state前的检查，以避免修改一个没有被渲染的组件的state。

> 心得：开发中不建议大家isMounted，大家可以使用另外一种更好的方式来避免修改没有被渲染的DOM，请下文的isMounted 是个反模式。

# 组件的生命周期(Component Lifecycle)

在iOS中UIViewController提供了(void)viewWillAppear:(BOOL)animated, - (void)viewDidLoad,(void)viewWillDisappear:(BOOL)animated等生命周期方法，在Android中Activity则提供了 onCreate(),onStart(),onResume() ,onPause(),onStop(),onDestroy()等生命周期方法，这些生命周期方法展示了一个界面从创建到销毁的一生。

那么在React 中组件(Component)也是有自己的生命周期方法的。

# 组件的生命周期分成三个状态：

Mounting：已插入真实 DOM
Updating：正在被重新渲染
Unmounting：已移出真实 DOM

> 心得：你会发现这些React 中组件(Component)的生命周期方法从写法上和iOS中UIViewController的生命周期方法很像，React 为每个状态都提供了两种处理函数，will 函数在进入状态之前调用，did 函数在进入状态之后调用。

# Mounting(装载)

getInitialState(): 在组件挂载之前调用一次。返回值将会作为 this.state 的初始值。
componentWillMount()：服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。
componentDidMount()：在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。

# Updating (更新)

componentWillReceiveProps(object nextProps) 在组件接收到新的 props 的时候调用。在初始化渲染的时候，该方法不会调用。
用此函数可以作为 react 在 prop 传入之后， render() 渲染之前更新 state 的机会。老的 props 可以通过 this.props 获取到。在该函数中调用 this.setState() 将不会引起第二次渲染。

shouldComponentUpdate(object nextProps, object nextState): 在接收到新的 props 或者 state，将要渲染之前调用。
该方法在初始化渲染的时候不会调用，在使用 forceUpdate 方法的时候也不会。如果确定新的 props 和 state 不会导致组件更新，则此处应该 返回 false。

> 心得：重写次方你可以根据实际情况，来灵活的控制组件当 props 和 state 发生变化时是否要重新渲染组件。

# Unmounting(移除)

componentWillUnmount：在组件从 DOM 中移除的时候立刻被调用。
在该方法中执行任何必要的清理，比如无效的定时器，或者清除在 componentDidMount 中创建的 DOM 元素。

# isMounted是个反模式

isMounted通常用于避免修改一个已经被卸载的组件的状态，因为调用一个没有被装载的组件的setState()方法，系统会抛出异常警告。

```js
if(this.isMounted()) { //不推荐
this.setState({...});
}
```

上面做法有点反模式，isMounted()起到作用的时候也就是组件被卸载之后还有异步操作在进行的时候，这就意味着一个被销毁的组件还持有着一些资源的引用，这会导致系统性能降低甚至内存溢出。

React 在设计的时候通过setState()被调用时做了一些检查，来帮助开发者发现被卸载的组件还持有一些资源的引用的情况。如何你使用了isMounted()，也就是跳过的React的检查，也就无法发现被卸载的组件还持有资源的问题。

既然isMounted()是反模式，那么有没有可替代方案呢？
我们可以通过在设置一个变量来表示组件的装载和卸载的状态，当componentDidMount被调用时该变量为true，当 componentWillUnmount被调用时，该变量为false，这样该变量就可以当isMounted()来使用。但还不够，到目前为止，我们只是通过变量来替代isMounted()，还没有做任何的优化，接下来我们需要在componentWillUnmount被调用时取消所有的异步回调，主动释放所有资源，这样就能避免被卸载的组件还持有资源的引用的情况，从而减少了内存溢出等情况的发生。

```js
class MyComponent extends React.Component {
componentDidMount() {
  mydatastore.subscribe(this);
}
render() {
  ...
}
componentWillUnmount() {
  mydatastore.unsubscribe(this);
}
}
```

使用可取消的Promise做异步操作。

```js
const cancelablePromise = makeCancelable(
new Promise(r => component.setState({...}}))
);
cancelablePromise
.promise
.then(() => console.log('resolved'))
.catch((reason) => console.log('isCanceled', reason.isCanceled));
cancelablePromise.cancel(); // Cancel the promise
```

# 可取消的Promise。

```js
const makeCancelable = (promise) => {
let hasCanceled_ = false;
const wrappedPromise = new Promise((resolve, reject) => {
  promise.then((val) =>
    hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
  );
  promise.catch((error) =>
    hasCanceled_ ? reject({isCanceled: true}) : reject(error)
  );
});
return {
  promise: wrappedPromise,
  cancel() {
    hasCanceled_ = true;
  },
};
};
```
