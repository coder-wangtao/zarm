const pkg = require('./package.json');

module.exports = {
  preset: 'ts-jest', // 使用 ts-jest 作为预设，可以直接测试 TypeScript 文件，不需要手动编译。
  displayName: {
    name: pkg.name, // 会在测试报告里显示当前项目名（自动从 package.json 取值 @zarm-design/cli）。
    color: 'blue',
  },
  testEnvironment: 'node', // 使用 Node.js 环境跑测试（而不是 jsdom）。适合 CLI、服务端逻辑测试。
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'], // 忽略编译输出目录 dist/ 和依赖 node_modules/，避免跑无意义的测试。
  // 也就是放在 __tests__ 目录下，文件名后缀是 .ts, .tsx, .js, .jsx 的都会被 Jest 执行。
  testMatch: ['**/__tests__/**/*.[jt]s?(x)'],
  // 让测试报告更详细，逐个用例输出执行情况。
  verbose: true,
};
