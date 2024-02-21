#  前端开发工具

## 背景  
  
- 前端项目繁多，框架各异，学习成本较高
- 前端项目目前无单元测试
- webpack 配置每个项目不同，没有最优配置，不能统一更新配置
- 每个项目发版，需要单独申请ducc，导致版本管理较复杂
- 新的构建工具vite、esbuild等出现，提高前端效率  

## 目标

- 支持  create
  - 创建项目模板：PC端、移动端）
- 支持  pont
  - 使用pont 初始化 swagger 接口定义
- 支持  dev
  - 使用webpack 或 vite 本地开发，可无缝切换不同打包工具
- 支持  test
  - 使用 jest 提高前端测试覆盖率
- 支持  build
  - 使用 webpack（esbuild、rollup） 构建项目
- 支持  release
  - 发布项目到前端版本统一平台  

## 前端开发流程

1. 创建项目（调研PC还是移动端、兼容性）  

> 项目模板中，包含UI库及路由示例
  
```bash
# 安装命令
pnpm i @jd/ typecript

# 交互式命令创建项目
npx  create

```

2. 生成后台接口定义
```bash
# 修改.js 中 swaggerUrl 配置
npx  pont
```

3. 开发及测试

```bash
# 启动开发
npx  dev

# 不断添加单元测试
npx  jest
```

4. 发布

```bash
# 发布（通过在bamboo中配置环境变量，发布到不同环境：测试、预发、生成）
npx  release
```

## .js 配置文件说明

```typescript
{

    // 后台接口swagger 地址
    swaggerUrl?: string

    /**
   * 开发端口号
   */
  port?: number

  /**
   * 程序入口目录，根据目录下的文件生成多个entry
   */
  entryPath: string

  /**
   * 打包工具 webpack 或者 vite
   */
  packLib: 'webpack' | 'vite'

  /**
   * 是否支持组件的自动ES 引入
   */
  import?: string | IImportOption

  /**
   * less 的选项
   */
  lessOptions?: any

  /**
   * 是否使用esbuild-loader 加载 和打包项目
   */
  useESBuilder?: boolean

  /**
   * 是否 只在开发环境使用esbuild-loader
   */
  esbuilderOnlyDev?: boolean

  /**
   * 默认框架 'react' | 'vue'
   */
  framework: 'react' | 'vue'

  /** webpack 代理配置 */
  proxy?: any

  /** 自动上传到OSS */
  autoJss?: Partial<IJSSWebpackPluginOptions> & { cndPath?: string }

  /** 自动发布DUCC */
  autoDucc?: Partial<IDUCCWebpackPluginWebpackPluginOptions>

  /**
   * 自定义修改webpack配置
   */
  chainWebpack?: (config: webpack.Configuration, opts: IOpts) => void
    
}
```