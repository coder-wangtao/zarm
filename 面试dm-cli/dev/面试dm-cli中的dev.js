const config = {
  mode: 'development', // 设置为开发模式
  devtool: 'cheap-module-source-map', // 使用便宜的 source map，适合开发时调试
  optimization: {
    minimize: false, // 不进行代码压缩，便于开发时调试
  },
  plugins: [
    // 用于 TypeScript 检查，在 Webpack 构建时异步检查 TypeScript 文件的类型，不会阻塞构建过程。
    new ForkTsCheckerWebpackPlugin(),
  ],
  cache: {
    type: 'filesystem', // 使用文件系统缓存，加速构建过程
    name: 'zarm-dev', // 缓存名称
    buildDependencies: {
      config: [__filename], // 如果配置文件发生变化，则重新构建// __filename是一个全局变量，用于获取当前执行脚本的完整文件路径
    },
    store: 'pack', // 存储缓存的位置
  },
};

const compiler = webpack(config); // 创建 Webpack 编译器
const devServerConfig = {
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

const devServer = new WebpackDevServer(devServerConfig, compiler); // 启动开发服务器
devServer.start();

// 监听 SIGINT（Ctrl+C）和 SIGTERM 信号（终止信号），当接收到这些信号时，关闭开发服务器并退出进程。
['SIGINT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, () => {
    devServer.close(); // 关闭开发服务器
    process.exit(); // 退出进程
  });
});

// 根据配置传入webpack函数生成compiler,定义devServerConfig配置项,创建WebpackDevServer实例传入devServerConfig和compiler并启动开发服务器

