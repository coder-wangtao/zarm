#!/usr/bin/env node

// import-local 是一个 NPM 包，用来优先加载项目本地安装的 CLI 版本。
// 当你在命令行运行一个全局安装的 CLI（比如 zarm）时，
// 这个脚本会先检查当前工作目录（CWD）下是否有本地版本的 CLI（比如 node_modules/zarm）。
// 如果找到本地版本，它会自动去执行本地版本的入口文件；
// 如果没找到，就继续执行当前这个全局版本。

const importLocal = require('import-local');

if (!importLocal(__filename)) {
  require('../dist/cli');
}
