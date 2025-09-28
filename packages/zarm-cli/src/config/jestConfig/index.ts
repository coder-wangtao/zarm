/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
import { getProjectPath } from '../../utils';

const pkg = require(getProjectPath('package.json'));

module.exports = {
  displayName: {
    name: pkg.name, // 显示项目的名字，来自 package.json
    color: 'blue', // 设置名称的颜色为蓝色，方便在控制台中区分
  },
  rootDir: process.cwd(), // 设置 Jest 的根目录为当前工作目录
  roots: ['<rootDir>/src'], // 指定 Jest 查找测试文件的根目录为 `src` 文件夹
  // setupFilesAfterEnv: [
  //   getProjectPath('scripts/jest/setup.js'),
  // ],
  // 指定 Jest 查找测试文件的正则表达式。这里的正则表达式表示，Jest 会查找所有位于 __tests__ 目录中的
  //  .test.js、.test.jsx、.test.ts 和 .test.tsx 文件。这是一个常见的文件命名规则，用于标识测试文件。
  testRegex: '/__tests__/[^.]+\\.test(\\.(js|jsx|ts|tsx))$',
  // transform：指定 Jest 如何转换不同类型的文件。
  transform: {
    '^.+\\.jsx?$': require.resolve('./preprocessor'), // 通过 ./preprocessor 预处理，这可能是一个自定义的 Babel 或其他转换器。
    '^.+\\.tsx?$': require.resolve('ts-jest'), // 通过 ts-jest 处理，这是专门用来编译 TypeScript 的 Jest 转换器。
  },
  // transformIgnorePatterns：指定哪些模块不应该被 Jest 转换。这里表示 node_modules 目录下，
  // 只有名为 zarm 的模块会被转换，其他模块会被忽略。这有助于提高构建效率，减少不必要的处理。
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\](?!zarm).+\\.(js|jsx|ts|tsx)$'],
  // collectCoverageFrom：指定哪些文件应该被收集覆盖。
  // src/**/*.{ts,tsx} 会收集 src 文件夹中的所有 TypeScript 文件（.ts, .tsx），但排除了以下几类文件：
  // .native.ts 和 .native.tsx 文件。
  // PropsType.ts 和 PropsType.tsx 文件。
  // 所有 style 目录下的文件（包括样式文件和相关的 TypeScript 文件）。
  // 所有测试文件。
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/*/*.native.{ts,tsx}',
    '!src/*/PropsType.{ts,tsx}',
    '!src/**/style/*.{ts,tsx}',
    '!src/style/**/*',
    '!src/**/__tests__/*',
  ],
  // 指定 Jest 查找模块时支持的文件扩展名。这些扩展名是 Jest 在导入模块时会尝试的文件类型。
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // 指定测试期间使用的 URL，通常用于模拟浏览器环境中的 window.location。这里设置为 http://localhost。
  testURL: 'http://localhost',
};
