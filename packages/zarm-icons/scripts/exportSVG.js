// 这段代码的目的是从一个 .sketch 文件中提取 SVG 图标，并将其保存到一个指定的目录中。它利用了 sketchtool 工具，
// 这个工具是 Sketch 官方提供的命令行工具，用于处理和操作 Sketch 文件。

const path = require('path');
const shell = require('shelljs'); // 这是一个用于在 Node.js 中执行 shell 命令的库。在这里，它用于执行 sketchtool 命令。

const svgDir = path.join(__dirname, '../svg');
const sketch = path.join(__dirname, '../assets/icons.sketch');
const SKETCH_TOOL_DIR = '/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool';

// extract svg from sketch
// check if already install sketchtool path: /Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool
// if not install, should install sketchtool first
// install guide: https://developer.sketchapp.com/guides/sketchtool/
shell.exec(
  `${SKETCH_TOOL_DIR} export slices --formats=svg --overwriting=YES --save-for-web=YES --output=${svgDir} ${sketch}`,
);

// export slices：导出 Sketch 文件中的切片（slices）。
// --formats=svg：指定导出的格式为 SVG。
// --overwriting=YES：如果文件已经存在，则覆盖。
// --save-for-web=YES：优化导出的 SVG 图标以便用于网页。
// --output=${svgDir}：指定导出的文件保存目录为 svgDir，即 ../svg。
// ${sketch}：指定源文件路径，即 ../assets/icons.sketch。
