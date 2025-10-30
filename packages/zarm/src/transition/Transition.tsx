import classnames from 'classnames';
import * as React from 'react';
import { Transition as InternalTransition } from 'react-transition-group';
import { noop } from '../utils';
import Events from '../utils/events';
import type { HTMLProps } from '../utils/utilityTypes';
import type { BaseTransitionProps } from './interface';

export interface TransitionChildrenProps extends Required<HTMLProps> {
  visible?: boolean;
}

export interface TransitionProps extends BaseTransitionProps {
  nodeRef?: React.RefObject<HTMLElement> | React.ForwardedRef<HTMLElement>;
  tranisitionName: string;
  duration?: number;
  children:
    | ((
        props: TransitionChildrenProps,
        setNodeRef: (node: HTMLElement | null) => void,
      ) => React.ReactElement)
    | React.ReactElement;
  onEnter?: () => void;
  onEnterActive?: () => void;
  onEnterEnd?: () => void;
  onLeave?: () => void;
  onLeaveActive?: () => void;
  onLeaveEnd?: () => void;
}

// 定义动画状态枚举
enum TransitionState {
  UNMOUNTED = 'unmounted',
  ENTER = 'enter',
  ENTERING = 'entering',
  ENTERED = 'entered',
  EXIT = 'exit',
  EXITING = 'exiting',
  EXITED = 'exited',
}

// 浏览器事件名称，分别对应 CSS 动画和过渡结束事件。
const animationEndName = 'animationend';
const transitionEndName = 'transitionend';

const Transition: React.FC<TransitionProps> = (props) => {
  const {
    visible,
    tranisitionName,
    duration,
    forceRender,
    destroy,
    children,
    onEnter,
    onEnterActive,
    onEnterEnd,
    onLeave,
    onLeaveActive,
    onLeaveEnd,
  } = props;
  const nodeRef = React.useRef<HTMLElement | null>();
  const [state, setState] = React.useState(TransitionState.UNMOUNTED);
  const callbackRef = React.useRef<(event: Event) => void>(noop);

  const unmounted = TransitionState.UNMOUNTED === state;
  const enter = TransitionState.ENTER === state;
  const entering = TransitionState.ENTERING === state;
  const leave = TransitionState.EXIT === state;
  const leaving = TransitionState.EXITING === state;
  const exited = TransitionState.EXITED === state;
  const running = enter || entering || leave || leaving;

  const className = classnames({
    [`${tranisitionName}-enter`]: enter || entering,
    [`${tranisitionName}-enter-active`]: entering,
    [`${tranisitionName}-leave`]: leave || leaving,
    [`${tranisitionName}-leave-active`]: leaving,
  });

  // 如果动画正在进行且 duration > 0，设置动画/过渡时间。
  const timeout = running && duration && duration > 0 ? `${props.duration}ms` : undefined;

  const style: React.CSSProperties = {
    animationDuration: timeout,
    WebkitAnimationDuration: timeout,
    transitionDuration: timeout,
    WebkitTransitionDuration: timeout,
    display: (unmounted || exited) && !visible && !destroy ? 'none' : undefined,
  };

  const setNodeRef = (node: HTMLElement | null) => {
    nodeRef.current = node;
  };

  React.useImperativeHandle(props.nodeRef, () => nodeRef.current!);

  // 清理事件监听
  React.useEffect(() => {
    return () => {
      if (!nodeRef.current) return;
      Events.off(nodeRef.current, animationEndName, callbackRef.current);
      Events.off(nodeRef.current, transitionEndName, callbackRef.current);
    };
  }, []);

  return (
    <InternalTransition
      // nodeRef 用于告诉 Transition 哪个 DOM 节点是动画目标。
      nodeRef={nodeRef}
      in={visible} // true → 进入动画；false → 离开动画。
      addEndListener={(next) => {
        /// “什么时候动画结束”。
        // 默认情况下，Transition 会根据 timeout 来判断动画时间，
        // 但有时候动画时间是由 CSS 动画或过渡 控制的（animation / transition），并不是固定的毫秒数。
        // 这时，就可以用 addEndListener 手动监听动画结束事件，然后调用 next() 通知 Transition 动画完成。
        if (!nodeRef.current) return;
        callbackRef.current = (event: Event) => {
          const target = event.target as HTMLElement;
          // event.target 是触发动画结束事件的元素；
          // 判断 target 是否包含我们要动画的 DOM 节点（nodeRef.current），避免事件冒泡误触发；
          if (!target.contains(nodeRef.current)) return;
          // next 是 Transition 提供的回调函数，用于通知动画结束。
          next();
        };
        Events.on(nodeRef.current, animationEndName, callbackRef.current);
        Events.on(nodeRef.current, transitionEndName, callbackRef.current);
      }}
      mountOnEnter={!forceRender} // 组件只有在进入动画触发时才挂载到 DOM。
      unmountOnExit={destroy} // 如果 true，组件在离开动画结束后从 DOM 卸载。s
      onEnter={() => {
        // 进入
        setState(TransitionState.ENTER);
        onEnter?.();
      }}
      onEntering={() => {
        // 进入中
        setState(TransitionState.ENTERING);
        onEnterActive?.();
      }}
      onEntered={() => {
        // 进入后
        setState(TransitionState.ENTERED);
        onEnterEnd?.();
      }}
      onExit={() => {
        // 退出
        setState(TransitionState.EXIT);
        onLeave?.();
      }}
      onExiting={() => {
        // 退出中
        setState(TransitionState.EXITING);
        onLeaveActive?.();
      }}
      onExited={() => {
        // 退出后
        setState(TransitionState.EXITED);
        onLeaveEnd?.();
      }}
    >
      {() => {
        // 如果是 React 元素：
        // 直接修改 children.props 是不行的，因为在 React 中 props 是只读的。
        // React.cloneElement 的作用
        // 它会 克隆一个 React 元素，并允许你覆盖或添加 props。
        // 返回一个新的 React 元素，原来的子元素保持不变。
        // 使用场景：你想在不修改原元素的情况下“增强”它。
        if (React.isValidElement<any>(children)) {
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
    </InternalTransition>
  );
};

export default Transition;
