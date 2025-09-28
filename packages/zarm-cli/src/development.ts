import execa from 'execa'; // 这个模块用于执行外部命令，并返回一个 promise，可以异步执行任务。
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'; // 用于 TypeScript 检查，在 Webpack 构建时异步检查 TypeScript 文件的类型，不会阻塞构建过程。
import fs from 'fs';
import webpack, { Configuration } from 'webpack';
import WebpackDevServer, { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import getWebpackConfig from './config/webpackConfig';
import { getProjectConfig } from './deploy';
import { getProjectPath } from './utils';

export interface IDevelopmentConfig {
  mode?: 'native';
  host: string;
  port: number;
}

export default async ({ mode, host, port }: IDevelopmentConfig) => {
  if (mode === 'native') {
    const args = [
      require.resolve('@babel/cli/bin/babel'), // 使用 Babel CLI 进行 React Native 编译
      'components', // 要编译的目录
      '-d',
      'rnkit/zarm', // 输出目录
      '-w', // 监听文件变更
      '--extensions',
      '.ts,.tsx', // 支持的文件扩展名
      '--config-file',
      require.resolve('./config/babelConfig/base'), // 指定 Babel 配置文件
    ];

    const { stderr, exitCode } = await execa('node', args); // 执行命令

    if (exitCode !== 0) {
      process.stderr.write(stderr); // 如果出错，输出错误信息
      process.exit(0); // 退出进程
    }
    return; // 如果是 React Native 模式，结束当前函数，不继续执行 Webpack DevServer 部分
  }

  const config: Configuration = getProjectConfig(getWebpackConfig('dev')); // 获取 Webpack 开发模式配置

  if (fs.existsSync(getProjectPath('tsconfig.json'))) {
    // 如果项目中存在 TypeScript 配置文件
    config.plugins.push(new ForkTsCheckerWebpackPlugin()); // 添加 TypeScript 检查插件
  }

  const compiler = webpack(config); // 创建 Webpack 编译器
  const serverConfig: DevServerConfiguration = {
    compress: true, // 启用压缩
    hot: true,
    port,
    host,
    client: {
      logging: 'error', // 只显示错误日志
      overlay: {
        errors: true, // 显示错误覆盖层
        warnings: false, // 不显示警告覆盖层
      },
    },
  };

  const devServer = new WebpackDevServer(serverConfig, compiler); // 启动开发服务器
  devServer.start();

  // 监听 SIGINT（Ctrl+C）和 SIGTERM 信号（终止信号），当接收到这些信号时，关闭开发服务器并退出进程。
  ['SIGINT', 'SIGTERM'].forEach((sig: any) => {
    process.on(sig, () => {
      devServer.close(); // 关闭开发服务器
      process.exit(); // 退出进程
    });
  });
};
