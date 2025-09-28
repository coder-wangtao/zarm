// 自定义的 Babel 转换器，用于在 Jest 测试中转译代码
import babelJest from 'babel-jest';
import babelConfig from '../babelConfig/base';

module.exports = babelJest.createTransformer(babelConfig);

// 你用了 import ... from，但最后用了 module.exports。最好保持一致，要么全用 ES Module，要么全用 CommonJS。
