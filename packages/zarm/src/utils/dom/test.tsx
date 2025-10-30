import React from 'react';
import { renderImperatively } from './renderImperatively'; // 你提供的函数

// 1️⃣ 定义一个可命令式控制的弹窗组件
const MyDialog = (props: { visible?: boolean; onClose?: () => void; afterClose?: () => void }) => {
  if (!props.visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        zIndex: 1000,
      }}
    >
      <p>这是一个弹窗！</p>
      <button onClick={props.onClose}>关闭</button>
    </div>
  );
};

// 2️⃣ 使用 renderImperatively 命令式渲染弹窗
const App = () => {
  const showDialog = () => {
    // 动态渲染弹窗
    const dialogHandler = renderImperatively(<MyDialog />);

    // 2 秒后自动关闭
    setTimeout(() => {
      dialogHandler.close();
    }, 2000);

    // 4 秒后替换为另一个弹窗
    setTimeout(() => {
      dialogHandler.replace(<MyDialog afterClose={() => console.log('替换后的弹窗关闭了！')} />);
    }, 4000);
  };

  return (
    <div>
      <h1>命令式渲染示例</h1>
      <button onClick={showDialog}>显示弹窗</button>
    </div>
  );
};

export default App;
