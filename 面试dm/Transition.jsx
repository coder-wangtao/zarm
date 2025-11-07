// Transition(不暴露)

import { Transition } from 'react-transition-group';

<Transition>
  {() => {
    // 检测 children 是否是一个合法的 React 元素
    // React.isValidElement(children) 用来判断传进来的 children 是否真的是一个 React element（例如 <div />、<Button />），而不是字符串、数字或 null 等。
    // 如果是合法 React 元素，就克隆这个元素，并追加或覆盖它的 props
    // React.cloneElement(children, { ... }) 会基于原来的 children ，创建一个新的 React 元素，并将新的 props 合并进去。
    // 给克隆后的组件添加：
    // ref: setNodeRef
    // 给子组件绑定 ref（通常用于 DOM 访问或拖拽库的节点引用）
    // className 合并
    // classnames(children.props.className, className) 把原本组件上的 className 和外部传进来的 className 合并成一个字符串
    // style 合并
    // 把原组件的 style 和新的 style 合并（新的 style 会覆盖旧的 style）

    if (React.isValidElement < any > children) {
      return React.cloneElement(children, {
        ref: setNodeRef,
        className: classnames(children.props.className, className),
        style: {
          ...children.props.style,
          ...style,
        },
      });
    }
    return children?.({ className, style, visible }, setNodeRef);
  }}
</Transition>;
