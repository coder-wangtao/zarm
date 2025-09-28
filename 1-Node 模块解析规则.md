Node 模块解析规则
Node.js 使用了一套特定的算法来解析模块路径，这套算法包括以下几点：
(1).文件扩展名：
Node.js 会尝试不同的文件扩展名（如 .js, .json, .node），如果省略了文件扩展名的话。
(2).文件名：
如果没有提供具体的文件名，Node.js 会首先查找名为 index 的文件作为默认入口点（例如，./foo 会查找 ./foo/index.js）。
(3).目录结构：
支持从 node_modules 文件夹中解析模块。对于相对或绝对路径的模块请求，Node.js 会在当前目录及其父目录下的 node_modules 文件夹中搜索模块。
(4).package.json 中的主字段：
如果模块是一个包，并且该包的根目录包含一个 package.json 文件，那么 Node.js 会检查 main 字段以确定包的入口文件。
(5).嵌套的 node_modules：
Node.js 还支持在任何级别的子目录中查找 node_modules 文件夹，这允许你创建复杂的依赖关系图。
