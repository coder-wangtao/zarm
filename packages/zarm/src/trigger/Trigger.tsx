import includes from 'lodash/includes';
import React, { useEffect } from 'react';
import Events from '../utils/events';
import BaseTriggerProps from './interface';

export type TriggerProps = BaseTriggerProps;

const Trigger: React.FC<TriggerProps> & {
  instanceList: TriggerProps['onClose'][];
  count: number;
} = (props) => {
  const { visible, onClose, disabled = false } = props;

  // execute callback function, KeyboardEvent.keycode was not recommended in MDN.
  const onKeydown = (e: KeyboardEvent) => {
    //  监听键盘 Escape；
    // 只触发 最后一个 Trigger 的关闭回调；
    // 如果该回调有 disabled 标记则不执行。
    if (e.code === 'Escape') {
      const lens = Trigger.instanceList.length;
      const last = Trigger.instanceList[lens - 1];
      if (last) {
        !last.disabled && last();
      }
    }
  };

  useEffect(() => {
    // 管理实例列表
    onClose && (onClose.disabled = disabled);
    if (visible === true && typeof onClose === 'function') {
      if (!includes(Trigger.instanceList, onClose)) {
        Trigger.instanceList.push(onClose);
      }
    } else {
      const index = Trigger.instanceList.findIndex((c) => c === onClose);
      if (index > -1) {
        Trigger.instanceList.splice(index, 1);
      }
    }
  }, [visible, disabled, onClose]);

  useEffect(() => {
    // In the case of multiple Trigger Components, only execute addEventlistener just for once.
    // 首个 Trigger 实例绑定 keydown 事件。
    if (Trigger.count === 0) {
      Events.on(document.body, 'keydown', onKeydown);
    }
    Trigger.count += 1;

    return () => {
      const index = Trigger.instanceList.findIndex((c) => c === onClose);
      if (index > -1) {
        Trigger.instanceList.splice(index, 1);
      }
      Trigger.count -= 1;
      if (Trigger.count === 0) {
        // 当所有 Trigger 卸载后解绑事件，避免多次绑定。
        Events.off(document.body, 'keydown', onKeydown);
      }
    };
  }, []);

  return <>{props.children}</>;
};

Trigger.defaultProps = {
  visible: false,
  disabled: false,
};

Trigger.instanceList = [];
Trigger.count = 0;

export default Trigger;
