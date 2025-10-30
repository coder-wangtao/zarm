// tsc --build --force
// tsc → 启动 TypeScript 编译器
// --build → 构建整个项目，按依赖顺序增量编译
// --force → 即使没有变化，也重新编译，保证输出干净

// 1.umd webpack 打包
// 用的插件是：
// BannerPlugin
// BundleAnalyzerPlugin
// MiniCssExtractPlugin 处理css

//webpack 打包
webpack(config).run((err, stats) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(
    stats.toString({
      chunks: false, // 不显示每个 chunk 的详细信息
      colors: true, // 启用颜色
    }),
  );
});

//webpack 配置
//还有各种loader处理(js|jsx|ts|tsx):babel-loader;
//(css|scss):css-loader\postcss-loader\sass-loader;
//(png|jpe?g|gif|webp|svg|ico):asset/resource;
//(woff|woff2|ttf|eot):asset/resource
{
  mode: 'development', // 设置为开发模式
  devtool: 'hidden-source-map', // 使用隐藏的 source map
  output: {
    libraryTarget: 'umd', // 配置输出为 UMD 模块（可以在多种环境下使用：AMD、CommonJS、以及全局变量）
    filename: '[name].js', // 输出文件名使用入口名称
  },
  externals: {
    react: {
      root: 'React', // 在全局环境中通过 `React` 变量访问 React
      commonjs2: 'react', // 如果使用 CommonJS2 模块系统，导入 `react`
      commonjs: 'react', // 如果使用 CommonJS 模块系统，导入 `react`
      amd: 'react', // 如果使用 AMD 模块系统，导入 `react`
    },
    'react-dom': {
      root: 'ReactDOM', // 在全局环境中通过 `ReactDOM` 变量访问 ReactDOM
      commonjs2: 'react-dom', // 使用 CommonJS2 模块系统导入 `react-dom`
      commonjs: 'react-dom', // 使用 CommonJS 模块系统导入 `react-dom`
      amd: 'react-dom', // 使用 AMD 模块系统导入 `react-dom`
    },
  },
}

// 打包成 dm.js、dm.css
