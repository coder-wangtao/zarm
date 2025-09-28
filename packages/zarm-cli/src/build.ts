import execa from 'execa'; // 导入 execa，用于在 Node.js 中执行外部命令
import gulp from 'gulp'; // 导入 gulp，用于自动化构建任务
import { Signale } from 'signale'; /// 导入 Signale，用于美化控制台日志
import webpack from 'webpack'; // 导入 webpack，用于打包和构建 JavaScript 项目
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'; // 导入 webpack-bundle-analyzer 插件，用于分析打包后的文件大小
import webpackMerge from 'webpack-merge'; // 导入 webpack-merge，用于合并多个 webpack 配置文件
import getGulpConfig from './config/gulpConfig';
import getWebpackConfig from './config/webpackConfig';
import { getProjectConfig } from './deploy';
import { getCustomConfig, getProjectPath } from './utils';

// eslint-disable-next-line
const { name } = require(getProjectPath('package.json'));

// print error
// 打印错误信息
const showErrors = (errors) => {
  console.error('zarm cli: ');
  errors.forEach((e) => {
    console.error(`  ${e}`);
  });
  process.exit(2);
};

// 用于构建 UMD 格式的构建函数
const umdBuild = async ({ mode, path, outDir, libraryName, analyzer }, barActive) => {
  libraryName = libraryName || name; // 如果没有传入 libraryName，使用 package.json 中的 name

  // 将路径字符串转换为数组，并获取每个路径的实际文件位置
  const entryFiles = path.split(',').map((p) => getProjectPath(p));

  const customizePlugins = []; // 自定义插件数组
  const { banner } = getCustomConfig(); // 获取自定义配置中的 banner（横幅信息）

  // 如果开启了分析器，添加分析器插件
  analyzer &&
    customizePlugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        generateStatsFile: true,
      }),
    );

  // 如果有横幅信息，添加 Banner 插件
  banner && customizePlugins.push(new webpack.BannerPlugin(banner));

  // UMD 构建任务
  const umdTask = (type) => {
    return new Promise((resolve, reject) => {
      const config = webpackMerge(getProjectConfig(getWebpackConfig(type)), {
        entry: {
          [libraryName]: entryFiles, // 配置入口文件
        },
        output: {
          path: getProjectPath(outDir), /// 输出目录
          library: libraryName, // 输出库的名称
        },
        plugins: customizePlugins, // 插件
      });

      return webpack(config).run((err, stats) => {
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
    });
  };

  barActive.process('building...');
  await umdTask(mode);
  barActive.success('Compiled successfully!');
};

// 用于构建库和 ES 模块的函数
const buildLibrary = async (
  { mode, path, ext, outFile, outDir, copyFiles, buildCss },
  barActive,
) => {
  const args = [
    require.resolve('@babel/cli/bin/babel'), // 使用 babel 编译器
    path, // 输入路径
    '--extensions', // 需要编译的文件扩展名
    ext, // 允许的扩展名
    '--ignore', // 忽略文件类型
    '**/*.d.ts', // 忽略所有的类型声明文件
    '--config-file', // 使用特定的 Babel 配置文件
    require.resolve(`./config/babelConfig/${mode}`), // 根据模式加载不同的 Babel 配置
  ];

  // 如果需要复制文件，添加相应参数
  if (copyFiles) {
    args.push('--copy-files');
  }

  // 如果指定了输出目录，添加相应参数
  if (outDir) {
    args.push('--out-dir', outDir);
  }

  // 如果指定了输出文件，添加相应参数
  if (outFile) {
    args.push('--out-file', outFile);
  }

  barActive.process('building...'); // 显示构建中的进度
  const { stderr, exitCode } = await execa('node', args); // 执行 Babel 编译任务
  if (exitCode !== 0) {
    // 如果编译出错
    process.stderr.write(stderr); // 输出错误信息
    process.exit(0); // 退出进程
  } else {
    // 如果需要构建 CSS 文件
    if (buildCss) {
      barActive.process('building css files'); // 显示构建 CSS 的进度
      if (mode !== 'native') {
        // 如果不是原生模式，使用 gulp 编译 CSS
        getGulpConfig(path, outDir, () => {
          barActive.success('Compiled successfully!'); // 完成后显示成功信息
        })(gulp);
      }
      return;
    }
    barActive.success('Compiled successfully!');
  }
};

// 主构建函数，根据传入的选项进行不同的构建操作
export default async (options) => {
  const { mode, path, outFile, outDir } = options;
  const errors = []; // 错误数组，用于收集参数错误

  // 如果没有定义 mode，加入错误
  if (!mode) {
    errors.push('--mode requires define');
  }

  // 如果没有定义 path，加入错误
  // if (!isZarmGroup()) {
  if (!path) {
    errors.push('--path requires define');
  }

  // 如果没有定义 outDir 或 outFile，加入错误
  if (!outDir && !outFile) {
    if (!outDir) {
      errors.push('--out-dir requires foldername');
    }
    if (!outFile) {
      errors.push('--out-file requires filename');
    }
  }
  // }
  // 如果有错误，显示错误并退出
  errors.length && showErrors(errors);

  const barActive = new Signale({
    scope: 'Zarm', // 设置日志的作用域
    interactive: true, // 使日志可交互
    types: {
      process: {
        // 设置“构建中”进度条样式
        badge: '●',
        color: 'yellow',
        label: `build ${mode}`,
      },
      success: {
        // 设置“构建成功”样式
        badge: '●',
        color: 'green',
        label: `build ${mode}`,
      },
    },
  });

  // umd编译模式;
  // 如果是 UMD 构建模式，调用 umdBuild
  if (mode.indexOf('umd') >= 0) {
    umdBuild(options, barActive);
    return;
  }

  // 否则，调用 buildLibrary 进行库构建
  buildLibrary(options, barActive);
};
