module.exports = {
  // 继承 za/react 的 React 相关 ESLint 规范（ZA 团队内部的规范）。prettier 插件用于关闭与 Prettier 冲突的 ESLint 规则。
  extends: ['za/react', 'prettier'],
  parserOptions: {
    // 使用 Babel 解析器，并启用对 class properties 的支持（允许在类中直接定义属性）。
    babelOptions: {
      plugins: ['@babel/plugin-proposal-class-properties'],
    },
  },
  // ESLint 环境配置，允许使用 Jest 的全局变量（如 describe, it, expect）。
  env: {
    jest: true,
  },
  // 覆盖 .ts / .tsx 文件的规则，避免一些 TS + React 项目中不必要的报错。
  overrides: [
    {
      rules: {
        // 检查 React Hooks（useEffect、useCallback 等）的依赖数组是否完整。设置为 0：禁用检查。
        // ✅ 作用：开发者可以自行管理依赖数组，不会因为缺少依赖被 ESLint 报错。
        'react-hooks/exhaustive-deps': 0,  
        // 要求 React 组件类的方法按特定顺序排列（比如生命周期方法、render、事件处理函数等）。设置为 0：禁用方法排序要求。
        // ✅ 作用：方法顺序自由，不受规范限制。
        'react/sort-comp': 0,
        // 强制在使用 props 或 state 时必须解构赋值。置为 0：可以直接使用 this.props.something 或 props.something，不必解构。
        //✅ 作用：灵活使用 props/state，减少 ESLint 报错。
        'react/destructuring-assignment': 0,
        // 原规则：模块只导出一个成员时，建议使用 export default。设置为 0：允许单个命名导出，不强制 default export。
        //✅ 作用：开发者可保持命名导出一致风格，尤其在 TS 项目中常用。
        'import/prefer-default-export': 0,
        // 原规则：要求 TypeScript 类型断言风格一致（as Type vs <Type>）。设置为 0：允许多种写法混用
        // ✅ 作用：灵活处理类型断言，不受规则限制。
        '@typescript-eslint/consistent-type-assertions': 0,
      },
      files: ['*.ts', '*.tsx'],
      extends: ['za/typescript-react', 'prettier'],
    },
  ],
};
