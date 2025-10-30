// import React, { useState } from 'react';
// import useLockScroll from './useLockScroll';

// const Modal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
//   // 当 Modal 可见时锁定滚动
//   useLockScroll(visible);

//   if (!visible) return null;

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100vw',
//         height: '100vh',
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}
//       onClick={onClose}
//     >
//       <div style={{ backgroundColor: '#fff', padding: 20 }} onClick={(e) => e.stopPropagation()}>
//         <h3>我是弹窗</h3>
//         <button onClick={onClose}>关闭</button>
//       </div>
//     </div>
//   );
// };

// export const App: React.FC = () => {
//   const [showModal, setShowModal] = useState(false);

//   return (
//     <div style={{ height: 2000, padding: 20 }}>
//       <button onClick={() => setShowModal(true)}>打开 Modal</button>
//       <Modal visible={showModal} onClose={() => setShowModal(false)} />
//       <p>滚动测试：打开 Modal 后页面无法滚动</p>
//     </div>
//   );
// };
