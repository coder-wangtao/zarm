// 使用Babel CLI（通过命令行调用）直接支持 --extensions, --out-dir, --copy-files
// 方便一次性编译整个目录
// 配合 execa 异步调用，适合脚本自动化

// zarm build --mode lib --path src --out-dir lib --copy-files --build-css",

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
    modules: true,
  },
];
// modules: true（默认值）
// Babel 会把 ES6 的 import / export 语法转换成 CommonJS 模块（即 require / module.exports）。
// 优点：兼容 Node.js 或老旧环境。
// 缺点：会破坏一些打包工具的 Tree Shaking（去除未使用代码）功能。

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
