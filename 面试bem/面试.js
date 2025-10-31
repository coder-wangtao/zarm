// 1.用来动态生成符合 BEM 规范的类名 js实现。
// 1. 动态生成符合 BEM 规范的类名工具
// button 前缀，一般用于项目命名空间

// 前缀-块__元素--修饰符

const bem = createBEM('button', { prefixCls: 'dm' });

bem(); // dm-button

bem([{ loading: true }, 'customClass']); // dm-button dm-button--loading customClass

bem('text'); // dm-button__text

bem('text', ['customClass']); // dm-button__text customClass

bem('text', [
  {
    theme: 'primary',
    block,
    loading: true,
    disabled: false,
  },
  'customClass',
]); // dm-button__text dm-button__text--theme-primary dm-button__text--block dm-button__text--loading customClass

// 2.sass利用@mixin定义 分别定义b、e、m
// 之后使用@include使用@mixin
// @include b('button') {
//   background: white;

//   @include e('icon') {
//     color: blue;
//   }

//   @include m('primary', 'disabled') {
//     font-weight: bold;
//   }
// }

// 输出
// .dm-button {
//   background: white;
// }
// .dm-button__icon {
//   color: blue;
// }
// .dm-button--primary,
// .dm-button--disabled {
//   font-weight: bold;
// }  

// 使用dm-cli构建bem
// 分别构建成es(es module)、lib(commonjs)
