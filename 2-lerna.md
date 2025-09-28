<!--
{
  "workspaces": ["packages/*"],           // 配置 Lerna 与 Yarn Workspaces 配合。"packages/*" 表示 packages/ 下的每个子目录都是一个独立子包。
  "version": "independent",               // 独立版本模式，每个包单独维护版本号，发布时，Lerna 会根据各自改动更新对应版本，而不是统一版本号。
  "command": {
    "publish": {
      "conventionalCommits": false,      //不使用自动生成的版本号策略（如果为 true，会根据 commit message 自动计算版本号）。
      "message": "chore(release): publish new version" // 发布时的 git commit 信息
    }
  },
  "npmClient": "yarn"                     // 使用 Yarn 作为包管理器
}
-->

当提交信息是： chore(release): publish new version 触发更新发包

// 多包管理 + TypeScript + React + Lerna + Yarn Workspaces
