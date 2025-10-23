import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import React from 'react';

function DraggableBox() {
  const [styles, api] = useSpring(() => ({ x: 0, y: 0 }));

  // useDrag 返回一个绑定函数 bind
  const bind = useDrag(({ offset: [x, y] }) => {
    api.start({ x, y }); // 更新动画位置
  });

  return (
    <animated.div
      {...bind()} // 绑定拖拽事件
      style={{
        ...styles,
        width: 100,
        height: 100,
        backgroundColor: 'lightblue',
        touchAction: 'none', // 移动端必备，防止默认滚动
      }}
    />
  );
}

export default DraggableBox;
