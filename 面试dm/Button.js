// Button 组件最终既可以是 <button> 也可以是 <a>，但在一次调用中：暴露
// 你只会用到一部分属性：
// 如果渲染 <a> → 只会用到 href, onClick 等
// 如果渲染 <button> → 只会用到 htmlType, onClick 等

const Button = (props) => {
  const {
    className,
    theme,
    size,
    shape,
    icon,
    block,
    ghost,
    shadow,
    disabled,
    loading,
    htmlType,
    onClick,
    children,
    ref,
    ...restProps
  } = props;

  // dm-button
  const cls = bem([
    {
      [`${theme}`]: !!theme, // button 主题  // za-button--primary
      [`${size}`]: !!size, // 大小 默认md  //za-button--primary
      [`${shape}`]: !!shape, // 形状 默认radius ，还有rect circle round  //za-button--radius
      block, // button 独占一行   //za-button--block
      ghost, // 是否是幽灵按钮，就是黑色主题 中空  //za-button--ghost
      shadow, // 是否带阴影    // za-button--shadow
      disabled, // 是否禁用   // za-button--disabled
      loading, // 是否是loading状态     // za-button--loading
      link: restProps.href !== undefined, // 是否为链接按钮   // za-button--link
    },
    className,
  ]);
};

// (restProps as AnchorButtonProps).href ? <a></a> : <button></button>
