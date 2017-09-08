---
title: Vuex
---

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

这个状态自管理应用包含以下几个部分：

state，驱动应用的数据源；
view，以声明方式将state映射到视图；
actions，响应在view上的用户输入导致的状态变化。

## State

单一状态树

每个应用将仅仅包含一个 store 实例。单一状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。

由于 Vuex 的状态存储是响应式的，从 store 实例中读取状态最简单的方法就是在计算属性中返回某个状态

通过在根实例中注册 store 选项，该 store 实例会注入到根组件下的所有子组件中，且子组件能通过 this.$store 访问到

### mapState 辅助函数

当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。可以使用mapState：

```js
  import {mapState} from 'vuex'

  export default {
    computed:mapState({
      count: state => state.count,
      countAlias: 'count',
      countPlusLocalState (state) {
        return state.count + this.localCount
      }
    })
  }
```


当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组。

```js
computed: mapState([
  // 映射 this.count 为 store.state.count
  'count'
])
```

### 对象展开运算符

mapState 函数返回的是一个对象。我们如何将它与局部计算属性混合使用呢？

```js
computed: {
  localComputed () { /* ... */ },
  // 使用对象展开运算符将此对象混入到外部对象中
  ...mapState({
    // ...
  })
}
```

## getters

有时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数：

```js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

Vuex 允许我们在 store 中定义『getters』（可以认为是 store 的计算属性）。Getters 接受 state 作为其第一个参数：

```js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})

```

Getters 会暴露为 store.getters 对象：

```js
  store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Getters 也可以接受其他 getters 作为第二个参数：

```js
getters: {
  // ...
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
store.getters.doneTodosCount // -> 1
```

我们可以很容易地在任何组件中使用它：

```js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

### mapGetters 辅助函数

mapGetters 辅助函数仅仅是将 store 中的 getters 映射到局部计算属性：

```js
  import {mapGetters} from 'vuex';

  export {
    computed:{
      ...mapGetters({
        'doa',
        'dob'
      })
    }
  }
```

如果你想将一个 getter 属性另取一个名字，使用对象形式：

```js
mapGetters({
  // 映射 this.doneCount 为 store.getters.doneTodosCount
  doneCount: 'doneTodosCount'
})
```


## mutations

更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutations 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：

```js
  const store = new vuex.Store({
    state:{
      count:1
    },
    mutations:{
      increment (state) {
      // 变更状态
      state.count++
      }
    }
  })
```

你不能直接调用一个 mutation handler。这个选项更像是事件注册：“当触发一个类型为 increment 的 mutation 时，调用此函数。”要唤醒一个 mutation handler，你需要以相应的 type 调用 store.commit 方法：

```js
  store.commit('increment')
```

### 提交载荷（Payload）

你可以向 store.commit 传入额外的参数，即 mutation 的 载荷（payload）：

```js
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
store.commit('increment', 10)
```

在大多数情况下，载荷应该是一个对象，这样可以包含多个字段并且记录的 mutation 会更易读：

```js
// ...
mutations: {
increment (state, payload) {
  state.count += payload.amount
}
}
store.commit('increment', {
amount: 10
})
```

### 对象风格的提交方式

提交 mutation 的另一种方式是直接使用包含 type 属性的对象：

```js
store.commit({
  type: 'increment',
  amount: 10
})
```

当使用对象风格的提交方式，整个对象都作为载荷传给 mutation 函数，因此 handler 保持不变：

```js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

Mutations 需遵守 Vue 的响应规则

使用常量替代 Mutation 事件类型

mutation 必须是同步函数

在组件中提交 Mutations

你可以在组件中使用 this.$store.commit('xxx') 提交 mutation，或者使用 mapMutations 辅助函数将组件中的 methods 映射为 store.commit 调用（需要在根节点注入 store）。

```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment' // 映射 this.increment() 为 this.$store.commit('increment')
    ]),
    ...mapMutations({
      add: 'increment' // 映射 this.add() 为 this.$store.commit('increment')
    })
  }
}
```

## Actions

Action 类似于 mutation，不同在于：

Action 提交的是 mutation，而不是直接变更状态。
Action 可以包含任意异步操作。

```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

实践中，我们会经常会用到 ES2015 的 参数解构 来简化代码

```js
actions: {
increment ({ commit }) {
    commit('increment')
  }
}
```

### 分发 Action

Action 通过 store.dispatch 方法触发：

```js
  store.dispatch('increment')
```

Actions 支持同样的载荷方式和对象方式进行分发：

```js
// 以载荷形式分发
store.dispatch('incrementAsync', {
amount: 10
})

// 以对象形式分发
store.dispatch({
type: 'incrementAsync',
amount: 10
})
```

来看一个更加实际的购物车示例，涉及到调用异步 API 和 分发多重 mutations：

```js
actions: {
  checkout ({ commit, state }, products) {
    // 把当前购物车的物品备份起来
    const savedCartItems = [...state.cart.added]
    // 发出结账请求，然后乐观地清空购物车
    commit(types.CHECKOUT_REQUEST)
    // 购物 API 接受一个成功回调和一个失败回调
    shop.buyProducts(
      products,
      // 成功操作
      () => commit(types.CHECKOUT_SUCCESS),
      // 失败操作
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

### 在组件中分发 Action

你在组件中使用 this.$store.dispatch('xxx') 分发 action，或者使用 mapActions 辅助函数将组件的 methods 映射为 store.dispatch 调用（需要先在根节点注入 store）：

```js
import { mapActions } from 'vuex'

export default {
// ...
methods: {
  ...mapActions([
    'increment' // 映射 this.increment() 为 this.$store.dispatch('increment')
  ]),
  ...mapActions({
    add: 'increment' // 映射 this.add() 为 this.$store.dispatch('increment')
  })
}
}

```


### 组合 Actions

Action 通常是异步的，那么如何知道 action 什么时候结束呢？更重要的是，我们如何才能组合多个 action，以处理更加复杂的异步流程？

首先，你需要明白 store.dispatch 可以处理被触发的action的回调函数返回的Promise，并且store.dispatch仍旧返回Promise：

```js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}

store.dispatch('actionA').then(() => {
  // ...
})
//在另外一个 action 中也可以：

actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

最后，如果我们利用 async / await 这个 JavaScript 即将到来的新特性，我们可以像这样组合 action：

```js
// 假设 getData() 和 getOtherData() 返回的是 Promise

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

> 一个 store.dispatch 在不同模块中可以触发多个 action 函数。在这种情况下，只有当所有触发函数完成后，返回的 Promise 才会执行。

## Modules

使用单一状态树，导致应用的所有状态集中到一个很大的对象。但是，当应用变得很大时，store 对象会变得臃肿不堪。

为了解决以上问题，Vuex 允许我们将 store 分割到模块（module）。每个模块拥有自己的 state、mutation、action、getters、甚至是嵌套子模块——从上至下进行类似的分割：

```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

### 模块的局部状态

对于模块内部的 mutation 和 getter，接收的第一个参数是模块的局部状态。

```js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
      // state 模块的局部状态
      state.count++
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```

同样，对于模块内部的 action，context.state 是局部状态，根节点的状态是 context.rootState:

```js
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

对于模块内部的 getter，根节点状态会作为第三个参数：

```js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

### 命名空间

模块内部的 action、mutation、和 getter 现在仍然注册在全局命名空间——这样保证了多个模块能够响应同一 mutation 或 action。你可以通过添加前缀或后缀的方式隔离各模块，以避免名称冲突。你也可能希望写出一个可复用的模块，其使用环境不可控。例如，我们想创建一个 todos 模块：

```js
// types.js

// 定义 getter、action、和 mutation 的名称为常量，以模块名 `todos` 为前缀
export const DONE_COUNT = 'todos/DONE_COUNT'
export const FETCH_ALL = 'todos/FETCH_ALL'
export const TOGGLE_DONE = 'todos/TOGGLE_DONE'
// modules/todos.js
import * as types from '../types'

// 使用添加了前缀的名称定义 getter、action 和 mutation
const todosModule = {
state: { todos: [] },

getters: {
  [types.DONE_COUNT] (state) {
    // ...
  }
},

actions: {
  [types.FETCH_ALL] (context, payload) {
    // ...
  }
},

mutations: {
  [types.TOGGLE_DONE] (state, payload) {
    // ...
  }
}
}
```

### 模块动态注册

在 store 创建之后，你可以使用 store.registerModule 方法注册模块：

```js
store.registerModule('myModule', {
// ...
})
```

## 插件

Vuex 的 store 接受 plugins 选项，这个选项暴露出每次 mutation 的钩子。Vuex 插件就是一个函数，它接收 store 作为唯一参数：

```js
const myPlugin = store => {
  // 当 store 初始化后调用
  store.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
  })
}
```

然后像这样使用：

```js
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```

## 在插件内提交 Mutation

在插件中不允许直接修改状态——类似于组件，只能通过提交 mutation 来触发变化。

通过提交 mutation，插件可以用来同步数据源到 store。例如，同步 websocket 数据源到 store（下面是个大概例子，实际上 createPlugin 方法可以有更多选项来完成复杂任务）：

```js
export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('data', data => {
      store.commit('receiveData', data)
    })
    store.subscribe(mutation => {
      if (mutation.type === 'UPDATE_DATA') {
        socket.emit('update', mutation.payload)
      }
    })
  }
}
const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state,
  mutations,
  plugins: [plugin]
})
```


## 严格模式

开启严格模式，仅需在创建 store 的时候传入 strict: true：

```js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。

### 开发环境与发布环境

不要在发布环境下启用严格模式！严格模式会深度监测状态树来检测不合规的状态变更——请确保在发布环境下关闭严格模式，以避免性能损失。

类似于插件，我们可以让构建工具来处理这种情况：

```js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```

## 表单处理

当在严格模式中使用 Vuex 时，在属于 Vuex 的 state 上使用 v-model 会比较棘手：

```js
  <input v-model="obj.message">
```

用『Vuex 的思维』去解决这个问题的方法是：给 <input> 中绑定 value，然后侦听 input 或者 change 事件，在事件回调中调用 action:

```js
<input :value="message" @input="updateMessage">
// ...
computed: {
  ...mapState({
    message: state => state.obj.message
  })
  },
  methods: {
  updateMessage (e) {
    this.$store.commit('updateMessage', e.target.value)
  }
}

```

双向绑定的计算属性

必须承认，这样做比简单地使用“v-model + 局部状态”要啰嗦得多，并且也损失了一些 v-model 中很有用的特性。另一个方法是使用带有 setter 的双向绑定计算属性：

```js
<input v-model="message">
// ...
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```

## 热重载

使用 webpack 的 Hot Module Replacement API，Vuex 支持在开发过程中热重载 mutation、modules、actions、和getters。你也可以在 Browserify 中使用 browserify-hmr 插件。

对于 mutation 和模块，你需要使用 store.hotUpdate() 方法：

```js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import moduleA from './modules/a'

Vue.use(Vuex)

const state = { ... }

const store = new Vuex.Store({
state,
mutations,
modules: {
  a: moduleA
}
})

if (module.hot) {
// 使 actions 和 mutations 成为可热重载模块
module.hot.accept(['./mutations', './modules/a'], () => {
  // 获取更新后的模块
  // 因为 babel 6 的模块编译格式问题，这里需要加上 .default
  const newMutations = require('./mutations').default
  const newModuleA = require('./modules/a').default
  // 加载新模块
  store.hotUpdate({
    mutations: newMutations,
    modules: {
      a: newModuleA
    }
  })
})
}
```

## API 参考

Vuex.Store

```js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```


Vuex.Store 构造器选项

state Vuex store 实例的根 state 对象。

mutations 在 store 上注册 mutation，处理函数总是接受 state 作为第一个参数（如果定义在模块中，则为模块的局部状态），payload 作为第二个参数（可选）。

actions 在 store 上注册 action。处理函数接受一个 context 对象，包含以下属性：

```js
// {
//   state,     // 等同于 store.state, 若在模块中则为局部状态
//   rootState, // 等同于 store.state, 只存在于模块中
//   commit,    // 等同于 store.commit
//   dispatch,  // 等同于 store.dispatch
//   getters    // 等同于 store.getters
// }
```

getters 在 store 上注册 getter，getter 方法接受以下参数：
```js
  // state,     // 如果在模块中定义则为模块的局部状态
  // getters,   // 等同于 store.getters
  // rootState  // 等同于 store.state
```
注册的 getter 暴露为 store.getters。


modules 包含了子模块的对象，会被合并到 store，大概长这样：
```js
// {
// key: {
//   state,
//   mutations,
//   actions?,
//   getters?,
//   modules?
// },
// ...
// }
```

plugins 一个数组，包含应用在 store 上的插件方法。这些插件直接接收 store 作为唯一参数，可以监听 mutation（用于外部地数据持久化、记录或调试）或者提交 mutation （用于内部数据，例如 websocket 或 某些观察者）

strict 使 Vuex store 进入严格模式，在严格模式下，任何 mutation 处理函数以外修改 Vuex state 都会抛出错误。

### Vuex.Store 实例属性

state 根状态，只读。

getters 暴露出注册的 getter，只读。

### Vuex.Store 实例方法

`commit(type: string, payload?: any) | commit(mutation: Object)`

`dispatch(type: string, payload?: any) | dispatch(action: Object)`

`replaceState(state: Object)`

`watch(getter: Function, cb: Function, options?: Object)`

`subscribe(handler: Function)`

`registerModule(path: string | Array<string>, module: Module)`

`unregisterModule(path: string | Array<string>)`

`hotUpdate(newOptions: Object)`

### 组件绑定的辅助函数

`mapState(map: Array<string> | Object): Object`

`mapGetters(map: Array<string> | Object): Object`

`mapActions(map: Array<string> | Object): Object`

`mapMutations(map: Array<string> | Object): Object`
