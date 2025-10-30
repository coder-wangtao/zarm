// 使用Babel CLI（通过命令行调用）直接支持 --extensions, --out-dir, --copy-files
// 方便一次性编译整个目录
// 配合 execa 异步调用，适合脚本自动化

// zarm build --mode es --path src --out-dir es --copy-files --build-css,

const args = [
  require.resolve('@babel/cli/bin/babel'), // 使用 babel 编译器
  path, // 输入路径 src
  '--extensions', // 需要编译的文件扩展名
  ext, // 允许的扩展名
  '--ignore', // 忽略文件类型
  '**/*.d.ts', // 忽略所有的类型声明文件
  '--config-file', // 使用特定的 Babel 配置文件
  require.resolve(`./config/babelConfig/${mode}`), // 根据模式加载不同的 Babel 配置
  // 当你用 Babel 编译源代码时，默认只处理 JS/TS 文件（比如 .js、.ts、.tsx）。
  // 如果你的项目里还有 图片、字体、JSON、样式文件 等资源文件，Babel 默认不会输出它们。
  // --copy-files 就告诉 Babel：把这些非代码文件也复制到输出目录。
  '--copy-files',
];

// es打包和lib打包最主要的区别：
[
  require.resolve('@babel/preset-env'),
  {
    modules: false,
  },
];
// modules: false
// Babel 不转换 ES6 模块语法，保留 import / export。
// 让现代打包工具（Webpack、Rollup、Vite 等）能做更好的 Tree Shaking。
// 适合前端项目打包，不破坏模块静态结构。
// 缺点：如果直接在不支持 ES6 模块的环境（比如老 Node.js 或老浏览器）执行，会报错。

env: {
  test: {
    plugins: [
      require.resolve('@babel/plugin-transform-modules-commonjs'), 
      require.resolve('@babel/plugin-transform-runtime'),
    ],
  },
},


// env:在这里，test 环境通常对应 运行 Jest 测试时的环境。
// @babel/plugin-transform-modules-commonjs
// 强制将 ES6 模块（import/export）转换为 CommonJS 模块（require/module.exports）。
// 为什么测试环境需要？
// Node.js（Jest）默认使用 CommonJS，而 import/export 语法可能不被直接支持。
// 确保你的测试代码可以在 Node.js 中正常运行，而不报模块语法错误。
// @babel/plugin-transform-runtime
// 在测试环境下也启用，作用同平时：
// 避免重复生成辅助函数（例如 _extends、_asyncToGenerator 等）。
// 支持 async/await、生成器等语法而不污染全局作用域。

// --build-css
//  1.编译 SASS → CSS
// 2\.生成一个额外的 JavaScript 文件（css.js），这个文件用于在运行时注入 CSS（比如在 React 组件库里自动加载样式）。
// project/
// ├── components/
// │   └── button/
// │       ├── index.scss
// │       ├── index.tsx
// │       └── style/
// │           └── index.js
// ├── dist/
// ├── gulpfile.js
// └── package.json

// index.scss
// components/button/index.scss
// $color: #42b983;
// .button {
//   background-color: $color;
//   color: white;
//   padding: 8px 16px;
//   border-radius: 4px;
// }

// style/index.js
// components/button/style/index.js
// console.log('button style loaded');

// dist/
// └── components/
//     └── button/
//         ├── index.css          ← 编译后的 CSS
//         └── style/
//             ├── index.js       ← 原始 JS
//             └── css.js         ← 新生成的 JS，用于注入 CSS

// dist/components/button/index.css：
// .button {
//   background-color: #42b983;
//   color: white;
//   padding: 8px 16px;
//   border-radius: 4px;
// }

// dist/components/button/style/css.js：
// import '../index.css';
// console.log('button style loaded');

