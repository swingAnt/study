一、背景
当我们长期维护一个前端项目时，通常会沉淀测试用例并考虑使用自动化测试来回溯历史逻辑和保证迭代质量，而稳定的自动化测试环境和UI自动化测试往往离不开无头浏览器和Puppeteer。

二、无头浏览器
1、无头浏览器介绍
无头浏览器是一种没有图形用户界面（GUI）的浏览器，一般主要是指Chrome浏览器的Chrome headless版本，它核心是通过在内存中渲染页面，然后将结果发送回请求它的用户或程序来实现对网页的访问，而不会在屏幕上显示网页，是一种强大的工具，可以用于各种任务如网络爬虫、网站监控和自动化测试等。

以Chrome浏览器为例，在使用命令行启动浏览器时追加 --headless 参数，便可以使用 headless 模式启动 Chrome浏览器，以基于无头浏览器截取京东主页首屏截图为例，命令行脚本如下所示：

以 Mac 电脑为例
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --headless --screenshot https://www.jd.com
2、无头浏览器的优缺点
无头浏览器的优点：

▪可以用于自动化任务，这些任务在基于GUI的浏览器中难以或不可能完成；
▪比基于GUI的浏览器更有效率，因为它们不需要将页面渲染到屏幕上；
▪可以用于绕过robots.txt并访问GUI浏览器中会被阻止的页面；
▪无需人的干预，运行更稳定；
无头浏览器的缺点：

▪使用门槛比基于GUI的浏览器更高，因为没有GUI，因此需要使用命令行界面或脚本语言来控制它们；
▪不一定支持所有基于GUI的浏览器功能；
▪可能无法访问需要用户登录的网站，或者解析需要登录的网站并使用脚本来键入账号密码；
三、Puppeteer
1、Puppeteer介绍
Puppeteer 是一个 Node.js 库，它提供了一系列 API 来控制 Chrome 或者 Chromium，Puppeteer 默认是以无头模式来启动浏览器，同时也支持配置完成的GUI模式来启动浏览器。

在 Puppeteer 官网中我们可以看到官网提供的一些 Puppeteer 的应用场景：

▪生成页面的屏幕截图和 PDF；
▪抓取 SPA（单页应用程序）并生成预渲染内容（即“SSR”（服务器端渲染））；
▪自动化表单提交、UI 测试、键盘输入等；
▪使用最新的 JavaScript 和浏览器功能创建自动化测试环境；
▪捕获 站点的时间线跟踪以帮助诊断性能问题；
▪测试 Chrome 扩展；
2、Puppeteer Core
当我们安装 Puppeteer 时，Puppeteer会自动下载最新版本的 Chromium，以确保可以与 API 配套使用，但是当我们运行环境中已经安装有 Chrome 或者 Chromium 浏览器时，往往不希望下载额外的浏览器来增加项目的安装成本，这个时候我们可以使用 Puppeteer 提供的 Puppeteer Core 解决方案。

Puppeteer Core 是 Puppeteer 的轻量级版本，不会下载任何浏览器，需要我们手动设置并启动现有浏览器安装或连接到远程浏览器，同时需要我们确保安装的 Puppeteer Core 版本对应的 API 和连接的浏览器是配套和兼容的。

3、Puppeteer API 分层结构
﻿﻿﻿

    Puppeteer 中最核心的概念就是 Browser 和 Page，对应又会衍生出 BrowserContext 和 Frame，相关介绍如下：

◦Browser：表示一个浏览器实例，一个 Browser 可以包含多个 BrowserContext；
◦BrowserContext：表示浏览器的一个上下文会话，一般 Browser 默认会生成一个普通模式的上下文，当又打开一个隐身模式的浏览器时则会新生成一个 BrowserContext，一个 BrowserContext 可以包含多个Page；
◦Page：表示一个 Tab 页面，一个 Page 可以包含多个 Frame；
◦Frame：表示一个框架，每个页面都会有一个主框架，一个 Page 中复数的 Frame 均由 iframe 标签产生；
4、Puppeteer 简单应用示例
页面截屏
const puppeteer = require('puppeteer-core');
(async () => {
    const browser = await await puppeteer.launch({
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    });
    const page = await browser.newPage();
    // 设置可视区域大小
    await page.setViewport({ width: 375, height: 667 });
    await page.goto('https://st.jingxi.com/', {
        waitUntil: 'networkidle2'
    });
    page.on()
    // 截屏
    await page.screenshot({
        path: './screenshot.png',
        type: 'png',
    });
    // 关闭浏览器
    await page.close();
    await browser.close();
})();
执行 JS 代码
const puppeteer = require('puppeteer-core');
(async () => {
    const browser = await await puppeteer.launch({
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    });
    const page = await browser.newPage();
    // 设置可视区域大小
    await page.setViewport({ width: 375, height: 667 });
    await page.goto('https://st.jingxi.com/');
    // 执行 JS 代码
    const bodyHtml = await page.evaluate(() => window.document.body.innerHTML);
    console.error(bodyHtml);
    // 关闭浏览器
    await page.close();
    await browser.close();
})();
请求拦截
const puppeteer = require('puppeteer-core');
(async () => {
    const browser = await await puppeteer.launch({
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    });
    const page = await browser.newPage();
    // 开启请求拦截
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest) => {
        // 拦截主接口
        if (interceptedRequest.url().includes('jx_home')) {
            // options 请求继续
            if (interceptedRequest.method() === 'OPTIONS') {
                interceptedRequest.continue();
                return;
            }
            // 请求 404
            interceptedRequest.respond({
                body: '',
                status: 404,
                contentType: 'application/json;charset=UTF-8',
                headers: {},
            });
            return;
        }
        // 其他请求默认继续
        interceptedRequest.continue();
    });
    // 设置可视区域大小
    await page.setViewport({ width: 375, height: 667 });
    await page.goto('https://st.jingxi.com/');
    // 关闭浏览器
    await page.close();
    await browser.close();
})();
四、CDP
1、CDP介绍
CDP 是 Chrome DevTools Protocol 的简称，本质上是一组通信协议，允许开发人员与基于 Chromium 的浏览器（包括 Google Chrome）进行通信。CDP最初是为了支持 Chrome 中的开发人员工具功能而开发的，但自推出以来，其用途已远远超出了最初的初衷。

CDP协议氛围多个域，每个域中都定义了相关的命令和事件，域列表如下所示：

﻿﻿﻿

2、CDP的作用与使用
Puppeteer 本质上其实是 CDP 协议的上层封装，并且不提供一些实验性质的协议 API，因此直接使用CDP可以更大程度的扩展 Puppeteer 一些不支持的功能，比如 Page.startScreencast 协议能让浏览器开启录屏功能并将每帧保存为图片，比如可以通过 CDP 对象监听浏览器的导航重定向消息（Page.frameNavigated）、页面加载消息（Page.loadEventFired）等浏览器的一些生命周期消息。

尽管 Puppeteer 没有封装全部的 CDP 协议，但是暴露相关API允许我们获取 CDP 实例，从而监听和发送相关 CDP 协议API。Puppeteer 中的调用对应的API是 createCDPSession，以录屏为例，相关demo如下所示：

const fs = require('fs');
const puppeteer = require('puppeteer-core');
(async () => {
    const browser = await await puppeteer.launch({
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    });
    const page = await browser.newPage();
    // 设置可视区域大小
    await page.setViewport({ width: 375, height: 667 });
    await page.goto('https://st.jingxi.com/');
    // 录屏数据
    const screencasts = [];
    // 获取 CDP 对象
    const client = await page.target().createCDPSession();
    // 监听帧录屏消息
    client.on('Page.screencastFrame', ({ data, sessionId }) => {
        screencasts.push(data);
        // 请求下一次帧录屏
        client.send('Page.screencastFrameAck', { sessionId });
    });
    // 开始录屏
    await client.send('Page.startScreencast', {
        format: 'png',
        quality: 100,
        everyNthFrame: 1,
    });
    // 录屏1秒
    await new Promise((resolve) => { setTimeout(() => { resolve(); }, 1000); });
    // 停止录屏
    await client.send('Page.stopScreencast');
    await client.detach();
    // 保存录屏图片到本地
    screencasts.forEach((item, index) => {
        const base64 = item.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(`./screencast/${index}.png`, base64, 'base64');
    });
    // 关闭浏览器
    await page.close();
    await browser.close();
})();
五、总结
我们可以直接使用 Puppeteer 来代替更底层的 CDP 协议来实现我们的UI验证、自动化测试等诉求，从而降低直接使用 CDP 的成本和门槛，对于特殊的诉求则需要研究并尝试使用更底层的 CDP 协议来控制浏览器实现功能。

六、参考资料
◦﻿https://pptr.dev/﻿
◦﻿https://chromedevtools.github.io/devtools-protocol/﻿
◦﻿https://peter.sh/experiments/chromium-command-line-switches/