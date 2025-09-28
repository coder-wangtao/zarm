export default {
  presets: [require.resolve('metro-react-native-babel-preset')], // 这个预设是为 React Native 项目定制的 Babel 预设，包含了 React Native 所需的默认转译配置。它包括了对 JSX 语法、ES6+ 语法（如箭头函数、类语法、async/await）的支持。
  plugins: [
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }], // 支持 JavaScript 中的 装饰器语法（例如 @decorator）。
    require.resolve('@babel/plugin-proposal-optional-chaining'),
  ],
};
