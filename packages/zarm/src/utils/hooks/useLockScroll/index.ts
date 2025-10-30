import isFunction from 'lodash/isFunction';
import * as React from 'react';
import { canUseDOM } from '../../dom';

// 在特定条件下锁定页面滚动，常用于模态弹窗、侧边栏等场景。下面我帮你详细解析一下，并给出一个调用示例。
let totalLockCount = 0; // 统计当前有多少组件在“锁定滚动”。
const originalOverflow = canUseDOM ? document.body.style.overflow : ''; // 保存页面原始的 overflow 样式，用于解锁时恢复。

const useLockScroll = (shouldLock: boolean | (() => boolean)) => {
  const lock = () => {
    if (!totalLockCount) {
      // 锁定滚动
      document.body.style.overflow = 'hidden';
    }

    totalLockCount += 1;
  };
  const unlock = () => {
    if (!totalLockCount) return;

    totalLockCount -= 1;

    if (!totalLockCount) {
      document.body.style.overflow = originalOverflow || '';
    }
  };

  React.useEffect(() => {
    if (isFunction(shouldLock) ? shouldLock() : shouldLock) {
      lock();
      return unlock;
    }
  }, [shouldLock]);
};

export default useLockScroll;
