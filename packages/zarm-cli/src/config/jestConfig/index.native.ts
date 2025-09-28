/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
import { getProjectPath } from '../../utils';

const pkg = require(getProjectPath('package.json'));
// 定义一个数组 transformPackages，列出那些即使位于 node_modules 里也需要被 Jest 转译（transpile）的包名。
// React Native 项目常把某些 npm 包从 transformIgnorePatterns 中排除（也就是强制对它们做 transform）。
const transformPackages = ['react-native', 'react-native-camera-roll-picker'];

module.exports = {
  // displayName，用于多个项目/配置同时运行时在控制台输出更清楚的标签
  displayName: {
    name: pkg.name,
    color: 'blue',
  },
  // preset: 'react-native',
  // 指定 Jest 的根目录为当前 Node 进程的工作目录（process.cwd()）。通常这会是项目根目录，
  rootDir: process.cwd(),
  // 指出 Jest 查找测试文件的根目录数组。这里限定只在 components 目录下查找测试文件
  roots: ['<rootDir>/components'],
  // transform：指定 Jest 如何转换不同类型的文件。
  transform: {
    '^.+\\.jsx?$': require.resolve('./preprocessor.native'), // 匹配 .js 或 .jsx 文件并交给 ./preprocessor.native 模块处理。require.resolve 返回该模块的绝对路径（Jest 需要模块路径）。
    '^.+\\.tsx?$': require.resolve('ts-jest'),
  },
  // setupFilesAfterEnv: [
  //   getProjectPath('scripts/jest/setup.js'),
  // ],
  // testRegex: '/__tests__/[^.]+\\.test(\\.(js|jsx|ts|tsx))$',
  // 匹配 __tests__ 目录下，文件名以 .native.test.js/.native.test.jsx/.native.test.ts/.native.test.tsx 结尾的文件。
  testRegex: '/__tests__/[^.]+\\.native.test(\\.(js|jsx|ts|tsx))$',
  // 这个模式会收集 components 目录下任意子目录中，后缀为 .native.ts 或 .native.tsx 的文件。也就是只针对 native 变体收集覆盖率。
  collectCoverageFrom: ['components/**/*.native.{ts,tsx}'],
  // 模块解析时支持的文件扩展名顺序。Jest 在解析模块导入时会按照这个数组尝试文件扩展名（例如 import './foo' 时尝试 foo.ts、foo.tsx、foo.js 等）。
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // 关键配置：告诉 Jest 在 node_modules 中忽略大多数包的转译，但使用负向前瞻 (?!...) 把 transformPackages 列表里的包排除在忽略之外（也就是这些包会被转译）。
  // transformPackages.join('|') 会把数组变成 'react-native|react-native-camera-roll-picker'，构建成正则的一部分。
  // 最终效果：<rootDir>/node_modules/(?! (react-native|react-native-camera-roll-picker) /) —— 除了这两个包外其余 node_modules 都被忽略 transform。
  // 这是 React Native 项目常见做法，因为 RN 包通常使用未编译的现代 JS，需要被转译。
  transformIgnorePatterns: [`<rootDir>/node_modules/(?!(${transformPackages.join('|')})/)`],
  // 指定测试运行时的环境为 jsdom（模拟浏览器 DOM）。适合 web/React 测试。如果测试大量依赖 React Native 的原生 API，可能需要 node 或 RN 特定的环境/额外的 mock。
  testEnvironment: 'jsdom',
};
