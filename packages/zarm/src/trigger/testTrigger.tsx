import React, { useState } from 'react';
import Trigger from './Trigger';

const App: React.FC = () => {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  return (
    <div style={{ padding: 20 }}>
      <h2>Trigger 示例</h2>

      {/* 打开 Trigger 的按钮 */}
      <button onClick={() => setOpen1(true)}>打开 Trigger 1</button>
      <button onClick={() => setOpen2(true)}>打开 Trigger 2</button>

      {/* Trigger 1 */}
      <Trigger
        visible={open1}
        onClose={() => {
          alert('Trigger 1 已关闭');
          setOpen1(false);
        }}
      >
        {open1 && (
          <div style={{ marginTop: 20, padding: 10, backgroundColor: '#f0f0f0' }}>
            Trigger 1 内容 (按 Escape 关闭)
          </div>
        )}
      </Trigger>

      {/* Trigger 2 */}
      <Trigger
        visible={open2}
        disabled={true} // 这个 Trigger 被禁用，不会被 Escape 关闭
        onClose={() => {
          alert('Trigger 2 已关闭');
          setOpen2(false);
        }}
      >
        {open2 && (
          <div style={{ marginTop: 20, padding: 10, backgroundColor: '#d0f0d0' }}>
            Trigger 2 内容 (被禁用，按 Escape 不关闭)
          </div>
        )}
      </Trigger>
    </div>
  );
};

export default App;
