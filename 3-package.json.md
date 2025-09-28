<!--
"workspaces": [
  "packages/*"
]
-->

workspaces 字段告诉包管理器（Yarn ≥1.0 或 npm ≥7.0）：
这个项目是一个 Monorepo（多包仓库）。
在 packages/ 目录下的每一个子文件夹（比如 packages/app、packages/ui、packages/utils 等）都被视为一个独立的 package。

<!--
"commitlint": {
  "extends": [
    "@commitlint/config-conventional"
  ]
} -->

作用：用于校验 Git 提交信息是否符合规范。
这里扩展了 @commitlint/config-conventional，也就是 Angular 风格的提交规范（常见的 feat, fix, docs, refactor, chore, 等）。
这样可以保证你的提交信息一致、清晰，便于自动生成 changelog。

<!--
"lint-staged": {
  "*.{js,jsx,ts,tsx,html,md,json}": [
    "prettier --write --no-error-on-unmatched-pattern"
  ],
  "*.scss": [
    "stylelint --syntax scss"
  ]
} -->

作用：在 git commit 时，自动对 暂存区的文件（即将提交的文件）执行代码格式化或检查。
配置解读：
_.{js,jsx,ts,tsx,html,md,json} → 使用 Prettier 来统一代码格式，自动修复。
--no-error-on-unmatched-pattern 是为了避免没有匹配文件时报错。
_.scss → 使用 Stylelint 来检查 SCSS 语法规范。
这样可以保证你提交前的代码都符合统一的格式和样式规范。

<!--
"resolutions": {
  "@types/react": "18.0.26",
  "@types/react-dom": "18.0.9"
} -->

作用：这是 Yarn（特别是 v1）的字段，用来 强制指定依赖包的版本。
在这里，你强制锁定了 @types/react 和 @types/react-dom 的版本，避免因为依赖链里安装了不同版本导致 类型冲突（TS 项目里常见问题）。

"build": "lerna exec --scope zarm -- yarn build"
lerna exec 会在指定包里执行命令。
--scope zarm 表示只在 zarm 这个包里执行命令。
-- yarn build 是要执行的具体命令，通常会打包 zarm 包。
✅ 总结：只构建 zarm 包。

"clean": "lerna run clean && lerna clean -y"
lerna run clean：在所有包里执行各自 package.json 中的 clean 脚本。
lerna clean -y：删除所有包的 node_modules，-y 是自动确认。
✅ 总结：先执行每个包自定义的清理命令，然后彻底删除依赖。

"deploy": "lerna exec --scope site -- gh-pages -d assets"
--scope site：只针对 site 包执行命令。
-- gh-pages -d assets：将 site/assets 目录的内容发布到 GitHub Pages。
✅ 总结：把 site 包里的静态资源发布到 GitHub Pages。

"deploy:build": "lerna exec --scope site -- yarn build"
类似 "build"，只是针对 site 包，执行它自己的 yarn build。
✅ 总结：构建 site 包，为部署做准备。

"postinstall": "lerna exec --scope @zarm-design/cli -- yarn build && lerna exec --scope @zarm-design/bem -- yarn build && lerna exec --scope @zarm-design/icons -- yarn build"
✅ 总结：分别对三个包 @zarm-design/cli、@zarm-design/bem、@zarm-design/icons 执行 yarn build。

"lint": "yarn install && yarn lint:tsc && yarn lint:script && yarn lint:style",
✅ 总结：一次性检查整个项目的代码、类型和样式。

"lint:script": "eslint --ext .ts,.tsx,.js,.jsx packages",
✅ 总结：用 ESLint 检查 packages 目录下的 .ts/.tsx/.js/.jsx 文件。

"lint:style": "stylelint \"packages/\*_/_.scss\" --syntax scss",
✅ 总结：用 Stylelint 检查所有 SCSS 文件，保证样式规范。

"lint:tsc": "tsc --noEmit",
✅ 总结：TypeScript 类型检查，但不生成输出文件。

"prepublishOnly": "yarn lint && yarn build && yarn test",
发布前必执行的脚本：先 lint、再 build、最后执行 test
✅ 总结：保证代码质量和构建成功再发布。

"prettier": "prettier --write -c '\*_/_.{js,jsx,ts,tsx,html,md,json}'",
✅ 总结：格式化项目中 JS/TS/HTML/MD/JSON 文件。

"release": "lerna publish",
✅ 总结：使用 Lerna 发布所有包（会处理版本、tag 和 npm 发布）。

"sort": "npx sort-package-json \"package.json\" \"packages/\*/package.json\"",
✅ 总结：自动整理主项目和子包的 package.json，保持顺序规范。

"lerna exec --no-private -- yarn test"
--no-private
有些包在 package.json 里有 "private": true，表示这是私有包，不会被发布到 npm。
--no-private 表示 跳过这些私有包，只对可发布的包执行命令。
每个包自身的测试命令，通常在它自己的 package.json 里定义。
Lerna 会在每个非私有包目录里执行这个命令。
✅ 总结：在所有非私有包里执行各自的 yarn test。
