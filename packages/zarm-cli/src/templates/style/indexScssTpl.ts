// import { paramCase } from 'change-case';
// const componentName = 'MyComponent';
// const className = paramCase(componentName);  // 结果是 'my-component'

import { paramCase } from 'change-case';

export default (compName) => `@import '../../style/core/index';

@include b(${paramCase(compName)}) {

}
`;

// 这段代码实际上是调用了一个名为 b 的 SCSS 混入，并且把 my-component 传给它，
// 通常 b 会做一些与 BEM 相关的样式处理（如生成 my-component 类及其修饰符等）。
