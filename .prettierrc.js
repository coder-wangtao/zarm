module.exports = {
  singleQuote: true, // singleQuote: true使用单引号 ' 而不是双引号 "。例如：const name = 'Mark'; 而不是 "Mark"。
  trailingComma: 'all', // 在对象、数组、函数参数等末尾都加上逗号（trailing comma）。方便 Git diff 清晰，并减少行尾修改时的冲突。
  printWidth: 100, //printWidth: 100。每行最大长度 100 个字符，超过就换行。方便保持代码整洁，避免水平滚动条。
  // 针对特定文件做特殊处理。这里指定 .prettierrc 文件用 json 解析器，而不是默认的 babel 或 typescript，保证 .prettierrc 格式正确。
  overrides: [{ files: '.prettierrc', options: { parser: 'json' } }],

  // prettier-plugin-packagejson：自动格式化 package.json 文件，比如排序字段、保持统一风格。
  // prettier-plugin-organize-imports：自动整理 import 语句顺序（类似 TypeScript 的 organizeImports 功能）。
  plugins: [
    require.resolve('prettier-plugin-packagejson'),
    require.resolve('prettier-plugin-organize-imports'),
  ],
};
