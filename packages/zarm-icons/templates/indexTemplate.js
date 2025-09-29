// 这个是一个用于自动生成 index.js 文件的 JavaScript 函数，通常用于批量导出某个目录下的文件。

const path = require('path');

function defaultIndexTemplate(filePaths) {
  const exportEntries = filePaths.map((filePath) => {
    const basename = path.basename(filePath, path.extname(filePath)); //  获取文件名（不包括扩展名）。
    const exportName = /^\d/.test(basename) ? `Svg${basename}` : basename; //  检查文件名是否以数字开头。如果是，它会在文件名前加上 Svg，避免 JavaScript 中的标识符不能以数字开头的问题
    return `export { default as ${exportName} } from './${basename}';`;
  });
  return exportEntries.join('\n');
}

module.exports = defaultIndexTemplate;

// 假设文件夹中有以下文件：
// 1-icon.svg
// icon2.svg
// icon3.svg
// 如果你调用 defaultIndexTemplate，传入这三个文件的路径，它会生成如下的导出语句：
// export { default as Svg1-icon } from './1-icon';
// export { default as icon2 } from './icon2';
// export { default as icon3 } from './icon3';
