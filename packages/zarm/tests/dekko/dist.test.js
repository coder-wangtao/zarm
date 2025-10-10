// dekko 是一个用于检查文件系统中文件和目录的工具，它提供了一些简洁的 API 来验证文件和目录的结构。
// chalk 是一个用于在控制台输出带有颜色和样式文本的库。这里用于输出带有绿色的成功消息。

const dekko = require('dekko');
const chalk = require('chalk');

dekko('dist')
  .isDirectory()
  .hasFile('zarm.css')
  .hasFile('zarm.min.css')
  .hasFile('zarm.js')
  .hasFile('zarm.min.js');

// eslint-disable-next-line no-console
console.log(chalk.green('✨ `dist` directory is valid.'));

// dekko('dist'): 检查 dist 目录，确保这个目录存在。
// .isDirectory(): 确保 dist 是一个目录。
// .hasFile('zarm.css'), .hasFile('zarm.min.css'), .hasFile('zarm.js'), .hasFile('zarm.min.js'):
// 检查 dist 目录中是否包含指定的文件（zarm.css, zarm.min.css, zarm.js, 和 zarm.min.js）。
// 这些检查确保在 dist 目录下存在这些文件，以验证构建输出是否符合预期。
