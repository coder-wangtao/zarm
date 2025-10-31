// 1.现根据icons.sketch文件配合sketchtool，将icons.sketch文件转化成svg文件
// 2.然后将svg文件利用svgr,配合一个react组件模板,将SVG 文件转成 React 组件
// 3.利用webFontsHelper将一组SVG图标转成Web字体(icon font)。
// 4.css中可以用@font-face使用字体
@font-face {
  font-family: 'zaicon';
  src: url('../zaicon.eot');
  src: url('../zaicon.eot?#iefix') format('embedded-opentype'), url('../zaicon.woff') format('woff'),
    url('../zaicon.ttf') format('truetype'), url('../zaicon.svg#zaicon') format('svg');
  font-weight: normal;
  font-style: normal;
}
// 在css中使用
.za-icon__arrow-down:before {
  content: '\EA01';
  font-family: 'zaicon';
}


//build
//最后向外暴露的是Icon组件 和 SVG文件转成的React组件

// Icon组件
// Icon.createFromIconfont，
// 它接受一个 scriptUrl 参数，用于从外部的图标库（比如 Iconfont）加载图标资源。
// 该函数返回一个新的 React 组件，使用该组件可以在页面中渲染从 Iconfont 加载的图标。
// 方便开发者调用在 iconfont.cn、iconpark 等平台上自行管理的图标。
//其本质上是组件在渲染前会自动引入项目中的图标符号集，并且创建了一个 <use> 标签来渲染图标的组件。

//iconfont(字体图标) > svg component(React 封装的 SVG 组件) > children by iconfont(原生 SVG)
//先渲染 字体图标；再渲染React 封装的 SVG 组件；再渲染原生 SVG

// build:es 打包成es模块
// build:lib 打包成commonjs模块