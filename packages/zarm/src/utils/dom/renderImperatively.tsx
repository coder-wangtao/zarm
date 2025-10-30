// 移植自 antd-mobile: https://github1s.com/ant-design/ant-design-mobile/blob/HEAD/src/utils/render-imperatively.tsx
// 实现一个命令式渲染工具，让你可以在 React 中像普通 JS API 一样动态创建、关闭、替换组件实例。

// 动态渲染组件
// 不需要在 JSX 里写 <MyDialog />，而是可以在任何地方用代码动态创建弹窗、提示框、Toast 等组件。
// 命令式控制组件
// 渲染后可以得到一个句柄（ImperativeHandler），直接调用：
// const dialog = renderImperatively(<MyDialog />);
// dialog.close();  // 关闭组件
// dialog.replace(<OtherDialog />);  // 替换组件
// 处理生命周期回调
// 支持 onClose（关闭时）和 afterClose（卸载后）回调。
// 保证替换和卸载时，旧组件的回调可以被调用。

import * as React from 'react';
import { MountContainer } from '.';
import { getRuntimeConfig, RuntimeConfigProvider } from '../../config-provider';
import { renderTo } from './renderTo';

interface ImperativeProps {
  visible?: boolean;
  onClose?: () => void;
  afterClose?: () => void;
  mountContainer?: MountContainer;
}

// React.ReactElement<P>
// 在 React 类型系统中，ReactElement 表示一个 React 元素（JSX 元素）。
// <P> 指定了这个元素的 props 类型
type TargetElement = React.ReactElement<ImperativeProps>;

export interface ImperativeHandler {
  close: () => void;
  replace: (element: TargetElement) => void;
}

// const MyDialog = (props: ImperativeProps) => {
//   return props.visible ? <div>弹窗内容</div> : null;
// };

// const element: TargetElement = <MyDialog visible={false} />

// 命令式地渲染

export const renderImperatively = (element: TargetElement) => {
  const Wrapper = React.forwardRef<ImperativeHandler>((_, ref) => {
    const [visible, setVisible] = React.useState(false);
    const closedRef = React.useRef(false);
    const [elementToRender, setElementToRender] = React.useState(element);
    const keyRef = React.useRef(0);

    React.useEffect(() => {
      if (!closedRef.current) {
        setVisible(true);
      } else {
        afterClose();
      }
    }, []);

    const onClose = () => {
      closedRef.current = true;
      setVisible(false);
      elementToRender.props.onClose?.();
    };

    const afterClose = () => {
      unmount();
      elementToRender.props.afterClose?.();
    };

    React.useImperativeHandle(ref, () => ({
      close: onClose,
      replace: (replacedElement) => {
        keyRef.current += 1;
        elementToRender.props.afterClose?.();
        setElementToRender(replacedElement);
      },
    }));

    return React.cloneElement(elementToRender, {
      ...elementToRender.props,
      key: keyRef.current,
      mountContainer: false,
      visible,
      onClose,
      afterClose,
    });
  });
  const wrapperRef = React.createRef<ImperativeHandler>();

  const unmount = renderTo(
    <RuntimeConfigProvider>
      <Wrapper ref={wrapperRef} />
    </RuntimeConfigProvider>,
    element.props.mountContainer ?? getRuntimeConfig().mountContainer,
  );

  return {
    close: () => {
      if (wrapperRef.current) {
        wrapperRef.current?.close();
      } else {
        unmount();
      }
    },
    replace: (replacedElement) => {
      wrapperRef.current?.replace(replacedElement);
    },
  } as ImperativeHandler;
};
