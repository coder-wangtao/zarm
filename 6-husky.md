#!/usr/bin/env sh  
指定用 sh 来执行脚本。
. "$(dirname -- "$0")/_/husky.sh" 
.（点号）表示 加载另一个脚本（相当于 bash 的 source）。
$(dirname -- "$0") 获取当前脚本所在的目录。
_/husky.sh 是 Husky 内部的初始化脚本，用来设置环境。
npx commitlint --edit "${1}"
用 npx 执行 commitlint（优先使用项目本地依赖里的版本）。
--edit "${1}" 表示检查 Git 传入的 提交信息文件，来验证 commit message 是否符合规范。

#!/usr/bin/env sh  
指定用 sh 来执行脚本。
. "$(dirname -- "$0")/_/husky.sh" 
.（点号）表示 加载另一个脚本（相当于 bash 的 source）。
$(dirname -- "$0") 获取当前脚本所在的目录。
_/husky.sh 是 Husky 内部的初始化脚本，用来设置环境。
npx lint-staged
执行 lint-staged，它会在 Git 暂存区文件（staged files） 上运行你配置好的代码检查或格式化任务。
常见的用法就是在提交代码之前，自动跑 eslint、prettier 等工具，保证提交的代码质量。
这是一个 pre-commit hook（通常文件名是 .husky/pre-commit）。
执行 git commit 时，Husky 会触发这个脚本 → 脚本调用 lint-staged → lint-staged 会根据你的配置检查和修复代码。
如果有错误（例如 ESLint 不通过），提交会被阻止。