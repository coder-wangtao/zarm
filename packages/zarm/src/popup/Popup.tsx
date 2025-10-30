import { createBEM } from '@zarm-design/bem';
import * as React from 'react';
import { ConfigContext } from '../config-provider';
// OK
import Mask from '../mask';
// OK
import Transition from '../transition';
// OK
import Trigger from '../trigger';
import { renderToContainer } from '../utils/dom';
// OK 锁定滚动
import { useLockScroll } from '../utils/hooks';
import type { HTMLProps } from '../utils/utilityTypes';
import type { BasePopupProps } from './interface';

export type PopupProps = BasePopupProps & HTMLProps;

const TRANSITION_NAMES = {
  top: 'move-down',
  bottom: 'move-up',
  center: 'fade',
  left: 'move-left',
  right: 'move-right',
};

const Popup = React.forwardRef<HTMLDivElement, PopupProps>((props, ref) => {
  const {
    width,
    destroy,
    forceRender,
    visible,
    animationType,
    animationDuration,
    lockScroll,
    direction,
    mask,
    maskClassName,
    maskStyle,
    maskColor,
    maskOpacity,
    afterOpen,
    afterClose,
    onOpen,
    onClose,
    onMaskClick,
    onEsc,
    children,
  } = props;

  const { prefixCls, mountContainer: globalMountContainer } = React.useContext(ConfigContext);
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const maskRef = React.useRef<HTMLDivElement>(null);
  const bem = createBEM('popup', { prefixCls });

  // lockScroll && visible 才锁定滚动
  useLockScroll(visible! && lockScroll!);

  // TODO:OK
  const handleEsc = React.useCallback(() => {
    // esc会执行这里
    onEsc?.();
  }, []);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    // 如果点击的是 nodeRef 内部的元素（但不是 nodeRef 本身），就直接返回，不做任何操作。
    // 这种写法通常用于 点击遮罩层关闭弹窗，但点击弹窗本身不关闭。
    if (nodeRef.current !== event.target && nodeRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    maskRef.current?.click();
  };

  const transitionName = animationType ?? TRANSITION_NAMES[direction!];

  React.useImperativeHandle(ref, () => nodeRef.current);

  return (
    <Trigger visible={visible} onClose={handleEsc}>
      {mask && (
        <Mask
          ref={maskRef}
          className={maskClassName}
          style={maskStyle}
          visible={visible}
          color={maskColor}
          opacity={maskOpacity}
          animationDuration={animationDuration}
          mountContainer={props.mountContainer}
          forceRender={forceRender}
          destroy={destroy}
          onClick={(e) => {
            e.stopPropagation();
            onMaskClick && onMaskClick(e);
          }}
        />
      )}

      <Transition
        nodeRef={nodeRef}
        visible={visible}
        tranisitionName={`${prefixCls}-${transitionName}`}
        duration={animationDuration}
        forceRender={forceRender}
        destroy={destroy}
        onEnter={() => {
          afterOpen?.();
        }}
        onEnterActive={() => {
          onOpen?.();
        }}
        onLeaveActive={() => {
          onClose?.();
        }}
        onLeaveEnd={() => {
          afterClose?.();
        }}
      >
        {({ className, style }, setNodeRef) => {
          const { display, ...restStyle } = style;
          return renderToContainer(
            // document.body
            props.mountContainer ?? globalMountContainer,
            <div
              className={bem('wrapper', [{ center: direction === 'center' }, props.className])}
              style={{ ...props.style, display }}
              onClick={handleClick}
            >
              <div
                ref={setNodeRef}
                className={bem([{ [`${direction}`]: !!direction }, className])}
                style={{
                  ...restStyle,
                  width,
                }}
              >
                {children}
              </div>
            </div>,
          );
        }}
      </Transition>
    </Trigger>
  );
});

Popup.displayName = 'Popup';

Popup.defaultProps = {
  visible: false,
  mask: true,
  direction: 'bottom',
  destroy: true,
  lockScroll: true,
};

export default Popup;
