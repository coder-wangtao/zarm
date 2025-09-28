import MiniCssExtractPlugin from 'mini-css-extract-plugin'; // MiniCssExtractPlugin：把 CSS 从 JS 文件里抽离出来，单独生成 .css 文件。
import webpack, { Configuration } from 'webpack'; // webpack：webpack 的核心包。Configuration 是类型定义（因为你用的是 TypeScript）。
import webpackMerge from 'webpack-merge'; // 用来合并多个 webpack 配置对象，避免重复代码。
import WebpackBar from 'webpackbar'; // WebpackBar：一个进度条插件，让打包时在命令行里显示进度。
import babelConfig from './babelConfig/base';

const config: Configuration = {
  stats: 'errors-warnings', // 只显示错误和警告，减少编译输出的信息量。

  output: {
    filename: 'js/[name].js', // 入口文件输出到 js/ 目录下，文件名是 [name].js。
    chunkFilename: 'js/[name].[chunkhash:8].js', // 非入口的代码分割 chunk 文件名，带 8 位哈希值。
    publicPath: '/', // 打包后所有静态资源的访问路径前缀。这里是 /，即根目录。
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: babelConfig,
          },
        ],
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // 用 MiniCssExtractPlugin.loader 把样式提取出来。
            options: {
              publicPath: '../', // publicPath: '../' 让生成的 CSS 里的资源路径往上一级。
            },
          },
          {
            loader: require.resolve('css-loader'), // css-loader：处理 import 和 url()。
            options: {
              importLoaders: 2, // importLoaders: 2 表示在 @import 的 CSS 前还需要经过 2 个 loader（postcss-loader、sass-loader）。
            },
          },
          {
            loader: require.resolve('postcss-loader'), //  给 CSS 自动加浏览器前缀，修复 flexbox 的兼容性问题。
            options: {
              postcssOptions: {
                plugins: [
                  'postcss-flexbugs-fixes',
                  [
                    'postcss-preset-env',
                    {
                      autoprefixer: {
                        flexbox: 'no-2009',
                      },
                      stage: 3,
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: require.resolve('sass-loader'), // ：把 SCSS 编译成 CSS。 sourceMap: true：方便调试。
            options: {
              sourceMap: true,
              implementation: require('sass'), // implementation: require('sass')：明确指定用 sass（Dart Sass），而不是 node-sass。
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg|ico)$/, // 匹配各种图片，打包成单独文件，放到 images/ 目录下，文件名带 8 位哈希。
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash:8][ext]',
        },
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/, // 处理字体文件，打包到 fonts/ 目录下。
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]',
        },
      },
    ],
  },

  resolve: {
    // extensions：省略文件后缀时的自动补全（这里有个 bug，第一个 ' ' 应该删掉）。
    extensions: [' ', '.ts', '.tsx', '.js', '.jsx', '.scss', '.svg'],
    // alias：给 react-dom 指定成 profiling 版本，用于性能分析。
    alias: {
      // react-devtools support to profiling
      'react-dom$': 'react-dom/profiling',
      'scheduler/tracing': 'scheduler/tracing-profiling',
    },
  },

  plugins: [
    // WebpackBar：显示打包进度条。
    new WebpackBar({}),
    // ProvidePlugin：在代码里用 process 时自动引入 process/browser，解决浏览器环境下 process 不存在的问题。
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};

const deployConfig: Configuration = webpackMerge({}, config, {
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'stylesheet/[name].[contenthash:8].css', // 提取 CSS，并使用 contenthash 生成唯一的文件名
      chunkFilename: 'stylesheet/[id].[contenthash:8].css', // 针对 CSS 代码拆分后的文件，同样使用 contenthash
    }),
  ],
});

const devConfig: Configuration = webpackMerge({}, deployConfig, {
  mode: 'development', // 设置为开发模式
  devtool: 'cheap-module-source-map', // 使用便宜的 source map，适合开发时调试
  optimization: {
    minimize: false, // 不进行代码压缩，便于开发时调试
  },
  plugins: [], // 开发环境下不需要额外的插件
  cache: {
    type: 'filesystem', // 使用文件系统缓存，加速构建过程
    name: 'zarm-dev', // 缓存名称
    buildDependencies: {
      config: [__filename], // 如果配置文件发生变化，则重新构建// __filename是一个全局变量，用于获取当前执行脚本的完整文件路径
    },
    store: 'pack', // 存储缓存的位置
  },
});

const umdConfig: Configuration = webpackMerge({}, config, {
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
});

const umdUglyConfig: Configuration = webpackMerge({}, umdConfig, {
  mode: 'production', // 设置为生产模式
  output: {
    filename: '[name].min.js', // 输出的文件名使用 `.min.js`，以示已压缩
  },
});

type WebpackConfigType = 'umd' | 'umd-ugly' | 'dev' | 'deploy';

const getWebpackConfig = (type?: WebpackConfigType): Configuration => {
  switch (type) {
    case 'umd':
      umdConfig.plugins.push(
        new MiniCssExtractPlugin({
          filename: '[name].css', // 追加 MiniCssExtractPlugin 插件，用于提取 CSS
        }),
      );
      return umdConfig;

    case 'umd-ugly':
      umdUglyConfig.plugins.push(
        new MiniCssExtractPlugin({
          filename: '[name].min.css', // 追加插件，提取 CSS 并压缩成 `.min.css`
        }),
      );
      return umdUglyConfig;

    case 'dev':
      devConfig.output.publicPath = '/'; // 设置开发模式下的公共路径为 '/'
      return devConfig;

    case 'deploy':
      return deployConfig;

    default:
      return devConfig;
  }
};

export default getWebpackConfig;
