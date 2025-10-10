#!/bin/bash
# → 声明使用 Bash 解释器
set -e
# → 一旦出现任何错误，脚本立即退出

if [[ -z $1 ]]; then
  echo "Enter new version: "
  read -r VERSION
else
  VERSION=$1
fi
# 如果运行脚本时没有传入版本号参数 $1，就让用户输入
# 否则使用 $1 作为版本号

read -p "Releasing $VERSION - are you sure? (y/n) " -n 1 -r  # 提示用户输入一个字符y/n
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then  #  判断用户是否输入 y 或 Y
  echo "Releasing $VERSION ..." # 只有确认 y 才会继续执行发布

  if [[ -z $SKIP_TESTS ]]; then # 如果环境变量 SKIP_TESTS 没有设置，执行：
    npm run lint   # 代码检查
    npm run test  # 单元测试
  fi

  # build
  VERSION=$VERSION npm run build  # 设置环境变量 VERSION 给构建脚本使用 执行 npm run build 构建项目

  # commit
  git add -A    # 将修改的文件全部添加
  git commit -m "build: build $VERSION"  # 提交一个带版本号的 commit

  # 这些是 npm 官方推荐的版本管理方式，但脚本作者使用了自定义标签 zarm@
  # tag version
  # npm version "$VERSION" --message "build: release $VERSION"

  # publish
  # git push origin refs/tags/v"$VERSION"
  # Git 打标签并推送
  git tag zarm@"$VERSION"   # 打一个带前缀 zarm@ 的 git 标签
  git push origin zarm@"$VERSION"  # 推送标签和 master 分支到远程仓库
  git push origin master


  #根据版本号判断是：
  #alpha 版本 → npm publish --tag alpha
  #beta 版本 → npm publish --tag beta
  #rc 版本 → npm publish --tag rc
  #正式版本 → 默认发布到 latest
  #这样可以在 npm 上区分测试版本和正式版本

  if [[ $VERSION =~ "alpha" ]]
  then
    npm publish --tag alpha
  elif [[ $VERSION =~ "beta" ]]
  then
    npm publish --tag beta
  elif [[ $VERSION =~ "rc" ]]
  then
    npm publish --tag rc
  else
    npm publish
  fi
fi