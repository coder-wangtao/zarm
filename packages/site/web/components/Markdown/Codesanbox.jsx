// 一个 Zarm 组件在线预览生成工具函数，用于将组件示例代码打包成一个可以直接在 CodeSandbox 或本地运行的环境

import pkg from '@zarmDir/package.json';
import { pascalCase } from 'change-case';
import { getParameters } from 'codesandbox/lib/api/define';

export default ({ code, component, preview, formatMessage }) => {
  // code：示例组件的源码字符串（通常是 demo 里的 JSX 代码）
  // component：组件信息对象，如 { name: 'Button', key: 'button', style: true }
  // preview：预览 HTML 片段（React 渲染后的 demo 预览）
  // formatMessage：国际化函数（i18n），用于按钮的提示文字
  const title = `${component.name} ${pascalCase(component.key)} - Zarm Design`;
  const pageCls = `${component.key}-page`;

  let parsedSourceCode = code;
  let importReactContent = "import React from 'react';";
  const importReactReg = /import(\D*)from 'react';/; // 代码会先找到并提取 import React from 'react'; 这一行。
  // 然后把它从源码中移除（因为稍后会手动注入）。
  const matchImportReact = parsedSourceCode.match(importReactReg);
  if (matchImportReact) {
    [importReactContent] = matchImportReact;
    parsedSourceCode = parsedSourceCode.replace(importReactReg, '').trim();
  }

  parsedSourceCode = parsedSourceCode.replace('mountNode', "document.getElementById('container')");

  const indexJsContent = `
${importReactContent}
import ReactDOM from 'react-dom';
import 'zarm/dist/zarm.css';
import './index.css';
${parsedSourceCode}
`.trim();

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
  </head>
  <body>
    <div class="${pageCls}" id="container" style="padding: 24px" />
  </body>
</html>`;

  const config = {
    files: {
      'package.json': {
        content: {
          title,
          main: 'index.js',
          dependencies: {
            zarm: pkg.version,
            react: '^18',
            'react-dom': '^18',
            'react-scripts': '^5.0.0',
          },
          devDependencies: {
            typescript: '^4.0.5',
          },
          scripts: {
            start: 'react-scripts start',
            build: 'react-scripts build',
            test: 'react-scripts test --env=jsdom',
            eject: 'react-scripts eject',
          },
        },
      },
      'index.css': { content: '' },
      'index.js': { content: indexJsContent },
      'index.html': { content: htmlContent },
    },
  };

  if (component.style) {
    // 把每个组件对应的 SCSS 文件加载成纯文本内容，然后放到 index.css 中，让预览环境使用。
    config.files['index.css'] = {
      // !!：表示忽略 Webpack 配置中默认 loader，只用指定的 loader。
      // sass-loader：把 SCSS 编译成 CSS。
      // raw-loader：把编译后的 CSS 以字符串形式导入。
      // 所以最终得到的是一个 字符串 CSS。
      // eslint-disable-next-line import/no-dynamic-require
      content: require(`!!raw-loader!sass-loader!@/demo/styles/${pascalCase(
        component.key,
      )}Page.scss`).default,
    };
  }

  const params = getParameters(config);
  const uniqueId = `clipboard-${Math.random().toString(36).substring(4)}`;
  return `<div class="code-preview">
    <div class="actions">
      <form
        action="https://codesandbox.io/api/v1/sandboxes/define"
        method="POST"
        target="_blank"
      >
        <input type="hidden" name="parameters" value="${params}" />
        <button class="za-button za-button--sm za-button--radius za-button--link" type="submit" title="${formatMessage(
          { id: 'app.components.preview.action.codesandbox' },
        )}">
          <i class="za-icon za-icon--sm">
            <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1000 1000">
              <use xlink:href="#codesandbox"></use>
            </svg>
          </i>
        </button>
      </form>
      <textarea class="clipboard-content ${uniqueId}">${code}</textarea>
      <button class="za-button za-button--sm za-button--radius za-button--link clipboard-code" data-clipboard-target=".${uniqueId}" title="${formatMessage(
    { id: 'app.components.preview.action.copy' },
  )}"">
        <i class="za-icon za-icon--sm">
          <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1000 1000">
            <use xlink:href="#copy"></use>
          </svg>
        </i>
      </button>
    </div>
    ${preview}
  </div>`;
};
