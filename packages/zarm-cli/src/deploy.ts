/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
import SentryCliPlugin from '@sentry/webpack-plugin'; // @sentry/webpack-plugin: Webpack 插件，用于将构建的 source map 上传到 Sentry，方便错误追踪。
import HtmlWebpackPlugin from 'html-webpack-plugin'; // HtmlWebpackPlugin: 用于创建 HTML 文件并自动将打包后的 JavaScript 文件注入到 HTML 文件中。
import webpack, { Configuration, RuleSetRule } from 'webpack'; // webpack: 核心的 Webpack 模块，用于打包 JavaScript 文件。
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'; // webpack-bundle-analyzer: 用于分析和可视化 Webpack 输出文件的大小。
import webpackMerge from 'webpack-merge'; // webpack-merge: 用于合并多个 Webpack 配置文件的工具。
import getWebpackConfig from './config/webpackConfig';
import { getCustomConfig, getProjectPath } from './utils';

const { version } = require(getProjectPath('package.json'));

export interface IDeployConfig {
  outDir: string;
  pushGh: boolean;
  analyzer: boolean;
}

export function getProjectConfig(config: Configuration): Configuration {
  const { entries, setBabelOptions, banner, setRules, setPlugins, ...webpackConfig } =
    getCustomConfig(); // 获取自定义的 Webpack 配置 zarm.config.js

  config.entry = {}; // 清空默认的入口配置
  config.plugins = config.plugins || []; // 确保插件数组存在
  // 如果有自定义的 Babel 配置，执行 setBabelOptions
  setBabelOptions && setBabelOptions((config.module.rules[0] as RuleSetRule).use[0].options);

  setRules && setRules(config.module.rules);

  setPlugins && setPlugins(config.plugins);

  // 配置多入口并生成 HTML 文件
  Object.keys(entries || {}).forEach((key) => {
    if (entries[key].entry) {
      config.entry[key] = entries[key].entry;
    }
    const htmlWebpackPlugin = new HtmlWebpackPlugin({
      template: entries[key].template,
      filename: `${key}.html`,
      chunks: ['manifest', key],
      favicon: entries[key].favicon,
      inject: entries[key].inject !== false,
    });

    config.plugins.push(htmlWebpackPlugin); // 添加 HtmlWebpackPlugin 插件
  });

  return webpackMerge(config, webpackConfig); // 合并自定义配置和传入的 Webpack 配置
}

export default ({ outDir, pushGh, analyzer }: IDeployConfig) => {
  const config = getProjectConfig(getWebpackConfig('deploy'));
  config.output.path = getProjectPath(outDir); // 设置输出目录路径

  if (pushGh) {
    // 如果需要将构建结果推送到 sentry
    config.plugins.push(
      new SentryCliPlugin({
        release: version, // 使用当前版本号作为 Sentry 的发布版本
        include: outDir, // 指定上传 source map 的目录
        sourceMapReference: false, // 不需要在构建的 JS 文件中注入 source map 引用
      }),
    );
  }

  if (analyzer) {
    // 如果启用 Webpack Bundle Analyzer
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static', // 生成静态 HTML 文件
        generateStatsFile: true, // 生成 stats.json 文件
      }),
    );
  }

  webpack(config).run(() => {}); // 执行 Webpack 构建过程
};
