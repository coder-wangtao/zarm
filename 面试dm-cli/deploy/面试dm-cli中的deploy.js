const config = {
  mode: 'production', // 设置为生产模式
  devtool: 'hidden-source-map', // 使用隐藏的 source map，有助于生产环境调试，但不暴露源代码
  output: {
    filename: 'js/[name].js', // 输出文件名格式：[name] 表示入口文件的名称
    chunkFilename: 'js/[name].[chunkhash:8].js', // 对于代码拆分后的文件，使用 chunkhash:8 来生成 8 位长的 hash 值
    publicPath: './', // 设置公共路径为当前路径，这样静态资源可以从当前目录加载
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // 代码分割配置，分割所有模块（包括异步和同步）
    },
    runtimeChunk: {
      name: 'manifest', // 将运行时代码（manifest）提取到单独的文件中
    },
  },
  module: {
    // webpack 配置
    // 还有各种loader处理(js|jsx|ts|tsx):babel-loader;
    // (css|scss):css-loader\postcss-loader\sass-loader;
    // (png|jpe?g|gif|webp|svg|ico):asset/resource;
    // (woff|woff2|ttf|eot):asset/resource
  },
  plugins: [
    // WebpackBar：显示打包进度条。
    new WebpackBar({}),
    // ProvidePlugin：在代码里用 process 时自动引入 process/browser，解决浏览器环境下 process 不存在的问题。
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new MiniCssExtractPlugin({
      filename: 'stylesheet/[name].[contenthash:8].css', // 提取 CSS，并使用 contenthash 生成唯一的文件名
      chunkFilename: 'stylesheet/[id].[contenthash:8].css', // 针对 CSS 代码拆分后的文件，同样使用 contenthash
    }),
  ],
};

// 执行webpack打包
webpack(config).run(() => {});

// 主要是针对 组件库文档进行打包
// 1.分为umd.html 测试umd
// 2.组件库文档.html
// 3.组件库demo文档.html
// 4.打包完成后执行gh-pages -d assets 将assets提交到gh-pages分支，做一个自动部署
