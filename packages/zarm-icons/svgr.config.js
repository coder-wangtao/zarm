// 主要用于把 SVG 文件转成 React 组件
module.exports = {
  icon: true, // 自动把 width 和 height 设为 "1em"，适合图标使用（随字体大小缩放）。
  typescript: true, // 生成的组件文件使用 TypeScript（.tsx），带类型声明。
  // 给所有 SVG 组件默认添加的属性：
  svgProps: {
    fill: 'currentColor', // fill: 'currentColor' → 使用当前文本颜色填充图标（方便跟随主题变色）。
    focusable: false,   // focusable: false → 避免在浏览器中被 Tab 聚焦。
    'aria-hidden': 'true', // aria-hidden': 'true' → 默认对屏幕阅读器隐藏，提升可访问性。
  },
  ref: true, // 允许给生成的组件传递 ref（比如在外部用 forwardRef）。
  // 默认不会把所有 props 展开到 <svg> 上。
  // 如果你想允许额外传入 className、style 等属性，可以改成 "end"（会把 props 展开到 <svg>）。
  expandProps: false,
  // 使用自定义模板文件（这里是 ./templates/compTemplate.js）生成组件代码。
  template: require('./templates/compTemplate.js'),
  // indexTemplate: require('./templates/indexTemplate.js'),
};
