---
title: vue-router
---

## 简单路由

```js
// 0. 如果使用模块化机制编程，導入Vue和VueRouter，要调用 Vue.use(VueRouter)
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 1. 定义（路由）组件。
// 可以从其他文件 import 进来
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
  router
}).$mount('#app')

// 现在，应用已经启动了！
```


## 动态路由匹配

```js
const router = new VueRouter({
routes: [
  // 动态路径参数 以冒号开头
  { path: '/user/:id', component: User }
]
})
```

一个『路径参数』使用冒号 : 标记。 `$route.params` `$route.query` `$route.hash`

复用组件时，想对路由参数的变化作出响应的话，你可以简单地 watch（监测变化） $route 对象：

```js
const User = {
  template: '...',
  watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
    }
  }
}
```

## 嵌套路由

要在嵌套的出口中渲染组件，需要在 VueRouter 的参数中使用 children 配置：

```js
const router = new VueRouter({
routes: [
  { path: '/user/:id', component: User,
    children: [
      {
        // 当 /user/:id/profile 匹配成功，
        // UserProfile 会被渲染在 User 的 <router-view> 中
        path: 'profile',
        component: UserProfile
      },
      {
        // 当 /user/:id/posts 匹配成功
        // UserPosts 会被渲染在 User 的 <router-view> 中
        path: 'posts',
        component: UserPosts
      }
    ]
  }
]
})
```

要注意，以 / 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径。

## 编程式的导航

- router.push(location)

除了使用 <router-link> 创建 a 标签来定义导航链接，我们还可以借助 router 的实例方法，通过编写代码来实现。

想要导航到不同的 URL，则使用 router.push 方法。这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。

当你点击 <router-link> 时，这个方法会在内部调用，所以说，点击 <router-link :to="..."> 等同于调用 router.push(...)。

```js
// 字符串
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user', params: { userId: 123 }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```

- router.replace(location)

跟 router.push 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。

- router.go(n)

这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似 window.history.go(n)。

你也许注意到 router.push、 router.replace 和 router.go 跟 window.history.pushState、 window.history.replaceState 和 window.history.go好像， 实际上它们确实是效仿 window.history API 的。

还有值得提及的，vue-router 的导航方法 （push、 replace、 go） 在各类路由模式（history、 hash 和 abstract）下表现一致。

## 命名路由

要链接到一个命名路由，可以给 router-link 的 to 属性传一个对象：

```js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})

  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-
```

## 命名视图

有时候想同时（同级）展示多个视图，而不是嵌套展示。如果 router-view 没有设置名字，那么默认为 default。

```js
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

一个视图使用一个组件渲染，因此对于同个路由，多个视图就需要多个组件。确保正确使用 components 配置（带上 s）：

```js
const router = new VueRouter({
routes: [
  {
    path: '/',
    components: {
      default: Foo,
      a: Bar,
      b: Baz
    }
  }
]
})
```

## 重定向 和 别名

- 重定向

重定向也是通过 routes 配置来完成，下面例子是从 /a 重定向到 /b：
```js
const router = new VueRouter({
routes: [
  { path: '/a', redirect: '/b' }
]
})
```

重定向的目标也可以是一个命名的路由：

```js
const router = new VueRouter({
routes: [
  { path: '/a', redirect: { name: 'foo' }}
]
})

```

甚至是一个方法，动态返回重定向目标：

```js
const router = new VueRouter({
routes: [
  { path: '/a', redirect: to => {
    // 方法接收 目标路由 作为参数
    // return 重定向的 字符串路径/路径对象
  }}
]
})
```

- 别名

『重定向』的意思是，当用户访问 /a时，URL 将会被替换成 /b，然后匹配路由为 /b，那么『别名』又是什么呢？

/a 的别名是 /b，意味着，当用户访问 /b 时，URL 会保持为 /b，但是路由匹配则为 /a，就像用户访问 /a 一样。

上面对应的路由配置为：

```js
const router = new VueRouter({
routes: [
  { path: '/a', component: A, alias: '/b' }
]
})
```

『别名』的功能让你可以自由地将 UI 结构映射到任意的 URL，而不是受限于配置的嵌套路由结构。

## HTML5 History 模式

vue-router 默认 hash 模式 —— 使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载。

如果不想要很丑的 hash，我们可以用路由的 history 模式，这种模式充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面。

```js
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

当你使用 history 模式时，URL 就像正常的 url

不过这种模式要玩好，还需要后台配置支持。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问 http://oursite.com/user/id 就会返回 404，这就不好看了。

所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。

给个警告，因为这么做以后，你的服务器就不再返回 404 错误页面，因为对于所有路径都会返回 index.html 文件。为了避免这种情况，你应该在 Vue 应用里面覆盖所有的路由情况，然后在给出一个 404 页面。

```js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

## 导航钩子

正如其名，vue-router 提供的导航钩子主要用来拦截导航，让它完成跳转或取消。有多种方式可以在路由导航发生时执行钩子：全局的, 单个路由独享的, 或者组件级的。

- 全局钩子

你可以使用 router.beforeEach 注册一个全局的 before 钩子：

```js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
// ...
})
```

同样可以注册一个全局的 after 钩子，不过它不像 before 钩子那样，after 钩子没有 next 方法，不能改变导航：

- 某个路由独享的钩子

你可以在路由配置上直接定义 beforeEnter 钩子：

```js
const router = new VueRouter({
routes: [
  {
    path: '/foo',
    component: Foo,
    beforeEnter: (to, from, next) => {
      // ...
    }
  }
]
})
```

- 组件内的钩子

```js
const Foo = {
template: `...`,
beforeRouteEnter (to, from, next) {
  // 在渲染该组件的对应路由被 confirm 前调用
  // 不！能！获取组件实例 `this`
  // 因为当钩子执行前，组件实例还没被创建
},
beforeRouteUpdate (to, from, next) {
  // 在当前路由改变，但是该组件被复用时调用
  // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
  // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
  // 可以访问组件实例 `this`
},
beforeRouteLeave (to, from, next) {
  // 导航离开该组件的对应路由时调用
  // 可以访问组件实例 `this`
}
}
```

beforeRouteEnter 钩子 不能 访问 this，因为钩子在导航确认前被调用,因此即将登场的新组件还没被创建。

不过，你可以通过传一个回调给 next来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。

```js
beforeRouteEnter (to, from, next) {
next(vm => {
  // 通过 `vm` 访问组件实例
})
}
```

你可以 在 beforeRouteLeave 中直接访问 this。这个 leave 钩子通常用来禁止用户在还未保存修改前突然离开。可以通过 next(false) 来取消导航。

## 路由元信息

定义路由的时候可以配置 meta 字段：

```js
const router = new VueRouter({
routes: [
  {
    path: '/foo',
    component: Foo,
    children: [
      {
        path: 'bar',
        component: Bar,
        // a meta field
        meta: { requiresAuth: true }
      }
    ]
  }
]
})

```

首先，我们称呼 routes 配置中的每个路由对象为 路由记录。路由记录可以是嵌套的，因此，当一个路由匹配成功后，他可能匹配多个路由记录

一个路由匹配到的所有路由记录会暴露为 $route 对象（还有在导航钩子中的 route 对象）的 $route.matched 数组。因此，我们需要遍历 $route.matched 来检查路由记录中的 meta 字段。

下面例子展示在全局导航钩子中检查 meta 字段：

```js
router.beforeEach((to, from, next) => {
if (to.matched.some(record => record.meta.requiresAuth)) {
  // this route requires auth, check if logged in
  // if not, redirect to login page.
  if (!auth.loggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
} else {
  next() // 确保一定要调用 next()
}
})
```

## 过渡动效

<router-view> 是基本的动态组件，所以我们可以用 <transition> 组件给它添加一些过渡效果

- 单个路由的过渡

如果你想让每个路由组件有各自的过渡效果，可以在各路由组件内使用 <transition> 并设置不同的 name。

```js
const Foo = {
template: `
  <transition name="slide">
    <div class="foo">...</div>
  </transition>
`
}

const Bar = {
template: `
  <transition name="fade">
    <div class="bar">...</div>
  </transition>
`
}
```

- 基于路由的动态过渡

还可以基于当前路由与目标路由的变化关系，动态设置过渡效果：

```js
<!-- 使用动态的 transition name -->
<transition :name="transitionName">
  <router-view></router-view>
</transition>
// 接着在父组件内
// watch $route 决定使用哪种过渡
watch: {
  '$route' (to, from) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  }
}
```

## 数据获取

在渲染用户信息时，你需要从服务器获取用户的数据。我们可以通过两种方式来实现：

- 导航完成之后获取：先完成导航，然后在接下来的组件生命周期钩子中获取数据。在数据获取期间显示『加载中』之类的指示。

- 导航完成之前获取：导航完成前，在路由的 enter 钩子中获取数据，在数据获取成功后执行导航。

从技术角度讲，两种方式都不错 —— 就看你想要的用户体验是哪种。

### 导航完成后获取数据

当你使用这种方式时，我们会马上导航和渲染组件，然后在组件的 created 钩子中获取数据。这让我们有机会在数据获取期间展示一个 loading 状态，还可以在不同视图间展示不同的 loading 状态。

假设我们有一个 Post 组件，需要基于 $route.params.id 获取文章数据：

```js
<template>
<div class="post">
  <div class="loading" v-if="loading">
    Loading...
  </div>

  <div v-if="error" class="error">

  </div>

  <div v-if="post" class="content">
    <h2></h2>
    <p></p>
  </div>
</div>
</template>
export default {
data () {
  return {
    loading: false,
    post: null,
    error: null
  }
},
created () {
  // 组件创建完后获取数据，
  // 此时 data 已经被 observed 了
  this.fetchData()
},
watch: {
  // 如果路由有变化，会再次执行该方法
  '$route': 'fetchData'
},
methods: {
  fetchData () {
    this.error = this.post = null
    this.loading = true
    // replace getPost with your data fetching util / API wrapper
    getPost(this.$route.params.id, (err, post) => {
      this.loading = false
      if (err) {
        this.error = err.toString()
      } else {
        this.post = post
      }
    })
  }
}
}
```

### 在导航完成前获取数据

通过这种方式，我们在导航转入新的路由前获取数据。我们可以在接下来的组件的 beforeRouteEnter 钩子中获取数据，当数据获取成功后只调用 next 方法。

```js
export default {
data () {
  return {
    post: null,
    error: null
  }
},
beforeRouteEnter (to, from, next) {
  getPost(to.params.id, (err, post) =>
    if (err) {
      // display some global error message
      next(false)
    } else {
      next(vm => {
        vm.post = post
      })
    }
  })
},
// 路由改变前，组件就已经渲染完了
// 逻辑稍稍不同
watch: {
  $route () {
    this.post = null
    getPost(this.$route.params.id, (err, post) => {
      if (err) {
        this.error = err.toString()
      } else {
        this.post = post
      }
    })
  }
}
}
```

## 滚动行为

使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样。 vue-router 能做到，而且更好，它让你可以自定义路由切换时页面如何滚动。

注意: 这个功能只在 HTML5 history 模式下可用。

当创建一个 Router 实例，你可以提供一个 scrollBehavior 方法：

```js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
  }
})

```

scrollBehavior 方法接收 to 和 from 路由对象。第三个参数 savedPosition 当且仅当 popstate 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用。

这个方法返回滚动位置的对象信息，长这样：

```js
{ x: number, y: number }
{ selector: string }
```

如果你要模拟『滚动到锚点』的行为：

```js
scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash
    }
  }
}
```

## 路由懒加载

当打包构建应用时，Javascript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。

结合 Vue 的 异步组件 和 Webpack 的 code splitting feature, 轻松实现路由组件的懒加载。

我们要做的就是把路由对应的组件定义成异步组件：

```js
const Foo = resolve => {
  // require.ensure 是 Webpack 的特殊语法，用来设置 code-split point
  // （代码分块）
  require.ensure(['./Foo.vue'], () => {
    resolve(require('./Foo.vue'))
  })
}
```

这里还有另一种代码分块的语法，使用 AMD 风格的 require，于是就更简单了：
```js
const Foo = resolve => require(['./Foo.vue'], resolve)

```

不需要改变任何路由配置，跟之前一样使用 Foo：

```js
const router = new VueRouter({
routes: [
  { path: '/foo', component: Foo }
]
})
```

### 把组件按组分块

有时候我们想把某个路由下的所有组件都打包在同个异步 chunk 中。只需要 给 chunk 命名，提供 require.ensure 第三个参数作为 chunk 的名称:

```js
const Foo = r => require.ensure([], () => r(require('./Foo.vue')), 'group-foo')
const Bar = r => require.ensure([], () => r(require('./Bar.vue')), 'group-foo')
const Baz = r => require.ensure([], () => r(require('./Baz.vue')), 'group-foo')
```

Webpack 将相同 chunk 下的所有异步模块打包到一个异步块里面 —— 这也意味着我们无须明确列出 require.ensure 的依赖（传空数组就行）。

## API

默认渲染成带有正确链接的 `<a>` 标签，可以通过配置 tag 属性生成别的标签.。另外，当目标路由成功激活时，链接元素自动设置一个表示激活的 CSS 类名。

`<router-link>` 比起写死的 `<a href="..."> `会好一些，理由如下：

无论是 HTML5 history 模式还是 hash 模式，它的表现行为一致，所以，当你要切换路由模式，或者在 IE9 降级使用 hash 模式，无须作任何变动。

在 HTML5 history 模式下，router-link 会拦截点击事件，让浏览器不在重新加载页面。

当你在 HTML5 history 模式下使用 base 选项之后，所有的 to 属性都不需要写（基路径）了。

### Props

to,replace,append,tag,active-class,exact,events

## `<router-view>`

`<router-view>` 组件是一个 functional 组件，渲染路径匹配到的视图组件。`<router-view>` 渲染的组件还可以内嵌自己的 `<router-view>`，根据嵌套路径，渲染嵌套组件。

如果 `<router-view>` 设置了名称，则会渲染对应的路由配置中 components 下的相应组件

## 路由信息对象

一个 route object（路由信息对象） 表示当前激活的路由的状态信息，包含了当前 URL 解析得到的信息，还有 URL 匹配到的 route records（路由记录）。

route object 是 immutable（不可变） 的，每次成功的导航后都会产生一个新的对象。

route object 出现在多个地方:

组件内的 this.$route 和 $route watcher 回调（监测变化处理）;

router.match(location) 的返回值

导航钩子的参数：

```js
router.beforeEach((to, from, next) => {
// to 和 from 都是 路由信息对象
})
```
scrollBehavior 方法的参数:

```js
const router = new VueRouter({
scrollBehavior (to, from, savedPosition) {
  // to 和 from 都是 路由信息对象
}
})

```

路由信息对象的属性

$route.path 字符串，对应当前路由的路径，总是解析为绝对路径，如 "/foo/bar"。

$route.params 一个 key/value 对象，包含了 动态片段 和 全匹配片段，如果没有路由参数，就是一个空对象。

$route.query 一个 key/value 对象，表示 URL 查询参数。例如，对于路径 /foo?user=1，则有 $route.query.user == 1，如果没有查询参数，则是个空对象。

$route.hash 当前路由的 hash 值 (带 #) ，如果没有 hash 值，则为空字符串。

$route.fullPath 完成解析后的 URL，包含查询参数和 hash 的完整路径。

$route.matched 一个数组，包含当前路由的所有嵌套路径片段的 路由记录 。路由记录就是 routes 配置数组中的对象副本（还有在 children 数组）。

```js
const router = new VueRouter({
routes: [
// 下面的对象就是 route record
{ path: '/foo', component: Foo,
  children: [
    // 这也是个 route record
    { path: 'bar', component: Bar }
  ]
}
]
})
```

$route.name  当前路由的名称

## Router 构造配置

RouteConfig 的类型定义：

```js
declare type RouteConfig = {
  path: string;
  component?: Component;
  name?: string; // for named routes (命名路由)
  components?: { [name: string]: Component }; // for named views (命名视图组件)
  redirect?: string | Location | Function;
  alias?: string | Array<string>;
  children?: Array<RouteConfig>; // for nested routes
  beforeEnter?: (to: Route, from: Route, next: Function) => void;
  meta?: any;
}
```

mode 配置路由模式:

- hash: 使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器。

- history: 依赖 HTML5 History API 和服务器配置。查看 HTML5 History 模式.

- abstract: 支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式。

base

linkActiveClass

scrollBehavior

## Router 实例

router.app 配置了 router 的 Vue 根实例。

router.mode 路由使用的 模式。

router.currentRoute 当前路由对应的 路由信息对象.

router.beforeEach(guard)
router.afterEach(hook)

增加全局的导航钩子。参考 导航钩子.

router.push(location)
router.replace(location)
router.go(n)
router.back()
router.forward()

动态的导航到一个新 url。参考 编程式导航.

router.getMatchedComponents(location?)

返回目标位置或是当前路由匹配的组件数组（是数组的定义/构造类，不是实例）。通常在服务端渲染的数据预加载时时候。

## 对组件注入

通过在 Vue 根实例的 router 配置传入 router 实例，下面这些属性成员会被注入到每个子组件。
