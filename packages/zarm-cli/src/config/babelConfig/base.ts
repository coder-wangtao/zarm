export default {
  presets: [
    [
      require.resolve('@babel/preset-env'), // 使用 @babel/preset-env 预设，自动选择适当的编译选项
      {
        modules: false, // 关闭模块转换，保持 ES 模块格式，通常用于 Webpack 中支持 Tree Shaking
      },
    ],
    require.resolve('@babel/preset-react'), // 启用对 React JSX 语法的转换
    require.resolve('@babel/preset-typescript'), // 启用 TypeScript 语法的转换
  ],
  plugins: [
    require.resolve('@babel/plugin-transform-runtime'), // 用于优化代码，减少辅助代码的重复生成，比如在不同文件中避免生成多次的 regeneratorRuntime。它还可以帮助避免将某些 ES 特性（如 Promise、async/await 等）内联到每个文件中。
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }], // 这个插件支持 JavaScript 类中的装饰器语法（比如 @decorator），这里设置了 legacy: true，表示使用的是旧版装饰器提案规范（
    [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }], // 支持类属性（包括静态属性和实例属性）。loose: true 设置表示使用更松散的属性初始化方式，这在某些情况下能减少一些代码量并提高性能。
    require.resolve('@babel/plugin-proposal-optional-chaining'), // 启用可选链操作符（?.）的支持。它可以简化对深层嵌套对象的访问，避免在某些对象为 null 或 undefined 时抛出错误
  ],
  env: {
    test: {
      plugins: [
        require.resolve('@babel/plugin-transform-modules-commonjs'), // 将 ES6 模块（import/export）转换为 CommonJS 模块（require/module.exports）。在 Node.js 环境下使用 CommonJS 格式，而在浏览器环境下使用 ES 模块。
        require.resolve('@babel/plugin-transform-runtime'), // 在测试环境下同样使用这个插件，确保在测试代码中不会重复生成辅助代码。
      ],
    },
  },
};
