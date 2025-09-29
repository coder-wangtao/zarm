function defaultTemplate({ template }, opts, { imports, componentName, jsx, exports }) {
  // { template }: 这里传入的 template 是 Babel 的模板工具，通常用于生成 AST（抽象语法树），它可以通过模板字面量生成代码。
  // 这个是非常常见的工具，尤其在生成代码时需要动态插入变量的地方。
  // opts: 这个是配置选项，其中 opts.typescript 判断是否使用 TypeScript。如果是 true，会加入 TypeScript 支持的插件。

  const plugins = ['jsx'];
  if (opts.typescript) {
    plugins.push('typescript');
  }
  const typeScriptTpl = template.smart({ plugins });
  return typeScriptTpl.ast`${imports}
import Icon from '../icon';
import type { IconProps } from '../icon';

const ${componentName} = (props: IconProps, svgRef?: React.Ref<SVGSVGElement>) => {
  const newProps = {
    ...props,
    name: '${componentName.name}'
  }
  return React.createElement(Icon, { ...newProps, component: () => ${jsx}});
}

${exports}
  `;
}
module.exports = defaultTemplate;

// 这个模板函数生成一个 React 组件，通常用于生成 SVG 图标组件。它将图标的 JSX 作为 Icon 组件的 component 属性传递，并且支持 TypeScript 类型定义。

// 假设你有如下数据：
// componentName = 'HomeIcon'
// imports = 'import React from "react";'
// jsx = '<svg>...</svg>'
// exports = 'export default HomeIcon;'
// 生成的代码会是：
// import React from "react";
// import Icon from '../icon';
// import type { IconProps } from '../icon';

// const HomeIcon = (props: IconProps, svgRef?: React.Ref<SVGSVGElement>) => {
//   const newProps = {
//     ...props,
//     name: 'HomeIcon'
//   }
//   return React.createElement(Icon, { ...newProps, component: () => <svg>...</svg> });
// }

// export default HomeIcon;
