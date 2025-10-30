/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import commander from 'commander';
import path from 'path';
import build from './build';
import deploy from './deploy';
import development from './development';
import template from './template';
import test from './test';

const { version } = require(path.resolve('./package.json'));

commander.version(version);

// zarm build --mode es --path src --out-dir es --copy-files --build-css,
// zarm build --mode lib --path src --out-dir lib --copy-files --build-css",
// zarm build --mode umd --path src/style/entry.ts,src/index.ts --out-dir dist --library-name zarm 
// zarm build --mode umd-ugly --path src/style/entry.ts,src/index.ts --out-dir dist --library-name zarm",

commander
  .command('build')
  .description('打包编译仓库')
  .option('-m, --mode <es|lib|umd|umd-ugly|native>', '选择打包模式')
  .option('-p, --path <path>', '源文件目录')
  .option('-o, --out-file <path>', '输出文件')
  .option('-d, --out-dir <path>', '输出目录')
  // .option('-z, --out-zip <path>', '输出zip压缩包存放目录')
  .option('-e, --ext <ext>', '要匹配的文件格式', '.ts,.tsx')
  .option('-l, --library-name <libraryName>', '包名')
  .option('-c, --copy-files', '拷贝不参与编译的文件')
  .option('-a, --analyzer', '是否启用分析器')
  .option('--build-css', '是否编译组件样式')
  .action(build);

commander
  .command('dev')
  .description('运行开发环境')
  .option('-m, --mode <mode>', '编译模式')
  .option('-h, --host <host>', '站点主机地址', '0.0.0.0')
  .option('-p, --port <port>', '站点端口号', '3000')
  .action(development);

commander
  .command('deploy')
  .description('部署官网站点')
  .option('-p, --push-gh', '是否发布至gh-pages')
  .option('-d, --out-dir <path>', '输出目录', 'assets')
  .option('-a, --analyzer', '是否启用分析器')
  .action(deploy);

commander
  .command('test')
  .description('执行单元测试脚本')
  .option('-m, --mode <mode>', '编译模式')
  .option('-u, --update-snapshot', '是否更新快照')
  .option('-c, --coverage', '是否生成覆盖率报告')
  .option('-s, --setupFilesAfterEnv <file>', '测试前装载的脚本文件')
  .option(
    '-o, --onlyChanged',
    '试图根据当前存储库中更改的文件确定要运行哪些测试。只有当你在git/hg存储库中运行测试，并且需要静态依赖关系图时才有效',
  )
  .action(test);

commander
  .command('add')
  .description('新增组件模板')
  .action(() => template({ compName: commander.args[1] }));

// 比如，如果你运行 node your-script.js build --mode es，process.argv 会是类似 ['node', 'your-script.js', 'build', '--mode', 'es'] 这样的数组。
commander.parse(process.argv);

// 例如，如果运行 node your-script.js build --mode es，那么 commander.args[0] 的值就是 build。
if (!commander.args[0]) {
  commander.help();
}

// node your-script.js build --mode es --path src --out-file dist/bundle.js --library-name my-library --build-css --analyzer
// build：执行编译命令。
// --mode es：选择 es 模式进行打包。
// --path src：源文件目录是 src。
// --out-file dist/bundle.js：输出的文件路径是 dist/bundle.js。
// --library-name my-library：包名为 my-library。
// --build-css：同时编译组件样式。
// --analyzer：启用打包分析器，查看打包结果。

// node your-script.js dev --mode development --host 127.0.0.1 --port 4000
// dev：执行开发环境命令。
// --mode development：选择开发模式进行编译。
// --host 127.0.0.1：开发服务器主机地址为 127.0.0.1。
// --port 4000：开发服务器端口号为 4000。

// node your-script.js deploy --push-gh --out-dir dist --analyzer
// deploy：执行部署命令。
// --push-gh：将生成的文件推送到 GitHub Pages。
// --out-dir dist：部署文件输出目录为 dist。
// --analyzer：启用分析器。

// node your-script.js test --mode unit --update-snapshot --coverage
// test：执行测试命令。
// --mode unit：选择单元测试模式。
// --update-snapshot：更新快照文件。
// --coverage：生成代码覆盖率报告。

// node your-script.js add MyNewComponent
// add：添加新组件模板。
// MyNewComponent：传递组件名称，工具会基于该名称创建一个新的组件模板。

// node your-script.js --help  如果你忘记了命令或参数，可以通过以下命令查看帮助信息：

// node your-script.js build --help 这些命令会根据你在 commander 配置中的选项和逻辑进行相应的操作，例如编译文件、启动开发服务器、部署到服务器或执行测试等。
