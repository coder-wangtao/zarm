import gulp from 'gulp'; // 导入 gulp，用于定义和运行构建任务
import gulpSass from 'gulp-sass'; // 导入 gulp-sass 插件，用于处理 SASS 文件
import dartSass from 'sass'; // 导入 Dart Sass 作为 SASS 的编译器
import through2 from 'through2'; // 导入 through2，流处理工具，用于处理文件流
import { getProjectPath } from '../utils'; // 导入自定义的工具函数，用于获取项目路径

const sass = gulpSass(dartSass); // 配置 gulp-sass 使用 Dart Sass 作为编译器

// 这个文件是一个 Gulp 构建任务，主要用来处理 SASS 文件的编译、CSS 文件的内容修改和生成新的 JavaScript 文件。任务包括：
// 将 SASS 文件编译为 CSS 文件。
// 修改 CSS 文件中的路径和扩展名。
// 输出生成的 CSS 文件和处理后的 JavaScript 文件。

// cssInjection 是一个用来修改 CSS 文件内容的函数。它会将 '/style/' 变为 '/style/css/'，并把 .scss 后缀改为 .css。
const cssInjection = (content) => {
  return content
    .replace(/\/style\/?'/g, "/style/css'") // 替换 'style' 为 'style/css'
    .replace(/\/style\/?"/g, '/style/css"') // 替换 "style" 为 "style/css"
    .replace(/\.scss/g, '.css'); // 替换 .scss 为 .css
};

const gulpTask = (path?: string, outDir?: string, callback?: () => void) => {
  const DIR = {
    sass: getProjectPath(`${path}/**/index.scss`), // 获取 SASS 文件路径
    js: getProjectPath(`${outDir}/**/style/index.js`), // 获取 JS 输出路径
  };

  // 该任务负责将 SASS 文件编译成 CSS 文件。
  // 使用 gulp.src 加载指定路径的 SASS 文件，之后通过 gulp-sass 插件进行编译。
  gulp.task('sass', () => {
    return gulp
      .src(DIR.sass) /// 从指定的 SASS 文件路径加载源文件
      .pipe(
        sass
          .sync({
            includePaths: ['node_modules'], // 设置 `node_modules` 为 SASS 的查找路径
            importer: (url) => {
              // 自定义 SASS 导入器
              if (url.startsWith('~')) {
                const resolved = require.resolve(url.replace('~', ''));
                return { file: resolved };
              }
            },
          })
          .on('error', sass.logError),
      )
      .pipe(gulp.dest(outDir)); // 使用 gulp.dest(outDir) 将编译结果输出到指定的目录。
  });

  // CSS 注入和 JavaScript 任务
  gulp.task('css', () => {
    return gulp
      .src(DIR.js) // 从指定的 JS 文件路径加载源文件
      .pipe(
        through2.obj(function z(file, encoding, next) {
          this.push(file.clone()); // 克隆文件，以便后续处理
          const content = file.contents.toString(encoding); // 获取文件内容
          file.contents = Buffer.from(cssInjection(content)); // 使用 cssInjection 修改内容
          file.path = file.path.replace(/index\.js/, 'css.js'); // 修改文件路径，替换 index.js 为 css.js
          this.push(file); // 将修改后的文件推送到流中
          next(); // 继续处理下一个文件
        }),
      )
      .pipe(gulp.dest(outDir)); // 输出处理后的文件到指定目录
  });

  return gulp.series(['sass', 'css'], callback); // 返回执行 'sass' 和 'css' 两个任务的任务序列
};

export default gulpTask;
