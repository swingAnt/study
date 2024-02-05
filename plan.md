阅读:深入浅出webpack
https://juejin.cn/post/6944245558865297415


Hooks的原理
- 单向链表通过next把hooks串联起来
- memoizedState存在fiber node上，组件之间不会相互影响
- useState和useReducer中通过dispatchAction调度更新任务

Hooks的使用注意事项
只能在顶层调用Hooks? Hooks是使用数组或单链表串联起来，Hooks顺序修改会打乱执行结果
useState在多个组件中引入，彼此之间会不会有影响? 在React中Hooks把数据存在fiber node上的，每个组件都有自己的currentlyRenderingFiber.memoizedState
Hooks的问题
只能在顶层调用Hooks? Hooks是使用数组或单链表串联起来，Hooks顺序修改会打乱执行结果
useState在多个组件中引入，彼此之间会不会有影响? 在React中Hooks把数据存在fiber node上的，每个组件都有自己的currentlyRenderingFiber.memoizedState

Hooks是React 16.8引入的一个特性，它允许你在不编写类组件的情况下使用state和其他React特性。以下是Hooks的基本原理、使用注意事项和可能遇到的问题。

### 原理

- **useState**: 允许你在函数组件中添加状态。每次组件渲染时，`useState` 返回一对值：当前状态和更新状态的函数。
- **useEffect**: 用于在函数组件中执行副作用操作（如数据获取、订阅或手动更改DOM）。它可以看作是`componentDidMount`、`componentDidUpdate`和`componentWillUnmount`这些生命周期方法的组合。
- **useContext**: 允许你在组件树中传递数据而不必使用props。
- **useReducer**: 类似于`useState`，但它接受一个reducer函数来管理复杂的状态逻辑。
- **useCallback**: 返回一个记忆化的回调函数。
- **useMemo**: 返回一个记忆化的值。
- **useRef**: 返回一个可变的ref对象，其`.current`属性被初始化为传递的参数。
- **useImperativeHandle**: 自定义使用`ref`时公开给父组件的实例值。
- **useLayoutEffect**: 与`useEffect`相似，但它在所有DOM变更之后同步触发重渲染。
- **useDebugValue**: 用于在React开发者工具中显示自定义hook的标签。

### 使用注意事项

- **不要在循环、条件或嵌套函数中调用Hooks**：确保Hooks在函数的最顶层被调用，以保持Hooks的调用顺序一致。
- **只在React函数组件或自定义Hooks中调用Hooks**：不要在普通的JavaScript函数中调用。
- **使用`eslint-plugin-react-hooks`**：这个ESLint插件可以帮助你遵守Hooks的规则。
- **小心闭包陷阱**：在`useEffect`等Hooks中使用的函数可能会捕获旧的state或props值，需要通过依赖数组或其他方式来控制。
- **优化性能**：使用`useCallback`和`useMemo`来避免不必要的组件渲染，但不要过度优化。

### Hooks的问题

- **学习曲线**：对于习惯了类组件的开发者来说，Hooks引入了新的概念和模式，需要时间去适应。
- **复杂逻辑难以管理**：对于复杂的状态逻辑和副作用，使用Hooks可能会让组件变得难以理解和维护。
- **过度使用**：滥用`useCallback`和`useMemo`可能会导致性能问题，因为它们本身也有开销。
- **测试挑战**：测试使用Hooks的组件可能比测试类组件更加复杂。
- **规则限制**：Hooks的规则限制了它们的使用方式，有时可能会感到不够灵活。

总的来说，Hooks提供了一种更加函数式的方式来使用React的特性，但它们也带来了新的概念和限制。正确使用Hooks需要对它们的工作原理有深入的理解。
————————————————
版权声明：本文为CSDN博主「Elementsboy」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/Elementsboy/article/details/106585011
use开头，有顺序的
Hook　轻松添加　State
function useState(initialValue) {
  var state = initialValue;
  function setState(newState) {
    state = newState;
    render();
  }
  return [state, setState];

  
let states = []
let setters = []
let firstRun = true
let cursor = 0
 
//  使用工厂模式生成一个 createSetter，通过 cursor 指定指向的是哪个 state
function createSetter(cursor) {
  return function(newVal) { // 闭包
    states[cursor] = newVal
  }
}
 
function useState(initVal) {
  // 首次
  if(firstRun) {
    states.push(initVal)
    setters.push(createSetter(cursor))
    firstRun = false
  }
  let state = states[cursor]
  let setter = setters[cursor]
  // 光标移动到下一个位置
  cursor++
  // 返回
  return [state, setter]
}

1.useState是一个hook。 它的名字以“use”开头（这是Hooks的规则之一 - 它们的名字必须以“use”开头）。
2.useState hook 的参数是 state 的初始值，返回一个包含两个元素的数组:当前state和一个用于更改state 的函数。
3.类组件有一个大的state对象，一个函数this.setState一次改变整个state对象。


在JavaScript中实现一个简化版的`useState` Hook可以帮助你理解其背后的工作原理。以下是一个非常基础的实现，它模拟了`useState`的基本功能：

```javascript
let globalState;
let listener;

function useState(initialValue) {
  globalState = globalState || initialValue; // 初始化状态

  function setState(newState) {
    globalState = newState; // 更新状态
    listener(); // 通知组件重新渲染
  }

  return [globalState, setState];
}

function render(Component) {
  const C = Component(); // 执行组件函数获取组件
  C.render();
  return C;
}

function myComponent() {
  const [state, setState] = useState(0);

  return {
    render: () => console.log(`State: ${state}`),
    click: () => setState(state + 1)
  };
}

listener = () => render(myComponent); // 设置listener为重新渲染组件的函数

const app = render(myComponent); // 初始渲染
app.click(); // 模拟用户点击，增加状态
app.click(); // 再次点击，增加状态
```

这个简化版的`useState`使用了全局变量来存储状态，并且只能处理单个组件实例。在实际的React中，`useState`是更复杂的，因为它需要处理多个组件实例和多个状态值。

请注意，这个实现只是为了演示`useState`的基本概念，并不适用于生产环境。在真实的React环境中，`useState`和其他Hooks是由React的渲染引擎管理的，它们与组件的生命周期和渲染流程紧密集成。

useEffect 用来处理副作用
为什么第二个参数是空数组，相当于 componentDidMount 
function useEffect(callback, depArray) {
  const hasNoDeps = !depArray; // 如果 dependencies 不存在
  const hasChangedDeps = _deps
    ? !depArray.every((el, i) => el === _deps[i]) // 两次的 dependencies 是否完全相等
    : true;
  /* 如果 dependencies 不存在，或者 dependencies 有变化*/
  if (hasNoDeps || hasChangedDeps) {
    callback();
    _deps = depArray;
  }
 useEffect(() => {
        document.title = 'Hello, ' + name;
    }, [name]); // Our deps
上面这段代码相当于告诉react，我这个effect的依赖项是name这个变量，只有当name发生变化的时候才去执行里面的函数

而且这个比较是浅比较，如果state是一个对象，那么对象只要指向不发生变化，那么就不会执行effect里面的函数
1. 有两个参数 callback 和 dependencies 数组
2. 如果 dependencies 不存在，那么 callback 每次 render 都会执行
3. 如果 dependencies 存在，只有当它发生了变化， callback 才会执行


useContext
使用方法：

    const value = useContext(myContext);
    `useContext` 是 React 的一个 Hook，它允许你在组件中访问 React 的 Context API 提供的上下文数据。以下是 `useContext` 的基本使用方法：

1. **创建 Context**：
   首先，你需要使用 `React.createContext()` 创建一个 Context 对象。

```javascript
const MyContext = React.createContext(defaultValue);
```

2. **提供 Context 值**：
   使用 `Context.Provider` 组件包裹你的组件树，并通过 `value` 属性传递数据。

```javascript
<MyContext.Provider value={/* 一些值 */}>
  {/* 组件树 */}
</MyContext.Provider>
```

3. **消费 Context 值**：
   在函数组件中，你可以使用 `useContext` Hook 来订阅 Context 的变化，并获取 Context 的当前值。

```javascript
const value = useContext(MyContext);
```

### 示例

```javascript
import React, { useContext, useState } from 'react';

// 创建一个 Context 对象
const CountContext = React.createContext();

// 一个包含 Provider 的组件
function CountProvider({ children }) {
  const [count, setCount] = useState(0);
  return (
    <CountContext.Provider value={{ count, setCount }}>
      {children}
    </CountContext.Provider>
  );
}

// 一个消费 Context 的子组件
function Counter() {
  const { count, setCount } = useContext(CountContext);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// 应用组件
function App() {
  return (
    <CountProvider>
      <Counter />
    </CountProvider>
  );
}

export default App;
```

在这个例子中，`CountProvider` 组件提供了一个 `count` 状态和一个可以更新它的 `setCount` 函数。`Counter` 组件通过 `useContext` 获取这些值，并在界面上显示计数器和一个按钮来增加计数。

### 注意事项

- 确保 `useContext` 的参数是 Context 对象本身，而不是 Context 的消费者或提供者。
- 当 Context 的值发生变化时，所有使用了 `useContext` 并订阅了这个 Context 的组件都将重新渲染。
- 为了性能优化，确保不要在每次渲染时都传递一个新的对象给 `Provider` 的 `value` 属性，这会导致不必要的渲染。
当最近的一个myContext.Provider更新的时候，这个hook就会导致当前组件发生更新
useReducer:
    function reducer(state, action) {
        switch (action.type) {
            case 'increment':
                return {count: state.count + 1};
            case 'decrement':
                return {count: state.count - 1};
            default:
                throw new Error();
        }
    }

    function Counter() {
        const [state, dispatch] = useReducer(reducer, {count: 100});

        // 如果此处不传入一个initialState: {count: 100}的话，那么默认initialState就是undefined，那么后面的取值就会报错
        return (
            <>
                Count: {state.count}
                <button onClick={() => dispatch({type: 'increment'})}>+</button>
                <button onClick={() => dispatch({type: 'decrement'})}>-</button>
            </>
        );
    }
useCallback:
    const memoizedCallback = useCallback(
        () => {
            doSomething(a, b);
        },
        [a, b],
    );
    // 返回的memoizedCallback只有当a、b发生变化时才会变化，可以把这样一个memoizedCallback作为depen
useMemo
    const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
useRef
    const refContainer = useRef(initialValue);
注意：useRef返回相当于一个{current: ...}的plain object，但是和正常这样每轮render之后直接显式创建的区别在于，每轮render之后的useRef返回的plain object都是同一个，只是里面的current发生变化

而且，当里面的current发生变化的时候并不会引起render
`useRef` 是 React 提供的一个 Hook，它主要有两个作用：

1. **访问 DOM 节点**：
   `useRef` 可以用来直接访问一个 DOM 元素。当你需要直接操作 DOM，比如设置焦点、测量元素大小或位置时，这个功能非常有用。

```javascript
function MyComponent() {
  const myRef = useRef(null);

  useEffect(() => {
    // 当组件挂载后，myRef.current 将指向对应的 DOM 节点
    if (myRef.current) {
      myRef.current.focus();
    }
  }, []);

  return <input ref={myRef} />;
}
```

在这个例子中，`useRef` 创建了一个 ref 对象，并将其赋给了 `input` 元素的 `ref` 属性。这样，我们就可以通过 `myRef.current` 访问到实际的 DOM 节点，并在组件挂载后立即给输入框设置焦点。

2. **保存跨渲染周期的可变数据**：
   `useRef` 还可以用来保存一个可变的值，这个值在组件的整个生命周期内保持不变，即使组件重新渲染也不会丢失。这对于存储任何可变值都很有用，而且不会触发组件的重新渲染。

```javascript
function TimerComponent() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // ...你的逻辑代码
    }, 1000);
    intervalRef.current = id;
    return () => clearInterval(intervalRef.current);
  }, []);

  // ...其他逻辑
}
```

在这个例子中，`intervalRef` 用来保存一个定时器的 ID。即使组件重新渲染，这个 ID 也不会丢失，并且可以在组件卸载时用来清除定时器。

### 注意事项

- `useRef` 返回的 ref 对象在组件的整个生命周期内保持不变。
- `useRef` 不仅可以用来存储 DOM 引用，还可以用来存储任何可变值。
- 当 ref 对象内容发生变化时，不会通知你或触发重新渲染。
- 如果你需要在数据变化时触发组件更新，请使用 `useState` 或 `useReducer`。
- 
React Fiber的方式
破解JavaScript中同步操作时间过长的方法其实很简单——分片。

把一个耗时长的任务分成很多小片，每一个小片的运行时间很短，虽然总时间依然很长，但是在每个小片执行完之后，都给其他任务一个执行的机会，这样唯一的线程就不会被独占，其他任务依然有运行的机会。

React Fiber把更新过程碎片化，执行过程如下面的图所示，每执行完一段更新过程，就把控制权交还给React负责任务协调的模块，看看有没有其他紧急任务要做，如果没有就继续去更新，如果有紧急任务，那就去做紧急任务。

维护每一个分片的数据结构，就是Fiber。
为了达到这种效果，就需要有一个调度器 (Scheduler) 来进行任务分配。任务的优先级有六种：

synchronous，与之前的Stack Reconciler操作一样，同步执行
task，在next tick之前执行
animation，下一帧之前执行
high，在不久的将来立即执行
low，稍微延迟执行也没关系
offscreen，下一次render时或scroll时才执行


React Fiber 是 React 16 中引入的一种新的内部算法，用于增强其核心渲染引擎。Fiber 的目标是提高 React 在渲染大型应用程序时的性能和响应性。它主要通过以下方式实现这一目标：

### 任务可中断
Fiber 引入了一种能够将渲染工作分割成多个小任务的机制。这些任务可以被中断和重新启动，而不会阻塞浏览器的主线程。这意味着 React 可以在需要时暂停渲染工作，以确保主线程可以处理更紧急的任务，如用户输入、动画等。

### 更好的任务调度
Fiber 架构允许 React 更智能地调度任务的优先级。例如，动画和用户交互具有较高的优先级，而隐藏的组件更新则可以推迟处理。这种优先级调度有助于确保应用程序的关键任务能够快速完成，从而提高用户体验。

### 增量渲染
通过将渲染工作分割成小块，Fiber 允许 React 在浏览器空闲时逐步完成渲染任务。这种增量渲染策略有助于避免长时间阻塞主线程，从而减少应用程序的卡顿现象。

### 更好的错误处理
Fiber 架构引入了一种新的错误边界（Error Boundaries）概念，允许开发者更好地处理组件树中的错误。错误边界可以捕获其子组件树中的 JavaScript 错误，防止整个应用崩溃，并提供回退 UI。

### 新的生命周期方法
为了更好地适应 Fiber 架构，React 引入了新的生命周期方法，如 `getDerivedStateFromProps` 和 `getSnapshotBeforeUpdate`，同时废弃了一些旧的生命周期方法，如 `componentWillMount`、`componentWillReceiveProps` 和 `componentWillUpdate`。

### 兼容性
尽管 Fiber 架构对 React 的内部实现做了根本性的改变，但它保持了与旧版本的兼容性。开发者可以逐步迁移到新版本，而不必担心现有代码会立即失效。

总的来说，React Fiber 是对 React 核心算法的重写，它使得 React 能够更好地处理应用程序的性能和响应性问题，特别是在复杂和大型应用程序中。Fiber 的引入是 React 发展中的一个重要里程碑，为未来的功能和改进奠定了基础。




`getDerivedStateFromProps` 和 `getSnapshotBeforeUpdate` 是 React 类组件中的两个生命周期方法，它们在 React 16.3 版本中引入，以适应新的异步渲染方式。下面是这两个方法的作用和使用场景：

### getDerivedStateFromProps

`getDerivedStateFromProps` 是一个静态方法，用于在组件实例化后以及重新渲染前将 props 映射到 state。这个方法的返回值将会被用作 state 的更新。

```javascript
class MyComponent extends React.Component {
  static getDerivedStateFromProps(props, state) {
    // 返回一个对象来更新 state，或者返回 null 表示不需要更新 state
    if (props.value !== state.value) {
      return {
        value: props.value,
      };
    }
    return null;
  }
}
```

**使用场景**：当组件的 state 依赖于外部 props 变化时，可以使用这个方法来更新 state。

**注意事项**：
- 这是一个静态方法，因此在方法内部不能访问 `this`。
- 如果返回 `null`，则不更新任何 state。
- 应谨慎使用，以避免不必要的重新渲染。

### getSnapshotBeforeUpdate

`getSnapshotBeforeUpdate` 在最新的渲染输出被提交到 DOM 前被调用。它允许你在 DOM 变化前捕获一些信息（例如，滚动位置），这个返回值将作为 `componentDidUpdate` 的第三个参数。

```javascript
class MyComponent extends React.Component {
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 捕获更新前的某些信息，如滚动位置等
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }
}
```

**使用场景**：当你需要在 DOM 更新后保持某些状态（如滚动位置）时，可以使用这个方法。

**注意事项**：
- 这个方法在更新发生前被调用，所以它可以读取但不能更改 DOM。
- 返回的值或 `null` 将作为 `componentDidUpdate` 的第三个参数。
- 如果你不需要使用 `snapshot`，则不必实现这个方法。

这两个方法是为了替代旧的生命周期方法（如 `componentWillReceiveProps` 和 `componentWillUpdate`），以支持 React 的异步渲染策略。它们提供了更安全的方式来处理 state 和 DOM 的更新。



new Promise
创建promise并添加回调，串联方式

new Promise((resolve, reject) => {
    setTimeout(function () {
        var i = Math.random();
        if (i > 0) {
            resolve();
        } else {
            reject();
        }  
    }, 100);
}).then(function (result) {
    // 成功
}).catch(function (error) {
    // 失败
})
Promise.all
Promise.all = arr => {
    let aResult = [];    //用于存放每次执行后返回结果
    return new _Promise(function (resolve, reject) {
      let i = 0;
      next();    // 开始逐次执行数组中的函数(重要)
      function next() {
        arr[i].then(function (value) {
          aResult.push(value);    // 存储每次得到的结果
          i++;
          if (i == arr.length) {    // 如果函数数组中的函数都执行完，便resolve
            resolve(aResult);
          } else {
            next();
          }
        }, reason => {
        return reject(reason);
      })
      }
    })
  };
并行执行异步任务，都成功才执行成功回调，有一个失败就执行失败回调。
应用场景：页面需要执行一系列异步任务之后才进行后续操作。

var promiseArray = [];
promiseArray.push(new Promise((resolve, reject)=>{
    // 执行异步任务1
}));
promiseArray.push(new Promise((resolve, reject)=>{
    // 执行异步任务2
}));
Promise.all(promiseArray).then(function (results) {
	// 两个异步任务都执行成功的回调
    // results是结果数组，顺序跟promiseArray顺序一致
}).catch(error => {
    // 先执行失败任务的参数error
})

function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('arguments must be an array'));
    }
    let resolvedCounter = 0;
    let promiseNum = promises.length;
    let resolvedValues = new Array(promiseNum);

    for (let i = 0; i < promiseNum; i++) {
      Promise.resolve(promises[i]).then(value => {
        resolvedCounter++;
        resolvedValues[i] = value;
        if (resolvedCounter === promiseNum) {
          return resolve(resolvedValues);
        }
      }, reason => {
        return reject(reason);
      });
    }
  });
}

Promise.race
并行执行异步任务，只要有一个完成就执行回调，后完成的抛弃。
应用场景：不同的方式执行异步任务，目的是一样的，然后谁返回的快用谁。

var promiseArray = [];
promiseArray.push(new Promise((resolve, reject)=>{
    // 执行异步任务1
}));
promiseArray.push(new Promise((resolve, reject)=>{
    // 执行异步任务2
}));
Promise.race(promiseArray).then(function (result) {
	// 先执行完毕的异步任务成功的回调
}).catch(function (error) {
    // 先执行完毕的异步任务失败的回调
})


`Promise.race` 是一个静态方法，它接收一个 Promise 对象的数组作为输入，并返回一个新的 Promise 实例。这个新的 Promise 将会解决（resolved）或拒绝（rejected）为第一个解决或拒绝的输入 Promise 的结果。

以下是一个简单的 `Promise.race` 实现：

```javascript
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('arguments must be an array'));
    }
    for (let i = 0; i < promises.length; i++) {
      // 使用 Promise.resolve 包装每个元素，以确保每个都是 Promise
      Promise.resolve(promises[i]).then(
        value => {
          resolve(value); // 一旦任何一个 Promise 解决，就解决整个 Promise.race
        },
        reason => {
          reject(reason); // 一旦任何一个 Promise 拒绝，就拒绝整个 Promise.race
        }
      );
    }
  });
}
```

这个 `promiseRace` 函数的工作原理如下：

1. 首先检查输入是否为数组，如果不是，则立即拒绝返回的 Promise。
2. 遍历输入的 Promise 数组，对每个 Promise 使用 `Promise.resolve` 来确保它们都是 Promise 对象。
3. 对每个 Promise 注册一个 `.then` 处理程序，无论是解决还是拒绝，都将处理返回的 Promise。
4. 第一个解决或拒绝的 Promise 将决定返回的 Promise 的 fate，它将采用相同的值或拒绝原因。

请注意，这个实现是为了演示 `Promise.race` 的基本行为，并不包括一些边缘情况处理。在实际应用中，应该使用原生的 `Promise.race` 方法，因为它是经过充分测试的，并且性能经过优化。
手写promise
https://zhuanlan.zhihu.com/p/144058361




一：HashMap底层实现原理解析
我们常见的有数据结构有三种结构：1、数组结构 2、链表结构 3、哈希表结构 下面我们来看看各自的数据结构的特点：
1、数组结构： 存储区间连续、内存占用严重、空间复杂度大

优点：随机读取和修改效率高，原因是数组是连续的（随机访问性强，查找速度快）
缺点：插入和删除数据效率低，因插入数据，这个位置后面的数据在内存中都要往后移动，且大小固定不易动态扩展。
2、链表结构：存储区间离散、占用内存宽松、空间复杂度小

优点：插入删除速度快，内存利用率高，没有固定大小，扩展灵活
缺点：不能随机查找，每次都是从第一个开始遍历（查询效率低）
3、哈希表结构：结合数组结构和链表结构的优点，从而实现了查询和修改效率高，插入和删除效率也高的一种数据结构
常见的HashMap就是这样的一种数据结构


HashMap中的put()和get()的实现原理：

1、map.put(k,v)实现原理
（1）首先将k,v封装到Node对象当中（节点）。
（2）然后它的底层会调用K的hashCode()方法得出hash值。
（3）通过哈希表函数/哈希算法，将hash值转换成数组的下标，下标位置上如果没有任何元素，就把Node添加到这个位置上。如果说下标对应的位置上有链表。此时，就会拿着k和链表上每个节点的k进行equal。如果所有的equals方法返回都是false，那么这个新的节点将被添加到链表的末尾。如其中有一个equals返回了true，那么这个节点的value将会被覆盖。
2、map.get(k)实现原理
(1)先调用k的hashCode()方法得出哈希值，并通过哈希算法转换成数组的下标。
(2)通过上一步哈希算法转换成数组的下标之后，在通过数组下标快速定位到某个位置上。如果这个位置上什么都没有，则返回null。如果这个位置上有单向链表，那么它就会拿着K和单向链表上的每一个节点的K进行equals，如果所有equals方法都返回false，则get方法返回null。如果其中一个节点的K和参数K进行equals返回true，那么此时该节点的value就是我们要找的value了，get方法最终返回这个要找的value。
为何随机增删、查询效率都很高的原因是？
原因: 增删是在链表上完成的，而查询只需扫描部分，则效率高。

HashMap集合的key，会先后调用两个方法，hashCode and equals方法，这这两个方法都需要重写。

为什么放在hashMap集合key部分的元素需要重写equals方法？
因为equals方法默认比较的是两个对象的内存地址

二：HashMap红黑树原理分析
相比 jdk1.7 的 HashMap 而言，jdk1.8最重要的就是引入了红黑树的设计，当hash表的单一链表长度超过 8 个的时候，链表结构就会转为红黑树结构。
为什么要这样设计呢？好处就是避免在最极端的情况下链表变得很长很长，在查询的时候，效率会非常慢。


红黑树查询：其访问性能近似于折半查找，时间复杂度 O(logn)；
链表查询：这种情况下，需要遍历全部元素才行，时间复杂度 O(n)；
简单的说，红黑树是一种近似平衡的二叉查找树，其主要的优点就是“平衡“，即左右子树高度几乎一致，以此来防止树退化为链表，通过这种方式来保障查找的时间复杂度为 log(n)。

关于红黑树的内容，网上给出的内容非常多，主要有以下几个特性：

1、每个节点要么是红色，要么是黑色，但根节点永远是黑色的；

2、每个红色节点的两个子节点一定都是黑色；

3、红色节点不能连续（也即是，红色节点的孩子和父亲都不能是红色）；

4、从任一节点到其子树中每个叶子节点的路径都包含相同数量的黑色节点；

5、所有的叶节点都是是黑色的（注意这里说叶子节点其实是上图中的 NIL 节点）；
https://segmentfault.com/a/1190000008610969

https://www.w3cschool.cn/webgl/i4gf1oh1.html

1.读阅读react源码
如何阅读react源码
https://github.com/JesseZhao1990/blog/issues/132
2.刷面试题，提高基础
3.相关布局flex
http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html
4.周末扒代码
5.学习可视化
健身、书法，学无止境



小青蛙算法
https://blog.csdn.net/weixin_38118016/article/details/79068755
onDownloadProgress keep-alive

解法3 动态规划
/**
* 到达第 i 阶的方法总数 = 第 i -1 阶方法数 + 第 i -2 阶方法数
*/
function climbStairs3(n) {
    if (n === 1) {
        return 1;
    }
    let dp = new Array(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}

时间复杂度： O(n) 单循环到 n

空间复杂度：O(n) dp 数组用了 n 空间

 

解法4 斐波那契
function climbStairs(n) {
    if (n === 1) {
        return 1;
    }
    let first = 1;
    let second = 2;
    for (let i = 3; i <= n; i++) {
        let third = first + second;
        first = second;
        second = third;
    }
    return second;
}

时间复杂度： O(n) 单循环到 n

空间复杂度：O(1) 
————————————————

JS的十大经典算法
https://www.cnblogs.com/yinhao-jack/p/10838401.html

彻底讲明白浅拷贝与深拷贝
https://www.jianshu.com/p/35d69cf24f1f

前端经典面试题解密-add(1)(2)(3)(4) == 10到底是个啥？
https://www.imooc.com/article/302720?block_id=tuijian_wz


// 定长参数
function add (a, b, c, d) {
	return [
	  ...arguments
	].reduce((a, b) => a + b)
}

function currying (fn) {
	let len = fn.length
	let args = []
	return function _c (...newArgs) {
		// 合并参数
		args = [
			...args,
			...newArgs
		]
		// 判断当前参数集合args的长度是否 < 目标函数fn的需求参数长度
		if (args.length < len) {
			// 继续返回函数
			return _c
		} else {
			// 返回执行结果
			return fn.apply(this, args.slice(0, len))
		}
	}
}
let addCurry = currying(add)
let total = addCurry(1)(2)(3)(4) // 同时支持addCurry(1)(2, 3)(4)该方式调用
console.log(total) // 10


js闭包实现
https://blog.csdn.net/ChauncyWu/article/details/90740733


function add (a) {
    function sum(b) { // 使用闭包
        a = a + b; // 累加
        return sum;
    }
    sum.toString = function() { // 重写toSting() 方法
        return a;
    }
    return sum; // 返回一个函数
}
 
console.log(add(1)(3)) // 4
console.log(add(1)(3)(5)) // 9

变量提升
https://www.jianshu.com/p/24973b9db51a

JavaScript变量提升优先级
https://blog.csdn.net/weixin_40492102/article/details/103746596

http2和多路复用
https://zoyi14.smartapps.cn/pages/note/index?slug=a26821111c65&origin=share&hostname=baiduboxapp&_swebfr=1

promise.all
diff算法以及原理
fiber 树
HTML渲染机制
HTML（HyperText Markup Language）渲染机制是指浏览器如何解析 HTML 文档并将其转换为用户可以交互的页面的过程。这个过程大致可以分为以下几个步骤：

1. **解析 HTML**: 浏览器从服务器接收到 HTML 文件后，会逐行读取并解析 HTML 标记，构建一个称为 DOM（Document Object Model）的树状结构。DOM 树代表了页面的结构。

2. **解析 CSS**: 同时，浏览器也会解析外部的、内部的以及内联的 CSS 样式，并生成 CSSOM（CSS Object Model）。CSSOM 与 DOM 树结合，用于确定每个元素的最终样式。

3. **构建渲染树**: 浏览器将 DOM 和 CSSOM 结合起来创建渲染树（Render Tree）。渲染树只包含需要显示的节点和这些节点的样式信息。

4. **布局（Reflow）**: 一旦渲染树被创建，浏览器就会进行布局，计算每个节点的确切位置和大小。这个过程也被称为回流。

5. **绘制（Paint）**: 布局完成后，浏览器会通过渲染树来绘制页面，将每个节点转换为屏幕上的实际像素。

6. **合成（Composite）**: 最后，浏览器可能会将多个层合成在一起，以优化性能和允许复杂的视觉效果，如阴影和动画。

这个过程是渐进的，意味着浏览器会尽快显示内容，而不是等到所有内容都完全下载和处理后再显示。这就是为什么你有时会看到页面逐步加载的原因。

如果在页面加载或交互过程中 DOM 或 CSSOM 被修改（例如，通过 JavaScript），浏览器可能需要重新布局和绘制，这可能会导致性能问题。因此，开发者通常会尽量减少这种重排（Reflow）和重绘（Repaint）以提高页面性能。
TypeScript
react+redux,redux-thunk  
React 是一个用于构建用户界面的 JavaScript 库，Redux 是一个用于管理和中心化应用状态的库。它们通常一起使用在大型的 React 应用中来管理状态。

Redux-Thunk 是一个 Redux 的中间件，它允许你编写返回函数的 action creators 而不仅仅是对象。这使得你可以延迟 action 的派发，或者只在满足特定条件时才派发 action。它主要用于处理异步操作，比如 API 调用。

在使用 Redux-Thunk 的异步 action creators 中，你可以访问 dispatch 和 getState 这两个函数，这样你就可以在操作完成后派发一个新的 action 或者根据当前的状态来决定是否派发 action。
React Hooks 为什么不能放到if中，必须在顶部  useLayoutEffect，useMemo性能优化：缓存数据，缓存在哪里 https://blog.csdn.net/setSail20181101/article/details/105722851

hash与chunkhash定义
[hash] is replaced by the hash of the compilation.
[chunkhash] is replaced by the hash of the chunk.
hash、chunkhash使用场景
chunkhash是根据具体模块文件的内容计算所得的hash值，所以某个文件的改动只会影响它本身的hash指纹，不会影响其他文件。


在 Webpack 打包工具中，`hash` 和 `chunkhash` 是两种用于生成输出文件名的哈希值，它们帮助在文件内容发生变化时控制浏览器缓存。

1. **hash**: 这是每次构建过程中生成的唯一的哈希值。不管是哪个文件发生了变化，所有的输出文件（包括 JavaScript、CSS 等）都会有相同的 `hash` 值。这意味着，如果你的项目中任何一个文件发生变化，用户将不得不重新下载所有文件，因为整个构建的哈希值已经改变了。

2. **chunkhash**: 相比 `hash`，`chunkhash` 是基于每个 chunk 的内容计算得出的。如果一个 chunk 的内容没有变化，那么它的 `chunkhash` 也不会变。这样，只有当特定文件（或模块）发生变化时，浏览器才需要重新下载这个文件，而不是整个包。这对于缓存优化非常有用，因为它允许浏览器只更新变化的文件。

例如，如果你的应用有一个供应商库（vendor library）和你自己的应用代码，你可能希望只在供应商库变化时才重新下载供应商库，而在你的应用代码变化时只重新下载应用代码。使用 `chunkhash` 可以实现这一点，因为供应商库和应用代码通常被打包成不同的 chunks。

在 Webpack 配置中，你可以在输出文件名中使用这些哈希值，例如：

```javascript
output: {
  filename: '[name].[chunkhash].js',
  path: __dirname + '/dist'
}
```

这将确保每个 chunk 的文件名都是基于它们内容的哈希值，从而在内容发生变化时更新文件名。

通过filter改变图片:https://blog.csdn.net/llll789789/article/details/97390485

react+typescript 父组件主动获取子组件内暴露的方法或属性:
https://www.cnblogs.com/beyonds/p/13908373.html

React 源码解析之总览 https://www.jianshu.com/p/1859224e4d79

//拖动API
https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API
dragstart:
https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#dragstart

拖拽变色
https://www.kryogenix.org/code/browser/custom-drag-image.html

封装代码
https://github.com/XboxYan/draggable-polyfill/blob/master/lib/draggable-polyfill.js
  useMount(() => {
    document.addEventListener("dragstart", function(e) {
      const offsetHeight=(e.target as any).offsetHeight;
      const offsetWidth=(e.target as any).offsetWidth;
      const target=(e.target as any).children[0];
      // const target=e.target;
        let crt = (target as any).cloneNode(true);
        console.log('(crt as any)1111',(crt as any));
        (crt as any).style.clear  = "both";
        (crt as any).style.backgroundColor  = "blue";
        (crt as any).style.filter  = "brightness(100%)";
        (crt as any).style.boder  = "1px solid red";
        (crt as any).style.width  = `${offsetWidth}px`;
        (crt as any).style.height  = `${offsetHeight}px`;
        (crt as any).style.zIndex  = 999;
        (crt as any).style.opacity  = 999;
        (crt as any).style.events  = null;
        (crt as any).style.pointerEvents  = 'none !important';
        (crt as any).style.backgroundImage  = '#fff';
        (crt as any).style.boxshadow  = '5px 5px 15px rgba(0, 0, 0, .2)';
        (crt as any).style.bordercolor  = 'wheat';
        (crt as any).style.transform  = 'translate3d(0,0,0) !important';
        (crt as any).style.transition  = 'none !important';
        document.body.appendChild(crt);
        e.dataTransfer.setData('text','');
        e.dataTransfer.setDragImage(crt, 0, 0);
       let cloneObj = document.createElement('DIV');
       (crt as any).setAttribute('dragging', '');
        document.body.appendChild(crt);
        e.dataTransfer.setData('text','');
        e.dataTransfer.setDragImage(crt, 0, 0);
    }, false);
  })

定位可视区:
    document.querySelector(`[data-anchor-name="${name}"]`).scrollIntoView()

    区域缩放:
    https://blog.csdn.net/qq_40015157/article/details/111216733
    插件:
import {MapInteractionCSS} from "react-map-interaction/dist/react-map-interaction";
    多页面入口:
https://www.cnblogs.com/wonyun/p/6030090.html


打包文件去除console
https://www.jianshu.com/p/f68f1e450c56

new UglifyJsPlugin({
  uglifyOptions: {
    compress: {
      warnings: false,
      drop_debugger: true,
      drop_console: true
    }
  },
  sourceMap: config.build.productionSourceMap,
  parallel: true
})

扩大内存
node --max_old_space_size=4096
微前端:https://www.jianshu.com/p/441e4b421841


SPA（单页面应用）和MPA（多页面应用）
https://www.cnblogs.com/moonstars/p/12540657.html

qiankun
https://qiankun.umijs.org/zh/guide/getting-started
 https://mp.weixin.qq.com/s/jC1qNvvamVLaKYA3_pDwxw


  <div ref="containerRef">
</div>


webpack:
微前端应用 导出相应的生命周期钩子
const packageName = require('./package.json').name;

module.exports = {
  output: {
    library: `${packageName}`,
    libraryTarget: "window" - 将库的返回值分配给window对象的由output.library指定的属性。
    jsonpFunction: `webpackJsonp_${packageName}`,
  },
};
export const init = (parentDom, props) => {
}


主应用  注册
        that.microApp = loadMicroApp(
          {
            name: "webpack-umd-base-teamReport", // app name registered
            entry: `//storage.360buyimg.com/cjwl/micro-app/${microAppVersion}/teamReport.html`,
            // entry: 'http://localhost:3000/teamReport.html',
            container: this.$refs.containerRef,
          }
        );


  内部实现


  
  <div ref="containerRef">
</div>


webpack:
微前端应用 导出相应的生命周期钩子
const packageName = require('./package.json').name;

module.exports = {
  output: {
    library: `micro-frontend-script-${name}`,
    libraryTarget: "window" - 将库的返回值分配给window对象的由output.library指定的属性。
  },
};
export const renderPro1 = (containerId, history) => {
  ReactDOM.render(<Rooter history={history} />, 
    document.getElementById(containerId));
};
export const unmountPro1 = containerId => {
  ReactDOM.unmountComponentAtNode(document.getElementById(containerId));
};

主应用  注册
       export default class MicroFrontend extends React.Component {
  renderMicroFrontend = () => {
    const { name, history } = this.props;
    window[`micro-frontend-script-${name}`]&&window[`micro-frontend-script-${name}`]?.renderPro1.(`${name}-container`, history);
    // E.g.: window.renderBrowse('Browse-container', history);
  };
  componentDidMount() {
    const { name, host } = this.props;
    const scriptId = `micro-frontend-script-${name}`;
    if (document.getElementById(scriptId)) {
      this.renderMicroFrontend();
      return;
    }
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `${host}asset.js`;
        // script.src = `${host}#/`;
        script.onload = this.renderMicroFrontend;
        document.head.appendChild(script);
  }
  componentWillUnmount() {
    const { name } = this.props;
    window[`micro-frontend-script-${name}`].unmountPro1.(`${name}-container`);
  }
     render() {
       return <main id={`${this.props.name}-container`} />;
     }
   }

   强制覆盖线上分支
git push origin master-1021 --force
缩放
transform: 'scale(0.8)',transformOrigin:' 0 0'


动画 展开
    transition: height 2.3s;

表单值
    // const [form] = Form.useForm();
const createForm = Form.create;
export default createForm()(MagnetModal);


hooks相关介绍
https://jishuin.proginn.com/p/763bfbd4ed55

https://blog.csdn.net/landl_ww/article/details/102158814
useImperativeHandle
useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值，说简单点就是，子组件可以选择性的暴露给副组件一些方法，这样可以隐藏一些私有方法和属性，官方建议，useImperativeHandle应当与 forwardRef 一起使用，具体如




排序
  const group=["C_00001","C_00002","C_00003","C_00004"];
  const team=["L_00001","L_00002","L_00003","L_00004","L_00005","L_00006","L_00007","L_00008","L_00009","L_00010","L_00011","L_00012","L_00013","L_00014","L_00015","L_00016","L_00017","L_00018","L_00019","L_00020","L_00021","L_00022","L_00023","L_00024","L_00025","L_00026","L_00027","L_00028","L_00029","L_00030","L_00031","L_00032","L_00033","L_00034","L_00035","L_00036","L_00037","L_00038","L_00039","L_00040","L_00041","L_00042","L_00043","L_00044","L_00045","L_00046","L_00047","L_00048","L_00049","L_00050","L_00051","L_00052","L_00053","L_00054","L_00055","L_00056","L_00057","L_00058","L_00059","L_00060","L_00061","L_00062","L_00063","L_00064","L_00065","L_00066","L_00067","L_00068","L_00069","L_00070","L_00071"];
  labelData&&labelData.sort((a, b) =>{
 return (group.indexOf(a.categoryCode)===-1?999:group.indexOf(a.categoryCode))  - (group.indexOf(b.categoryCode)!==-1?group.indexOf(b.categoryCode):99)})
  labelData&&labelData.sort((a, b) => (team.indexOf(a.labelCode)===-1?999:team.indexOf(a.labelCode))  - (team.indexOf(b.labelCode)!==-1?team.indexOf(b.labelCode):99))
  

useReducer 能否代替 Redux ？使用
  https://zhuanlan.zhihu.com/p/262953991
禁用翻译
  https://blog.csdn.net/qq_17335549/article/details/111404209
meta
  https://blog.csdn.net/jsnancy/article/details/80198313
  https://www.cnblogs.com/lyWebstrat/p/6932338.html




  网格布局
  https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html
  富文本
  https://baijiahao.baidu.com/s?id=1703317859631170873&wfr=spider&for=pc
  jest在线学习
  https://www.jestjs.cn/docs/getting-started









前端面试题
  https://www.jianshu.com/p/76be1ae3209a?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation

CSS3中媒体查询结合rem布局适配手机屏幕
  https://www.jb51.net/css/677366.html
  
响应式布局 css3 media 媒体查询 和js+rem
  https://blog.csdn.net/sly94/article/details/52982018

  一：媒体查询

1.使用media的时候需要先设置<meta>标签来兼容移动设备的展示。

<meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1, minimum-scale=1, maximum-scale=1">

 width=device-width :宽度等于当前设备的宽度

user-scalable=no：用户是否可以手动缩放（默认设置为no，因为我们不希望用户放大缩小页面）
 

initial-scale=1：初始的缩放比例（默认设置为1.0）
 

minimum-scale=1：允许用户缩放到的最小比例（默认设置为1.0）
 

maximum-scale=1：允许用户缩放到的最大比例（默认设置为1.0）

  2.css3 media
css3语法: （750px设计图的1rem = 100px）
@media only screen and (min-width: 320px) and (max-width: 479px){
    html {
        font-size: 42.67px !important;
    }
}
@media only screen and (min-width: 480px) and (max-width: 639px){
    html {
        font-size: 64px !important;
    }
}
@media only screen and (min-width: 640px) and (max-width: 749px){
    html {
        font-size: 85.34px !important;
    }
}
@media only screen and (min-width: 750px) and (max-width: 959px){
    html {
        font-size: 100px !important;
    }
}
@media only screen and (min-width: 960px) and (max-width: 1241px){
    html {
        font-size: 128px !important;
    }
}
@media only screen and (min-width: 1242px){
    html {
        font-size: 165.6px !important;
    }
}
@media only screen and (min-width: 320px) and (max-width: 479px){
    html {
        font-size: 42.67px !important;
    }
}
@media only screen and (min-width: 480px) and (max-width: 639px){
    html {
        font-size: 64px !important;
    }
}
@media only screen and (min-width: 640px) and (max-width: 749px){
    html {
        font-size: 85.34px !important;
    }
}
@media only screen and (min-width: 750px) and (max-width: 959px){
    html {
        font-size: 100px !important;
    }
}
@media only screen and (min-width: 960px) and (max-width: 1241px){
    html {
        font-size: 128px !important;
    }
} 
@media only screen and (min-width: 1242px){
    html {
        font-size: 165.6px !important;
    }
}
js控制
（zepto / jQuery）（750px设计图的1rem = 100px）
100% =750px
function setFont() {
    let window_width = window.innerWidth;
    let font_size = parseFloat(window_width / 3.75);
    $('html').css('font-size', font_size);
}
 
$(window).on('resize', function () {
    setFont();
});


 (function () {
    function setRootFontSize() {
        let dpr, rem, scale, rootWidth;
        let rootHtml = document.documentElement;
    
        dpr = window.devicePixelRatio || 1; //移动端必须设置
        //限制展现页面的最小宽度
        rootWidth = rootHtml.clientWidth < 375? 375: rootHtml.clientWidth;
        rem = rootWidth * dpr / 3.75; // 19.2 = 设计图尺寸宽1920 / 100（设计图的1rem = 100px）
        scale = 1 / dpr;
    
        // 设置viewport，进行缩放，达到高清效果 (移动端添加)
        let vp = document.querySelector('meta[name="viewport"]');
        vp.setAttribute('content', 'width=' + dpr * rootHtml.clientWidth + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');
    
        // 动态写入样式
        rootHtml.style.fontSize = `${rem}px`;
    }
    setRootFontSize();
    window.addEventListener("resize", setRootFontSize, false);
    window.addEventListener("orientationchange", setRootFontSize, false); //移动端

原文链接：https://blog.csdn.net/a314753967/article/details/125800025
一、vw px rem em是什么
1.vw:就是相对视口宽度(Viewport Width)。1vw = 1% * 视口宽度。也就是说，一个视口就是100vw。

2.px:px应该是在css中使用最为普遍的单位了吧。px是屏幕设备物理上能显示出的最小的一点。这个点不是固定宽度的，是相对长度单位。在桌面浏览器中，1个像素往往是对着电脑屏幕的1个物理像素，但是在移动端，随着Retina屏的流行，分辨率提高了。css中的1px并不等于设备的1px。比如苹果三手机，分辨率是320 x 480。苹果四手机，变成了640 x 960，但是苹果四手机的实际屏幕尺寸并没有变化。这时候的1个css像素就是等于两个物理像素。

3.rem:是相对单位，相对于html的字体尺寸。

4.em:所有现代浏览器下，默认字体尺寸都是16px。这时,1em = 16px。em会继承父级迟钝，也是相对单位。

二、vw px rem之间的换算
1.我们假设pad的设计稿是以1920px为标准的。那么：
100vw = 1920px
1vw = 19.2px
我们想要： 1rem = 100px（这样方便我们在写代码的时候换算）
那么:
100px = 100vw / 19.2 = 1rem
所以：
1rem = 5.208vw。
这时候，我们只要给html的根元素设置：
font-size: 5.208vw即可。

2.同理的，手机端我们假设设计稿是以750px为标准的，那么:
100vw = 750px
1vw = 7.5px
我们想要： 1rem = 100px
那么：
100px = 100vw / 7.5 = 1rem
那么：
1rem = 13.33vw
https://blog.csdn.net/qq_41623635/article/details/121491543

  清除日志
  plugins.push('transform-remove-console')


关闭浏览器页签提示
       window.onbeforeunload=function(e){
            var e=window.event||e
            e.returnValue="确认关闭页面吗?"
        }
        https://blog.csdn.net/xj932956499/article/details/103181022?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1-103181022-blog-115324956.pc_relevant_aa&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1-103181022-blog-115324956.pc_relevant_aa&utm_relevant_index=1


标题前缀---

         &:before {
      background: #5372EC;
      border-radius: 0px 2px 0px 2px;
      content: "";
      display: inline-block;
      vertical-align: middle;
      width: 3px;
      height: 12px;
      margin-right: 6px;
      margin-left: 2px;
    }



什么是webview
    https://blog.csdn.net/weixin_46932303/article/details/122768612


    
3 离线加载机制探究


3.1 Android 离线加载机制

Android实现加载本地文件的api相对较少，主要是包括直接load本地文件以及拦截资源请求两个方案。


3.1.1 直接load本地文件
通过WebView的loadUrl方法加载本地h5工程
webview.loadUrl(XCache.getApp(id).getHtmlPath());
对客户端来说该方法简单粗暴，而且加载速度非常快，但存在许多因为file协议引起的问题，本地文件的url格式为“file:///data/data/pacakagename/xxxxx”，从url上看这类url是不存在域名的，而h5页面的加载大多与域名相关联。
Cookie，因为没有域名问题会导致无法获取cookie，那么最直接的问题就是登录态的丢失。
跨域，因为file域问题导致远程请求都变成跨域请求，导致大部分接口请求无法响应。
scheme补齐，前端开发习惯一般网络请求url是不带scheme的，如“loacation.href='//hybrid.jd.com'”，而真正发出请求时内核会自动补齐scheme变成“file//hybrid.jd.com”导致url无法访问。
虽然能通过曲线救国方式解决以上问题，比如将网络请求桥接到原生，但整体改动费时费力，放弃吧。
3.1.2 拦截资源请求

谷歌提供了拦截资源请求的API：

@Nullable
public WebResourceResponse shouldInterceptRequest(WebView view,
        WebResourceRequest request) {
    return shouldInterceptRequest(view, request.getUrl().toString());
}
只需要构造WebResourceResponse对象即可实现本地文件加载，毫无副作用，这也是目前各大厂App的方案，相比iOS，安卓在方案上相对比较简单。京东商城App最终也是使用了该方案拦截加载本地文件，我们在这里提一下特别需要注意的点。


3.1.2.1 请求中body丢失

WebResourceRequest中不包含body，该方法中不要拦截post请求，会有丢失body的风险。只用该方法加载本地文件资源，所以不存在body丢失的情况。


3.1.2.2 WebResourceResponse的构造

先看看WebResourceResponse的构造方法，主要包括mimeType、encoding、文件数据流三个入参数，如谷歌源码注解中提到的，mimeType和encoding只能是单个值，不能是整个Content-Type值。我们尝试发现js、css等资源如果mimeType和encoding是错误的，内核都按默认的utf-8编码文本进行处理。但mimeType对于html来说必须是特定的格式，比如“text/html”，否则内核无法解析html。
3.1.2.3 跨域请求资源

除了mimeType、encoding还有一些需要特别注意的，包括access-control-allow-origin、timing-allow-origin等一些跨域的Header。一般情况下，浏览器内核是默认js、css等资源文件是允许跨域的，不排除前端因为一些特殊原因强制校验跨域。如：

<script src="user.com/index.js" crossorigin ></script>

如果前端限制了跨域，加载本地文件也必须在Response header中增加跨域处理,否则内核会拒绝响应。

header.put("access-control-allow-origin",*);
header.put("timing-allow-origin",*);



这里简单介绍一下我们的网络层的几点优化措施：


1. 网络连接复用
我们知道在HTTP2.0支持TCP连接复用，但是在客户端层面不同的NSURLSession实例是无法进行复用的。如果连接被复用，DNS解析、TCP握手、网络连接的时间都可以被节省的，这些时间耗时在50～100ms左右。可以通过Charles抓包就可以验证。
所以我们的网络框架设计了在底层使用同一个NSURLSession实例，上层进行网络请求的管理，尽可能的去复用网络通道，当然AFNetworking等网络框架也是这么做的。


2. 并发控制
为了对网络框架进行并发控制，在底层使用同一个并发队列，便于总体控制。根据当前系统状况调整并发量，另外自定义异步Operation进行任务的处理。


3. 超时重试机制
超时重试机制的超时时间和重试次数的选择没有一个标准，针对不同的网络环境和请求类型应该有灵活的策略。我们采取快速重试和超时时间递增的策略，可以解决部分短时网络故障下的资源重试问题。


4. 任务优先级
不同的资源和请求类型，优先级显然是不同的，我们设置HTML文件优先级最高，js、css以及超时重试的优先级次之，最后才是其他资源优先级最低。后续这部分还会进一步细化，比如将性能、异常类的埋点的优先级调整道最低，避免它们与业务请求抢占资源。


5. 自定义网络缓存
由于NSURLCache容量较小、不支持自定义策略以及无法使用磁盘缓存等缺点，我们自己实现了一套网络缓存，遵守http标准缓存协议同时添加了一些自定义策略，除了支持内存缓存和磁盘缓存外，还支持自定义缓存策略，比如：缓存限制、可动态分配缓存容量、不影响首屏加载的资源不缓存、HTML不缓存等，另外还实现了LRU的淘汰策略和缓存清理功能。
App离线加载实践

京东商城将h5资源分为业务离线包、公共离线包、全局离线包三类，离线文件结构如下：

业务离线包主要包含业务开发的js、css、图片等资源，公共离线包主要包含京东通用的功能组件，如互动类可以使用同一个公共离线包，共用互动组件资源，避免业务离线包之间资源重复造成流量及带宽的浪费。
4.1 离线包的生成

离线包资源作为H5页面资源在客户端本地的一份拷贝，在资源内容上应该是完全一致的。所以在生成离线包的初期，我们需要接入的业务将发布H5页面的资源，在平台同步上传一份来保证资源一致。该方案需要同一份资源在两个平台发布，因为不同平台发布策略的不同，会伴随着带来接入方改造成本，需要接入的H5业务同时维护两套打包流程，以满足离线包规范和H5页面规范。
为了降低对H5业务带来的额外接入成本，我们优化了离线包的生成流程。
接入方从一个可访问的H5页面URL入手，通过在服务端模拟浏览器的页面加载过程，拦截所有的页面加载请求，从中分析出可配置离线的资源URL列表返回到配置平台。基于不同资源参与H5页面首屏幕渲染的权重不一样，在这一步我们也会提供优先css/js的返回策略。 后续接入方可以通过可视化的方式在平台勾选希望离线加载的资源，确认后，服务端会拉取对应的URL资源生成离线包，并在包中加入一个资源描述文件，包含用户客户端匹配的资源URL，以及真实的资源请求header，方便用于离线资源的回传。
经过这个流程的优化，已经大大降低了业务接入成本，不需要再维护两套打包策略，但是不可避免的还需要接入方手动选择离线包资源。为进一步降低接入难度，我们提供了另一种前端工程自动化的离线包生成方式，通过提供命令行工具来融入前端H5项目中，配置生成离线包目录，将该目录中的资源通过一行命令生成合规离线包，并上传到发布平台。



4.2 离线包本地管理


4.2.1 离线包下载分级

为了提高离线包的使用率，对离线包的下载进行分级分类，一共分成T级、S级、A级分别对应不同的下载策略。

T级：app启动或app切换前后台时触发下载，主要包括大促等入口在首页且PV量较高的业务。

S级：首页渲染完成后触发下载，主要包括入口比较浅的业务，但同时避免抢占首页本身的资源加载。

A级：指定页面触发下载，适合入口比较固定、PV量相对较小的业务，避免所有用户下载导致流量及带宽的浪费。

同一级别下不同离线包的下载顺序则采用配置权重+本地权重的方式进行权重加和计算优先级，其中本地优先级根据LRU算法动态计算，用户最近使用越多的离线包权重越高。

$$
最终权重 = 配置权重 + 本地权重（LRU）
$$

除了以上优先级的处理，离线包下载也增加了部分前置下载条件，主要包括当前线程数、CPU使用率等，不做压死骆驼的最后一跟稻草。


4.2.2 差分包策略

京东商城离线包差分使用的是bsdiff差分算法，那么差分包如何进行管理呢？一般情况做法都是客户端将本地离线包的版本号上传给服务端，由服务端返回对应版本的差分包地址下发到客户端。但是在离线包量较大的情况下，客户端就需要获取所有离线包版本进行上传，对于客户端和服务端都会增加一些逻辑。所以我们前后端做了规范约定，只需服务端按规范生成差分包地址即可，格式如下：

完整包地址_服务端版本号_客户端本地版本号
例如：https://storage.360buyimg.com/hybrid/xxxxx.zip_2_1

客户端拉到新版本离线包url后，就可以根据规范拼接差分包下载地址。


4.2.3 自动灰度
通过离线包下载分级、差分包方案在一定程度上减少了离线包下载带宽流量的减少，为了进一步减少离线包下载的流量峰值，我们增加了自动灰度能力，根据业务选择灰度比例进行等差灰度放量。如业务选择1小时完成全量灰度，后台则自动按每5分钟放量一次，12次放全量。
4.3 资源离线加载


4.3.1 资源匹配逻辑

前面提到离线包压缩包中会包含离线包对应的资源映射配置文件，通过h5页面的url获取到离线包后，读取离线包中映射文件内容进行资源本地加载匹配。


5 更多优化措施

前面我们主要介绍了通过离线包来解决h5页面加载过程中实时拉取资源造成耗时的问题。下面我们再来看看其他影响h5加载性能的一些步骤。让我们再次回到h5页面的加载流程

离线包架构图.png

如上图所示，通常情况下从用户点击到看到页面内容会包括 WebView初始化 、加载HTML、解析HTML、加载、解析JS/CSS资源、数据请求、页面渲染 等流程，我们构建的离线加载系统可以节约多个“下载”过程的耗时。但是这里依然有两个问题

1. 虽然我们有离线包系统，但是并非所有的业务都可以将html做到离线包内，比如一些SSR的业务，html往往不是静态页面，这种场景下整个流程几乎还是串行的（html->js->数据请求）。
2. 页面有意义的渲染一般都是发生在业务数据请求之后，上述流程中业务数据的请求和html、js等串行加载。
针对这两点，我们采用了以下方案来做优化：

通过html预加载，解决html串行加载的问题；

通过接口预加载，解决业务数据串行请求的问题；
5.1 html预加载

我们的目标是将html下载的时机尽量提前。一般情况下，我们在html真正加载前不管是应用层面还是系统层面或者Webkit内部都有一些预处理的逻辑，这些逻辑的耗时和业务复杂度相关，少则几十毫秒，多则几百毫秒，提前发起html请求可以有效的利用这段时间。当拦截到html请求时要么直接回调已下载完成的html，要么等待html返回后再进行回调。无论如何，相比串行请求，这种机制都有效的利用了html加载前的这段时间。具体的流程见图
html预加载示意图



5.2 接口预加载

数据接口的预加载的必要性与原理和html预加载类似，我们希望在页面初始化之前就开始请求数据，等拦截到对应的请求时直接返回预加载好的数据，以节约页面有意义的渲染时长。相对于html预加载，接口预加载的难点在于接口请求参数的配置，在最初的版本中，我们支持通过配置来完成请求参数的下发，可配置的内容包括:

业务自定义参数的固定部分

设备、用户基本信息的映射

接口请求中业务链接中的参数




///绘制表格空白间距
        border-collapse: separate;
        border-spacing: 10px;

        用table 的 border-space 做间距






            // {
    //     code: 'M_P_Version', key: 'ApplicationAccessManagement', title: '应用接入管理', children: [
    //     ]
    // },
    // {
    //     code: 'M_P_Version', key: 'SchemeConfigurationMange', title: '方案管理', children: [
    //         { code: 'M_P_45MoudelVersion', key: 'SchemeConfiguration', title: '方案配置', children: [] },
    //     ]
    // },


    
css设置字间距的方法：1、使用letter-spacing属性，语法“letter-spacing:间距值;”；
2、使用word-spacing属性，语法“word-spacing:间距值;”。










防抖实例:
dom:
   <Input.TextArea disabled={!canEdit} defaultValue={value} 
                                                onChange={answeTextarea}
                                                data-person= {JSON.stringify(i)}
                                                data-data= {JSON.stringify(item)}
                        // onChange={e=>eee.bind(this,e,item)}
                        // onChange={(e) => {debounce(backSave, 5000)();canEdit&&answer(null, i, item,e.target.value)}}
                         onBlur={(e)=>{//焦点移开，触发保存
                            console.log('onBlur',r)
                            const person=JSON.parse(e.target.dataset.person)
        const data=JSON.parse(e.target.dataset.data)
                            answer("",person,data,e.target.value)
                        }}
                         className="text-textArea" placeholder="请举例说明" maxLength={500} showCount autoSize={{
                            minRows: 6,
                            maxRows: 20,
                        }} />

func:
    const answeTextarea=startsave
    const startsave=debounceText((e)=>{console.log('save',e);
            const person=JSON.parse(e.target.dataset.person)
        const data=JSON.parse(e.target.dataset.data)
        //1.10秒更新state.data对应选项的内容
        //2.进行后台保存交互
        //3.焦点失去更新内容
        //3.如果点击保存，通过setTimeout=>save,0去执行，获取实时数据
        answer("",person,data,e.target.value)
    }, 30000)
  function debounceText(func, wait) {
        let timeout;
        return function (e) {
          console.log('debounceText--',e)
            const context = this;
            const args = arguments;
            clearTimeout(timeout)
            timeout = setTimeout(function(){
              //延迟30秒调用保存
                func.apply(context, args)
            }, wait);
        }
    }


登录鉴权的各种方式及区别:
https://blog.csdn.net/qq_43128157/article/details/124868780
cookie
session
token
OAuth

    token与jwt的区别
    https://blog.csdn.net/m0_51212267/article/details/121345316

基于JWT的身份认证
JWT全称JSON Web Token，前台在登录时，将用户信息发送给服务器，服务器将用户信息进行加密，返回JWT给前台，前台将其存到localStorage中，前台在axios中二次封装，拦截请求，后续发送请求时，在Authorization Header中携带上JWT，后台通过提前协商的密钥，解密JWT，验证用户信息，验证成功，响应请求数据，验证失败，返回登录页重新登录。

    cookie和session针对于建权做了什么处理

    webpack优化点
    加载比较慢，优化处理
    框架搭建
    搭建组件库，主题切换，form表单实现原理
    打包体积-体积优化



    CDN
    treeshaking-打包过程
    vite

    搭建稳定平台。稳定处理，搭建脚手架

    项目，埋点，监听报错，数据监控


    框架
    VUE2,VUE3
  diff算法
  vdom构建的
      VUE2 双端比较
      ,VUE3

  响应式，双向绑定，具体原理
  劫持代理



  输入网站-网页展示发生了什么
  DNS预解析
  如上图所示，通常情况下从用户点击到看到页面内容会包括 WebView初始化 、加载HTML、解析HTML、加载、解析JS/CSS资源、数据请求、页面渲染 等流程，我们构建的离线加载系统可以节约多个“下载”过程的耗时。但是这里依然有两个问题

  用户输入url地址，浏览器根据域名寻找IP地址
浏览器向服务器发送http请求，如果服务器段返回以301之类的重定向，浏览器根据相应头中的location再次发送请求
服务器端接受请求，处理请求生成html代码，返回给浏览器，这时的html页面代码可能是经过压缩的
浏览器接收服务器响应结果，如果有压缩则首先进行解压处理，紧接着就是页面解析渲染
　　解析渲染该过程主要分为以下步骤：

解析HTML
构建DOM树
DOM树与CSS样式进行附着构造呈现树
布局
绘制





开发代码规范


做过最复杂的功能或者项目（亮点）


工作以外如何学习提升自己

cr,cd,新版技术接触



1.新技术-输出到项目中
2.hook高阶用法
3.源码，原理理解，性能提升
4.生态对比，前景，优劣势
react UI渲染视图
vue MVVM


DNS预解析
https://juejin.cn/post/7031815988031160328
四次握手，三次挥手
网络
http3.0

打包大小
rollup,esbuild,webpack,grunt,gulp

浏览器渲染
defer async
spa,seo 首屏加载慢-ssr

怎么升级http2
webwork 预加载
多端公用
cor搭建部署
报警，埋点监控,performece,日志上报
eslint ,jest测试，git hook
promise源码认知

vite优缺点
业界其他方案对比
应用场景
制作demo，用到项目中


flatten
小程序



react-vue区别，源码，
react单向数据流
vue双向数据流

js css区别，性能
js操作dom导致
重排，大小，位置发生改变
重绘，背景色等

localstorage
sessionstorage
sessionStorage生命周期为当前窗口或标签页，一旦窗口或标签页被永久关闭了，那么所有通过sessionStorage存储的数据也就被清空了。localstorage永久存储本地内存
作用域限制
同源策略 同主机，同协议，同端口
同浏览器限制 都有
同源限制  都有同源策略限制，跨域无法访问
同标签页限制 sessionStorage，localstorage不受限制

CORS
不同域之间使用 XMLHttpRequest 和 Fetch 都是无法直接进行跨域请求的,浏览器又在这种严格策略的基础之上引入了跨域资源共享策略(CORS)，使用该机制可以进行跨域访问控制，从而使跨域数据传输得以安全进行。

触发GPU的线程
css transform
will-change https://blog.csdn.net/qiwoo_weekly/article/details/110016900
如果设置了 will-change 属性，那么浏览器就可以提前知道哪些元素的属性将会改变，提前做好准备。待需要改变元素的时机到来时，就可以立刻实现它们。从而避免卡顿等问题。

https://zhuanlan.zhihu.com/p/439866533

【转】前端脚手架开发入门
https://www.jianshu.com/p/728b81b698c3
https://blog.csdn.net/github_39506988/article/details/96274010
https://view.inews.qq.com/k/20220210A01WJK00?web_channel=wap&openApp=false

img图片被压缩变形解决方案CSS
https://blog.csdn.net/weixin_46806288/article/details/121743309

hooks--ahooks
https://zhuanlan.zhihu.com/p/346833039