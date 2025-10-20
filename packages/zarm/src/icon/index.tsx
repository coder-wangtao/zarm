import type { IconProps as BaseIconProps } from '@zarm-design/icons';
import { Icon as BaseIcon } from '@zarm-design/icons';
import * as React from 'react';
import type { HTMLProps } from '../utils/utilityTypes';

export interface IconCssVars {
  '--font-size'?: React.CSSProperties['fontSize'];
  '--color'?: React.CSSProperties['color'];
}
// Omit
// interface User {
//   id: number;
//   name: string;
//   email: string;
//   password: string;
// }
// type UserWithoutPassword = Omit<User, "password">;
// // 排除 password 属性后的新类型

// React.HTMLAttributes<HTMLElement>
// 这是 React 提供的一个类型，表示 所有 HTML 元素常用的属性，比如：
// 换句话说，它就是把 普通 HTML 标签能用的所有属性都列出来的类型。
// BaseIconProps = 
// {
//   onClick?: React.MouseEventHandler<HTMLElement>;
//   className?: string;
//   style?: React.CSSProperties;
// } + 自定义Icon类型

export type IconProps = Omit<BaseIconProps, 'prefixCls'> & HTMLProps<IconCssVars>;

interface CompoundedComponent extends React.ForwardRefExoticComponent<IconProps> {
  createFromIconfont: typeof BaseIcon.createFromIconfont;
}
// HTMLElement ref
// IconProps ref
const Icon = React.forwardRef<HTMLElement, IconProps>((props, ref) => {
  return <BaseIcon ref={ref} {...props} />;
}) as CompoundedComponent;

Icon.createFromIconfont = BaseIcon.createFromIconfont;

Icon.displayName = 'Icon';
Icon.defaultProps = {
  viewBox: '0 0 1000 1000',
};

export default Icon;
