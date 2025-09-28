import chalk from 'chalk';
import { paramCase } from 'change-case';
import fs from 'fs'; // fs：用于文件操作，读写文件。
import { sync } from 'mkdirp'; // mkdirp：用于递归创建文件夹。sync 是同步的版本，确保文件夹创建成功。
import path from 'path'; // path：用于处理和解析文件路径。
import signale from 'signale'; // 用于控制台日志输出
import { component, style, test } from './templates';

export interface ITemplateConfig {
  compName: string;
}

const write = (dir: string, code: string) => {
  fs.writeSync(fs.openSync(dir, 'w'), code); // 将代码写入文件
};

export default ({ compName }: ITemplateConfig) => {
  const rootDir = `src/${paramCase(compName)}`; // 根据组件名生成组件目录路径
  const folder = {
    component: rootDir,
    style: `${rootDir}/style`,
    test: `${rootDir}/__tests__`,
  };

  const pages = {
    component: [
      { name: 'index.ts', module: component.indexTpl(compName) },
      { name: 'interface.ts', module: component.interfaceTpl(compName) },
      { name: 'demo.md', module: component.demoTpl(compName) },
      { name: `${compName}.tsx`, module: component.compTpl(compName) },
    ],
    style: [
      { name: 'index.ts', module: style.indexTpl() },
      { name: 'index.scss', module: style.indexScssTpl(compName) },
    ],
    test: [{ name: 'index.test.tsx', module: test.indexTpl(compName) }],
  };

  Object.keys(pages).forEach((key) => {
    sync(folder[key]);
    pages[key].forEach((page) => {
      write(path.resolve(`./${folder[key]}`, page.name), page.module);
      console.info(`   ${chalk.green('create')} ${folder[key]}/${page.name}`);
    });
  });
  signale.success('create component templates successfully!!');
};


// 传入 Button
// src/button/
//   ├── index.ts
//   ├── interface.ts
//   ├── demo.md
//   ├── Button.tsx
//   ├── style/
//   │    ├── index.ts
//   │    └── index.scss
//   └── __tests__/
//        └── index.test.tsx