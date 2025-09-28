module.exports = {
  presets: [
    // 按目标环境（浏览器或 Node.js 版本）转换 ES6+ 语法。
    // 例如 const、async/await、optional chaining 等会编译成兼容旧环境的语法。
    require.resolve('@babel/preset-env'),
    // 用来处理 React 代码，比如 JSX (<Button />)。
    // 会把 JSX 转换为 React.createElement 或 React 17 的新 JSX 转换。
    require.resolve('@babel/preset-react'),
    // 用来编译 TypeScript 语法（去掉类型注解）。
    // 注意：它只处理语法，不会做类型检查（类型检查需要 tsc）。
    require.resolve('@babel/preset-typescript'),
  ],
  plugins: [
    // 避免 Babel 把一些辅助函数（比如 _extends, _asyncToGenerator）反复插入到每个文件里。
    // 会从 @babel/runtime 引用这些函数，减小打包体积。
    // 还能 polyfill 一些新特性（如 Promise、Symbol），避免污染全局环境。
    require.resolve('@babel/plugin-transform-runtime'),
    // 支持类属性的编译，比如 class A { myProp = 123; }。
    // "loose: true" 会生成更简洁的代码，但不完全符合最新的 JavaScript 标准。
    [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
  ],
};
