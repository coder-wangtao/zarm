dm dev -> WebpackDevServer
dm build -> webpack(config).run(() => {});
dm deploy -> gl-pages -d assets

把每个组件坐做成配置
key: 'button',
name: '按钮',
module: () => import('zarm/button/demo.md'), md 文件非常重要：里面编写组件的基本用法
source: 'zarm/button/demo.md',
style: true,

组件库文档分为 web 和 demo
web
web 展示组件库基本用法+demo(demo 使用一个 iframe 来展示)
md 文件编写组件的基本用法，使用 marked 这个库，自定义 marked（Markdown 转 HTML 库）的渲染器，并结合 Prism.js 进行代码高亮，同时在组件文档页对代码块生成 CodeSandbox(传给 codesandbox package.json、index.css、index.js、index.html)预览。demo 使用一个 iframe 来展示（传入 demo 的 url）

<!--
{
  entries: {
    index: {
      entry: ['./web/index.js'],
      template: './web/index.html',   组件库文档
      favicon: './favicon.ico',
    },
    demo: {
      entry: ['./demo/index.js'],
      template: './demo/index.html',   demo展示
      favicon: './favicon.ico',
    },
  },
}
-->

demo

针对每一个组件路由，使用 react-loadable 渲染一个自定义的 MarkDown 组件，自定义的MarkDown 组件同步对每个组件的 demo.md 中 markdown 每内容做正则匹配替换，使用浏览器端 Babel，将 JSX/ES6 转成浏览器可执行的 JS。最后将可执行的 JS 通过 new Function(...args)(...argv);来执行（创建一个新的作用域执行编译后的 JS 代码，使其能够访问 React、Zarm、GlobalContext 等变量。）
