// 这段代码的作用是 合并多个平台的代码覆盖率文件（coverage report），然后生成最终的报告文件（JSON、LCOV、文本）。
// 通常用于多平台项目（例如 Web 和 React Native）统一统计覆盖率。
const { createReporter } = require('istanbul-api'); // istanbul-api：提供生成覆盖率报告的 API。
const istanbulCoverage = require('istanbul-lib-coverage'); // istanbul-lib-coverage：提供操作覆盖率数据结构的工具，例如 coverage map。

const map = istanbulCoverage.createCoverageMap();
const reporter = createReporter();

const platforms = ['h5', 'rn'];

platforms.forEach((p) => {
  // eslint-disable-next-line
  const coverage = require(`../../coverage/coverage-${p}-final.json`);
  Object.keys(coverage).forEach((filename) => map.addFileCoverage(coverage[filename]));
});

reporter.addAll(['json', 'lcov', 'text']);
reporter.write(map);
