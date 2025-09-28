<!-- 
"publishConfig": {
    "access": "public"
} -->
是 npm 的一个字段，用来指定该包在执行 npm publish 时的发布配置。
access: "public"
指定这个包发布时是 公开的（public），任何人都可以从 npm 上安装。
常用于 npm scope 包（例如 @zarm-design/utils），因为 scoped 包默认是私有的，需要显式设置为 public 才能让别人安装。

<!-- 
  "scripts": {
    "build": "yarn build:lib && yarn build:es",
    "build:es": "rimraf es && tsc --outDir es && zarm build --mode es --path src --out-dir es --copy-files --build-css",
    "build:font": "webFontsHelper --src ./svg --fontName zaicon --fontPath src/font --className za-icon",
    "build:lib": "rimraf lib && tsc --outDir lib && zarm build --mode lib --path src --out-dir lib --copy-files --build-css",
    "build:react": "rimraf src/react && svgr ./svg --out-dir ./src/react",
    "build:svg": "rimraf svg && node ./scripts/exportSVG.js",
    "clean": "rimraf lib es coverage svg",
    "coverage": "rimraf coverage && yarn test -c",
    "test": "zarm test -s scripts/jest/setup.js"
  }, 
-->
"build": "yarn build:lib && yarn build:es",
执行 build:lib 和 build:es，分别构建 lib（CommonJS 版本）和 es（ESM 版本）。

"build:es": "rimraf es && tsc --outDir es && zarm build --mode es --path src --out-dir es --copy-files --build-css",
rimraf es → 删除旧的 es 目录。tsc --outDir es → 用 TypeScript 编译到 es 目录。
zarm脚手架 → zarm build --mode es --path src --out-dir es --copy-files --build-css"

"build:font": "webFontsHelper --src ./svg --fontName zaicon --fontPath src/font --className za-icon",
把 ./svg 目录下的 SVG 图标转换为字体文件，生成 zaicon 图标字体，并输出到 src/font，类名前缀是 .za-icon。
✅ 相当于把 SVG 图标打包成 iconfont。

"build:lib": "rimraf lib && tsc --outDir lib && zarm build --mode lib --path src --out-dir lib --copy-files --build-css",
删除旧的 lib 目录。用 TypeScript 编译到 lib 目录。再用 zarm 构建工具生成 CommonJS 格式。
✅ 输出 CommonJS 版本。

"build:react": "rimraf src/react && svgr ./svg --out-dir ./src/react",
删除 src/react，用 svgr 把 ./svg 里的图标转为 React 组件，输出到 src/react。
✅ 这样就可以在 React 里直接 <Icon /> 使用图标。

"build:svg": "rimraf svg && node ./scripts/exportSVG.js",
删除 svg 目录，运行自定义脚本 exportSVG.js 来导出/生成 SVG 图标。

"clean": "rimraf lib es coverage svg",
删除 lib、es、coverage、svg 目录。

"coverage": "rimraf coverage && yarn test -c",
删除旧的coverage，然后运行测试并生成覆盖率（-c 可能是传给 zarm test 的 coverage 参数）。

"test": "zarm test -s scripts/jest/setup.js"
使用 zarm test（运行测试，加载 scripts/jest/setup.js 作为初始化配置。

"exports": {
  ".": {
    "import": "./es/index.js",
    "default": "./lib/index.js"
  },
  "./style": {
    "import": "./es/style/index.scss",
    "default": "./lib/style/index.scss"
  },
  "./style/font": {
    "import": "./es/font/style/icon.scss",
    "default": "./lib/font/style/icon.scss"
  }
}

"." 👉 指向包的根导出，也就是 import xxx from "package-name"。
import 用于支持 ESModule (走 es/index.js)。
default 用于 CommonJS (走 lib/index.js)。
"./style" 👉 允许用户直接 import "package-name/style"，会映射到打包后的样式入口。
"./style/font" 👉 允许用户 import "package-name/style/font" 来单独引入字体样式。
这能避免用户随意从内部目录深层导入 (package-name/es/xxx)，保证对外 API 清晰、稳定。

"main": "lib/index.js",
"module": "es/index.js",
"typings": "lib/index.d.ts",

"main": "lib/index.js" 👉 CommonJS 入口（历史上 npm 的默认入口）。
"module": "es/index.js" 👉 ESM 入口（Webpack/Rollup 等工具优先走这里）。
"typings": "lib/index.d.ts" 👉 TypeScript 类型声明文件的入口。

"files": [
  "es",
  "lib",
  "types"
],
表示发布到 npm 时，只有 es/, lib/, types/ 目录会被包含进去。其余开发文件（如 scripts/、tests/）不会被发到 npm。

