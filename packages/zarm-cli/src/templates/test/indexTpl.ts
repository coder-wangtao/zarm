export default (compName) => `import * as React from 'react';
import { render } from '@testing-library/react';
import ${compName} from '../index';

describe('${compName}', () => {
  it('should renders correctly', () => {
    const { asFragment } = render(<${compName} />);
    expect(asFragment().firstChild).toMatchSnapshot();
  });
});
`;

// 这个测试的目的是通过渲染组件并将其渲染结果与快照进行比较，确保组件的 UI 渲染在不同的时间点保持一致。
// asFragment() 用于获取渲染后的虚拟 DOM 快照，toMatchSnapshot() 则用于将其与之前存储的快照进行比对。
