window.onload = () => {
    class WuJie extends HTMLElement {
        constructor() {
            super()
            this.init()
            this.getAttr('url')
        }
        init() {
          // 1. 创建 shadow root（DOM 子树的根节点，它与文档的主 DOM 树分开渲染）
          const shadow =  this.attachShadow({ mode: "open" }) //开启影子dom 也就是样式隔离
          // 2. 创建或获取 shadow DOM 结构
          const template = document.querySelector('#wu-jie') as HTMLTemplateElement
          console.log(template);
          // 3. 将所创建或获取的元素添加到 Shadow DOM 上
          shadow.appendChild(template.content.cloneNode(true))
        }
        getAttr (str:string) {
           console.log('获取参数',this.getAttribute(str));
        }
        //当 custom element 首次被插入文档 DOM 时，被调用
        connectedCallback () {
           console.log('类似于react/vue 的mounted');
        }
        //当 custom element 从文档 DOM 中删除时，被调用。
        disconnectedCallback () {
              console.log('类似于react/vue 的destory');
        }
        //当 custom element 增加、删除、修改自身属性时，被调用。跟watch类似
        attributeChangedCallback (name:any, oldVal:any, newVal:any) {
            console.log('跟vue 的watch 类似 有属性发生变化自动触发');
        }
    }
    // 注册 custom elements, 定义一个名为 <wu-jie> 的组件
    window.customElements.define('wu-jie', WuJie)
}

源代码解析
无界目录结构
|- packages
  |- wujie-core
  |- wujie-vue2
  |- wujie-vue3
  |- wujie-react


  无界架构采用分层设计，由应用适配层和核心能力层两部分构成。

  无界wujie-core文件结构
  ├── src
    ├── common.ts // 一些公共的方法
    ├── constant.ts // 常量
    ├── effect.ts // 一些副作用方法，比如重写了head和body的部分API
    ├── entry.ts // 和子应用入口文件相关的操作
    ├── event.ts // 事件相关
    ├── iframe.ts // iframe相关
    ├── index.ts // 入口文件
    ├── plugin.ts // 插件相关
    ├── proxy.ts // 代理相关
    ├── sandbox.ts // js沙箱相关
    ├── shadow.ts // css沙箱相关
    ├── sync.ts // 同步路由操作
    ├── template.ts // 模板相关
    ├── utils.ts // 工具函数

    无界适配层：例如 WujieReact
    import React from "react";
import PropTypes from "prop-types";
import { bus, setupApp, preloadApp, startApp, destroyApp } from "wujie";

export default class WujieReact extends React.PureComponent {
  static propTypes = {
    height: PropTypes.string,
    width: PropTypes.string,
    name: PropTypes.string,
    loading: PropTypes.element;
    url: PropTypes.string,
    alive: PropTypes.bool,
    fetch: PropTypes.func,
    props: PropTypes.object,
    replace: PropTypes.func,
    sync: PropTypes.bool,
    prefix: PropTypes.object,
    fiber: PropTypes.bool,
    degrade: PropTypes.bool,
    plugins: PropTypes.array,
    beforeLoad: PropTypes.func,
    beforeMount: PropTypes.func,
    afterMount: PropTypes.func,
    beforeUnmount: PropTypes.func,
    afterUnmount: PropTypes.func,
    activated: PropTypes.func,
    deactivated: PropTypes.func,
    loadError: PropTypes.func,
  };
  static bus = bus;
  static setupApp = setupApp;
  static preloadApp = preloadApp;
  static destroyApp = destroyApp;

  state = {
    myRef: React.createRef(),
  };

  destroy = null;

  startAppQueue = Promise.resolve();

  execStartApp = () => {
    this.startAppQueue = this.startAppQueue.then(async () => {
      try {
        this.destroy = await startApp({
           el: this.state.myRef.current,
           ...this.props
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  render() {
    this.execStartApp();
    return React.createElement("div", {
      style: {
        width: this.props.width,
        height: this.props.height,
      },
      ref: this.state.myRef,
    });
  }
}

Wujie-core入口文件
defineWujieWebComponent
import { defineWujieWebComponent } from "./shadow";
// 定义webComponent容器
defineWujieWebComponent();

// 定义webComponent  存在shadow.ts 文件中
export function defineWujieWebComponent() {
  class WujieApp extends HTMLElement {
    connectedCallback(){
      if (this.shadowRoot) return;
      const shadowRoot = this.attachShadow({ mode: "open" });
      const sandbox = getWujieById(this.getAttribute(WUJIE_DATA_ID));
      patchElementEffect(shadowRoot, sandbox.iframe.contentWindow);
      sandbox.shadowRoot = shadowRoot;
      // 下一步像示例中shadow.appendChild(template.content.cloneNode(true))
    }
    disconnectedCallback() {
      const sandbox = getWujieById(this.getAttribute(WUJIE_DATA_ID));
      sandbox?.unmount();
    }
  }
  customElements?.define("wujie-app", WujieApp);
}


startapp方法


export async function startApp(startOptions: startOptions): Promise<Function | void> {
    // 从无界实例缓存中读取
    const sandbox = getWujieById(startOptions.name);
    const cacheOptions = getOptionsById(startOptions.name);
    // 合并缓存配置
    const options = mergeOptions(startOptions, cacheOptions);
    const {
        name,
        url,
        html,
        ...
    } = options;
    // 已经初始化过的应用，快速渲染
    if (sandbox) {
        // 沙箱存在，则进入这里的流程
        // ...do something
        // return sandbox.destroy
    }

    // 创建子应用沙箱
    const newSandbox = new WuJie({ name, url, attrs, degradeAttrs, fiber, degrade, plugins, lifecycles });
    // 执行beforeLoad钩子
    newSandbox.lifecycles?.beforeLoad?.(newSandbox.iframe.contentWindow);
    // 获取子应用的html以及外链的js和css
    const { template, getExternalScripts, getExternalStyleSheets } = await importHTML({
        url,
        html,
        opts: {
            fetch: fetch || window.fetch,
            plugins: newSandbox.plugins,
            loadError: newSandbox.lifecycles.loadError,
            fiber,
        },
    });
    
    // 处理css
    const processedHtml = await processCssLoader(newSandbox, template, getExternalStyleSheets);
    // 激活沙箱
    await newSandbox.active({ url, sync, prefix, template: processedHtml, el, props, alive, fetch, replace });
    // 启动子应用
    await newSandbox.start(getExternalScripts);
    return newSandbox.destroy;
}


创建子应用沙箱

// 初始化赋值，
// 例如：id、fiber、degrade、bus、url、degradeAttrs、provide、
// styleSheetElements、execQueue、lifecycles、plugins等
// 创建iframe，并且将iframe挂到无界实例上 创建代理
// 并且将代理挂到无界实例上 将沙箱实例添加到缓存中

export default class Wujie {
    constructor(options: {
       name: string;
       url: string;
       attrs: { [key: string]: any };
       degradeAttrs: { [key: string]: any };
       fiber: boolean;
       degrade;
       plugins: Array<plugin>;
       lifecycles: lifecycles;
    }) {
       // 传递inject给嵌套子应用
       if (window.__POWERED_BY_WUJIE__) this.inject = window.__WUJIE.inject;
       else {
          this.inject = {
             idToSandboxMap: idToSandboxCacheMap,
             appEventObjMap,
             mainHostPath: window.location.protocol + "//" + window.location.host,
          };
       }
       const { name, url, attrs, fiber, degradeAttrs, degrade, lifecycles, plugins } = options;
       this.id = name;
       this.fiber = fiber;
       this.degrade = degrade || !wujieSupport;
       this.bus = new EventBus(this.id);
       this.url = url;
       this.degradeAttrs = degradeAttrs;
       this.provide = { bus: this.bus };
       this.styleSheetElements = [];
       this.execQueue = [];
       this.lifecycles = lifecycles;
       this.plugins = getPlugins(plugins);

       // 创建目标地址的解析
       const { urlElement, appHostPath, appRoutePath } = appRouteParse(url);
       const { mainHostPath } = this.inject;
       // 创建iframe
       this.iframe = iframeGenerator(this, attrs, mainHostPath, appHostPath, appRoutePath);

       if (this.degrade) {
          const { proxyDocument, proxyLocation } = localGenerator(this.iframe, urlElement, mainHostPath, appHostPath);
          this.proxyDocument = proxyDocument;
          this.proxyLocation = proxyLocation;
       } else {
          // 代理iframe的window对象，通过proxyWindow变量来引用
          // 代理iframe的document对象，通过proxyDocument变量来引用
          // 代理iframe的location对象，通过proxyLocation变量来引用
          const { proxyWindow, proxyDocument, proxyLocation } = proxyGenerator(
             this.iframe,
             urlElement,
             mainHostPath,
             appHostPath
          );
          this.proxy = proxyWindow;
          this.proxyDocument = proxyDocument;
          this.proxyLocation = proxyLocation;
       }
       this.provide.location = this.proxyLocation;

       addSandboxCacheWithWujie(this.id, this);
    }
}

创建iframe(iframeGenerator)

/**
 * js沙箱
 * 创建和主应用同源的iframe，路径携带了子路由的路由信息
 * iframe必须禁止加载html，防止进入主应用的路由逻辑
 */
export function iframeGenerator(
    sandbox: WuJie,
    attrs: { [key: string]: any },
    mainHostPath: string,
    appHostPath: string,
    appRoutePath: string
): HTMLIFrameElement {
    // 创建iframe元素
    const iframe = window.document.createElement("iframe");
    // 将属性设置到iframe上,iframe和主应用同域，且为隐藏状态（display:none）
    const attrsMerge = { src: mainHostPath, style: "display: none", ...attrs, name: sandbox.id, [WUJIE_DATA_FLAG]: "" };
    // 将属性设置到iframe上
    setAttrsToElement(iframe, attrsMerge);
    // 将iframe添加到body中，iframe为隐藏状态
    window.document.body.appendChild(iframe);

    const iframeWindow = iframe.contentWindow;
    // 变量需要提前注入，在入口函数通过变量防止死循环
    // 将变量注入到iframe中
    patchIframeVariable(iframeWindow, sandbox, appHostPath);
    sandbox.iframeReady = stopIframeLoading(iframeWindow).then(() => {
       if (!iframeWindow.__WUJIE) {
          patchIframeVariable(iframeWindow, sandbox, appHostPath);
       }
       initIframeDom(iframeWindow, sandbox, mainHostPath, appHostPath);
       /**
        * 如果有同步优先同步，非同步从url读取
        */
       if (!isMatchSyncQueryById(iframeWindow.__WUJIE.id)) {
          iframeWindow.history.replaceState(null, "", mainHostPath + appRoutePath);
       }
    });
    return iframe;
}

沙箱代理在创建iframe后，需要将iframe的window、document、location等对象代理，非降级模式window、document、location代理window代理拦截，修改this指向，下面看下整体的代码：

js 沙箱和 css 沙箱连接
采用 proxy + Object.defineproperty 的方式将 js-iframe 中对 dom 操作劫持代理到 webcomponent shadowRoot 容器中，开发者无感知也无需关心。
无界通过代理 iframe的document到webcomponent,从而实现两者的互联
proxyGenerator函数主要做了以下几件事情：

export function proxyGenerator(
    iframe: HTMLIFrameElement,
    urlElement: HTMLAnchorElement,
    mainHostPath: string,
    appHostPath: string
): {
    proxyWindow: Window;
    proxyDocument: Object;
    proxyLocation: Object;
} {
    // 返回子应用的window数据，只针对个别属性进行拦截
    const proxyWindow = new Proxy(iframe.contentWindow, {
        get: (target: Window, p: PropertyKey): any => {
          // location进行劫持
          if (p === "location") {
            return target.__WUJIE.proxyLocation;
          }
          // 判断自身
          if (p === "self" || (p === "window" && Object.getOwnPropertyDescriptor(window, "window").get)) {
            return target.__WUJIE.proxy;
          }
          // 不要绑定this
          if (p === "__WUJIE_RAW_DOCUMENT_QUERY_SELECTOR__" || p === "__WUJIE_RAW_DOCUMENT_QUERY_SELECTOR_ALL__") {
            return target[p];
          }
           ...
          // 修正this指针指向
          return getTargetValue(target, p);
        },

        set: (target: Window, p: PropertyKey, value: any) => {
            target[p] = value;
            return true;
        }
    });

    // proxy document
    // 劫持document上的部分方法，例如：getElementById、getElementsByTagName、getElementsByClassName、
    // getElementsByName、querySelector、querySelectorAll等,使之作用于shadowRoot根节点进行检索，
    // 劫持document上的部分属性，例如：forms、images、links等，使之基于shadowRoot根节点进行检索
    // 部分代理到shadoRoot,部分代理到原始的document上面
    const proxyDocument = new Proxy(
        {},
        {
            get: function (_fakeDocument, propKey) {
                const document = window.document;
                const { shadowRoot, proxyLocation } = iframe.contentWindow.__WUJIE;
                const rawCreateElement = iframe.contentWindow.__WUJIE_RAW_DOCUMENT_CREATE_ELEMENT__;
                const rawCreateTextNode = iframe.contentWindow.__WUJIE_RAW_DOCUMENT_CREATE_TEXT_NODE__;
                // 劫持对document的操作，使之作用于shadowRoot上
                // other proxy code
                if (propKey === "getElementById") {
                    return new Proxy(shadowRoot.querySelector, {
                        apply(target, ctx, args) {
                            // other code
                            target.call(shadowRoot, `[id="${args[0]}"]`)
                            // other code
                        },
                    });
                }
                // other proxy code
                if (propKey === "forms") return shadowRoot.querySelectorAll("form");
                if (propKey === "images") return shadowRoot.querySelectorAll("img");
                if (propKey === "links") return shadowRoot.querySelectorAll("a");
                // other code
                if (shadowMethods.includes(propKey.toString())) {
                  return getTargetValue(shadowRoot, propKey) ?? getTargetValue(document, propKey);
                }
                // from window.document
                if (documentProperties.includes(propKey.toString())) {
                  return document[propKey];
                }
                if (documentMethods.includes(propKey.toString())) {
                  return getTargetValue(document, propKey);
                }
            },
        }
    );

    // proxy location
    // 是用来代理iframe的location对象，使得我们对于location的操作基本上是基于子应用 
    // 将location代理到a标签，（子应用实际域名地址），其余访问location
    const proxyLocation = new Proxy(
        {},
        {
            get: function (_fakeLocation, propKey) {
                const location = iframe.contentWindow.location;
                // proxy location的 href host 等属性
                if (
                  propKey === "host" ||
                  propKey === "hostname" ||
                  propKey === "protocol" ||
                  propKey === "port" ||
                  propKey === "origin"
                ) {
                  return urlElement[propKey];
                }
                if (propKey === "href") {
                  return location[propKey].replace(mainHostPath, appHostPath);
                }
                // 返回location的属性
                return getTargetValue(location, propKey);
            },
            set: function (_fakeLocation, propKey, value) {
                iframe.contentWindow.location[propKey] = value;
                return true;
            }
        }
    );
    return { proxyWindow, proxyDocument, proxyLocation };


    在创建无界实例的时候，第一步是创建沙箱，而创建沙箱有两个关键步骤：

创建iframe，并挂到实例上
对iframe的window、document、location等对象进行代理,挂到实例上，除少部分属性和方法需要从主应用获取外，大部分都是从子应用获取的

完成创建iframe和代理后，无界实例就创建完成了。顺带提一下，我们在代码中访问window、document、location等对象时，是如何访问到代理对象上的呢？这里抛出一段无界中的代码，大家可以思考下：

    if (!iframeWindow.__WUJIE.degrade && !module) {
    code = `(function(window, self, global, location) {
      ${code}
}).bind(window.__WUJIE.proxy)(
  window.__WUJIE.proxy,
  window.__WUJIE.proxy,
  window.__WUJIE.proxy,
  window.__WUJIE.proxyLocation,
);`;
}