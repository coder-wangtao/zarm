import type { ComponentClass } from 'react';
import { act } from 'react-dom/test-utils';

// 这个函数会创建一个 Promise，并在微任务队列被刷新后再执行。这通常用于等待 React 的状态更新等微任务完成。
export function flushMicroTasks() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// 这个函数包装了 setTimeout，返回一个 Promise，使得在测试中可以暂停执行，等待指定的毫秒数后继续。
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// waitForComponentToPaint 函数是为了在测试中确保组件完成渲染，尤其是在涉及异步状态更新时。
// 使用 act() 包裹，确保 React 所有异步更新和副作用在进行测试断言之前已完成。
// 通过 setTimeout 等待一定的时间，以确保组件渲染完成，然后调用 component.update() 强制更新组件。
// 这个函数适用于测试需要等待组件完成渲染的场景，尤其是需要保证 UI 变化或状态更新后的测试。
export async function waitForComponentToPaint(component: any, timeout = 50) {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, timeout));
    component.update();
  });
}

let oCreateObjectURL: typeof window.URL.createObjectURL;
export function mockCreateObjectURL(mock: jest.Mock) {
  oCreateObjectURL = window.URL.createObjectURL;
  Object.defineProperty(window.URL, 'createObjectURL', { value: mock });
}
export function mockResetCreateObjectURL() {
  window.URL.createObjectURL = oCreateObjectURL;
}
// 这个函数用于监控和模拟 DOM 元素的原型方法或属性。
// const restore = spyElementPrototypes(HTMLInputElement, {
//   focus: (original, ...args) => {
//     console.log('input.focus called');
//     if (original && original.value) original.value.call(this, ...args);
//   },
//   value: {
//     get: () => 'mocked',
//     set: (orig, val) => console.log('value set to', val),
//   },
// });

// const input = document.createElement('input');
// console.log(input.value); // 'mocked'
// input.focus();            // 'input.focus called'
// input.value = 'abc';      // 'value set to abc'

// restore.mockRestore();    // 恢复原始 behavior
export function spyElementPrototypes(Element, properties) {
  const propNames = Object.keys(properties);
  const originDescriptors = {};

  propNames.forEach((propName) => {
    const originDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, propName);
    originDescriptors[propName] = originDescriptor;

    const spyProp = properties[propName];

    if (typeof spyProp === 'function') {
      // If is a function
      Element.prototype[propName] = function spyFunc(...args) {
        return spyProp.call(this, originDescriptor, ...args);
      };
    } else {
      // Otherwise tread as a property
      Object.defineProperty(Element.prototype, propName, {
        ...spyProp,
        set(value) {
          if (spyProp.set) {
            return spyProp.set.call(this, originDescriptor, value);
          }
          if (originDescriptor && originDescriptor.set) {
            return originDescriptor.set(value);
          }
        },
        get() {
          if (spyProp.get) {
            return spyProp.get.call(this, originDescriptor);
          }
          if (originDescriptor && originDescriptor.get) {
            return originDescriptor.get();
          }
          return null;
        },
      });
    }
  });

  return {
    mockRestore() {
      propNames.forEach((propName) => {
        const originDescriptor = originDescriptors[propName];
        if (typeof originDescriptor === 'function') {
          Element.prototype[propName] = originDescriptor;
        } else {
          Object.defineProperty(Element.prototype, propName, originDescriptor);
        }
      });
    },
  };
}

// 在测试中，对一个 React 类组件的 ref 属性 自动进行 mock，让 ref 指向的对象的某个方法在下一次调用时返回指定值。
// 适用于类组件，因为函数组件没有实例，无法通过 ref 访问方法。
// class MyComponent extends React.Component {
//   myRef = React.createRef<{ fetchData: () => string }>();
//   render() {
//     return <div />;
//   }
// }
// mockRefReturnValueOnce(MyComponent, 'myRef', 'fetchData', 'mocked');
// const comp = new MyComponent();
// comp.myRef = { fetchData: () => 'real' };
// console.log(comp.myRef.fetchData()); // 输出 "mocked"

export function mockRefReturnValueOnce(
  Component: ComponentClass,
  refProp: string,
  method: string,
  value: any,
) {
  const refKey = Symbol(refProp);
  Object.defineProperty(Component.prototype, refProp, {
    get() {
      return this[refKey];
    },
    set(ref) {
      if (ref) {
        jest.spyOn(ref, method).mockReturnValueOnce(value);
      }
      this[refKey] = ref;
    },
    configurable: true,
  });
}
// 一个 React ref 模拟工具（mock）
// const comp = {
//   fetchData: () => 'real data',
// };
// const ref = createFCRefMock('fetchData', 'mock data');
// // 触发 setter
// ref.current = comp;
// // 调用时返回 mock 数据
// console.log(ref.current.fetchData()); // 输出 "mock data"
// 这里 jest.spyOn(comp, 'fetchData') 让 fetchData() 的下一次调用返回 'mock data'，而不是真实的 'real data'。
export function createFCRefMock(method: string, value: any) {
  const ref = { current: {} };
  const refKey = Symbol('ref');
  Object.defineProperty(ref, 'current', {
    set(_ref) {
      if (_ref) {
        // 让这个函数下一次被调用时返回 value
        jest.spyOn(_ref, method).mockReturnValueOnce(value);
      }
      this[refKey] = _ref;
    },
    get() {
      return this[refKey];
    },
  });
  return ref;
}
