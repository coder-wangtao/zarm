// popup
<Trigger visible={visible} onClose={handleEsc}>
  <Mask></Mask>
  <Transition>
    <div>popup传入的内容</div>
  </Transition>
</Trigger>;

// 1.当lockScroll && visible 才锁定滚动
// 进入时：document.body.style.overflow = 'hidden';
// 销毁时：document.body.style.overflow = originalOverflow

// 2.点击遮罩层关闭弹窗，但点击弹窗本身不关闭。

// 1 支持传统dom方式使用
<Popup visible={visible.popTop} direction="top" mask={false} afterClose={() => console.log('关闭')}>
  <div className="popup-box-top">更新成功</div>
</Popup>;

// 2 Popup组件实例挂载 show close
Popup.show();
Popup.close();

// 抄的是antd - mobile;
// 一个命令式渲染工具，让你可以在 React 中像普通 JS API 一样动态创建、关闭、替换组件实例。

const closeFn = new Set();

export const show = (props) => {
  const { content, ...rest } = props;
  const handler = renderImperatively(
    <Popup
      {...rest}
      afterClose={() => {
        closeFn.delete(handler.close);
        props.afterClose?.();
      }}
    >
      {content}
    </Popup>,
  );
  closeFn.add(handler.close);
  return handler;
};

export const close = () => {
  closeFn.forEach((close) => close());
};

// renderImperatively(element)
React.cloneElement(element);

const root = createRoot(container); // container i相当于 document.body
root.render(node); // node === React.cloneElement()
