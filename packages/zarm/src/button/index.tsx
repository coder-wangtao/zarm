import { createBEM } from '@zarm-design/bem';
import React, { useContext } from 'react';
import { ConfigContext } from '../config-provider';
import Loading from '../loading';
import type { HTMLProps } from '../utils/utilityTypes';
import type { BaseButtonProps, ButtonShape, ButtonSize, ButtonTheme } from './interface';

export type { ButtonTheme, ButtonSize, ButtonShape };

export interface ButtonCssVars {
  '--height'?: React.CSSProperties['height'];
  '--background'?: React.CSSProperties['background'];
  '--border-radius'?: React.CSSProperties['borderRadius'];
  '--border-color'?: React.CSSProperties['borderColor'];
  '--border-width'?: React.CSSProperties['borderWidth'];
  '--padding-horizontal'?: React.CSSProperties['paddingLeft'];
  '--text-color'?: React.CSSProperties['color'];
  '--font-size'?: React.CSSProperties['fontSize'];
  '--icon-size'?: React.CSSProperties['fontSize'];
  '--loading-color'?: React.CSSProperties['color'];
  '--active-background'?: React.CSSProperties['background'];
  '--active-border-color'?: React.CSSProperties['borderColor'];
  '--active-text-color'?: React.CSSProperties['color'];
  '--active-loading-color'?: React.CSSProperties['color'];
  '--shadow'?: React.CSSProperties['boxShadow'];
}

// Button 组件最终既可以是 <button> 也可以是 <a>，但在一次调用中：
// 你只会用到一部分属性：
// 如果渲染 <a> → 只会用到 href, onClick 等
// 如果渲染 <button> → 只会用到 htmlType, onClick 等

export type AnchorButtonProps = {
  // mimeType：可以用来设置 <a> 的 type 属性（比如 application/pdf 等）。
  // onClick：点击事件处理函数，专门针对 <a> 元素。
  mimeType?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
} & BaseButtonProps &
  HTMLProps<ButtonCssVars> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'type' | 'onClick'>;

export type NativeButtonProps = {
  htmlType?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & BaseButtonProps &
  HTMLProps<ButtonCssVars> &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'>;

export type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>;

const Button = React.forwardRef<unknown, ButtonProps>((props, ref) => {
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
    ...restProps
  } = props;

  const buttonRef = (ref as any) || React.createRef<HTMLButtonElement | HTMLAnchorElement>();
  const iconRender = loading ? <Loading /> : icon;
  const childrenRender = children && <span>{children}</span>;

  const { prefixCls } = useContext(ConfigContext);
  const bem = createBEM('button', { prefixCls });

  const cls = bem([
    {
      [`${theme}`]: !!theme, // button 主题
      [`${size}`]: !!size, // 大小 默认md
      [`${shape}`]: !!shape, // 形状 默认radius ，还有rect circle round
      block, // button 独占一行
      ghost, // 是否是幽灵按钮，就是黑色主题 中空
      shadow, // 是否带阴影
      disabled, // 是否禁用
      loading, // 是否是loading状态
      link: (restProps as AnchorButtonProps).href !== undefined, // 是否为链接按钮
    },
    className,
  ]);

  // icon 按钮图标
  const contentRender =
    !!icon || loading ? (
      <div className={bem('content')}>
        {iconRender}
        {childrenRender}
      </div>
    ) : (
      childrenRender
    );

  const onPress: ButtonProps['onClick'] = (e) => {
    if (disabled) {
      return;
    }
    if (typeof onClick === 'function') {
      onClick(e);
    }
  };

  // 链接按钮
  if ((restProps as AnchorButtonProps).href !== undefined) {
    const { mimeType, ...anchorRest } = restProps;
    return (
      <a
        {...(anchorRest as AnchorButtonProps)}
        type={mimeType}
        aria-disabled={disabled}
        className={cls}
        onClick={onPress}
        ref={buttonRef}
      >
        {contentRender}
      </a>
    );
  }

  const { mimeType, target, ...nativeRest } = restProps;

  return (
    <button
      {...(nativeRest as NativeButtonProps)}
      type={htmlType}
      aria-disabled={disabled}
      className={cls}
      onClick={onPress}
      ref={buttonRef}
    >
      {contentRender}
    </button>
  );
});

Button.displayName = 'Button';

Button.defaultProps = {
  theme: 'default',
  size: 'md',
  shape: 'radius',
  block: false,
  ghost: false,
  shadow: false,
  disabled: false,
  loading: false,
  htmlType: 'button',
};

export default Button;
