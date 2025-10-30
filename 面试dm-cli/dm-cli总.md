//commander 作为命令行工具
ts 编写
"build": "yarn clean && tsc --build --force" 配合 tsconfig.json 将 ts 文件转换成 js 文件

npm install -g dm-cli 时，
会在全局生成一个可执行命令：dm-cli
执行时实际调用的是 bin/dm.js
接下来再去执行打包好的 cli.js
require('../dist/cli')
