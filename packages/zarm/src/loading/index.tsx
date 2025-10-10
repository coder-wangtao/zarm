import { createBEM } from '@zarm-design/bem';
import * as React from 'react';
import { ConfigContext } from '../config-provider';
import type { HTMLProps } from '../utils/utilityTypes';
import type { BaseLoadingProps } from './interface';

export interface LoadingCssVars {
  '--size'?: React.CSSProperties['width' | 'height'];
  '--size-large'?: React.CSSProperties['width' | 'height'];
  '--stroke-color'?: React.CSSProperties['stroke'];
  '--stroke-active-color'?: React.CSSProperties['stroke'];
  '--spinner-item-color'?: React.CSSProperties['color'];
  '--spinner-item-width'?: React.CSSProperties['width'];
  '--spinner-item-height'?: React.CSSProperties['height'];
  '--spinner-item-border-radius'?: React.CSSProperties['borderRadius'];
}

export type LoadingProps = BaseLoadingProps &
  HTMLProps<LoadingCssVars> & {
    onClick?: React.MouseEventHandler<HTMLDivElement>;
  };

const DIAMETER = 62;

const Circular = React.forwardRef<HTMLDivElement, LoadingProps>((props, ref) => {
  const { className, size, percent, strokeWidth, loading, ...restProps } = props;
  const { prefixCls } = React.useContext(ConfigContext);
  const bem = createBEM('loading', { prefixCls });

  const cls = bem([
    {
      circular: loading,
      [`${size}`]: !!size,
    },
    className,
  ]);

  const half = DIAMETER / 2; // 31
  const r = half - (strokeWidth as number) / 2;

  if (loading) {
    return (
      <div className={cls} {...restProps} ref={ref}>
        {/* <viewBox="min-x min-y width height"> */}
        {/* 
          min-x：视口左上角的水平位置，定义了在 x 轴上从哪里开始显示。
          min-y：视口左上角的垂直位置，定义了在 y 轴上从哪里开始显示。
          width：视口的宽度，表示 SVG 在显示时的宽度（可以是单位，通常是 px）。
          height：视口的高度，表示 SVG 在显示时的高度。 
          // 所以，viewBox="31 31 62 62" 表示从 (31, 31) 开始，宽度和高度为 62 的区域会被用作 SVG 的显示区域。
        */}
        <svg viewBox={`${DIAMETER / 2} ${DIAMETER / 2} ${DIAMETER} ${DIAMETER}`}>
          {/* cx 和 cy 是圆心的坐标，分别是圆的 x 和 y 坐标。在这个例子中，它们都被设置为 DIAMETER，使得圆形的中心位于 SVG 的右下角。 */}
          {/* r 是圆的半径，这里它是一个动态值，等于 half - strokeWidth / 2（half 是 DIAMETER / 2），表示圆的半径，减去一定的边框宽度（strokeWidth）。 */}
          {/* fill="none" 表示圆形的填充颜色是透明的，因此它只显示边框。 */}
          {/* style={{ strokeWidth }}：style 用于给 SVG 元素添加内联样式，这里设置了 strokeWidth，即圆形边框的宽度。 */}
          <circle cx={DIAMETER} cy={DIAMETER} r={r} fill="none" style={{ strokeWidth }} />
        </svg>
      </div>
    );
  }

  const round = 2 * Math.PI * r;
  const lineStyle = {
    strokeDasharray: `${(round * (percent as number)) / 100} ${round}`,
    strokeWidth,
  };

  return (
    <div className={cls} {...restProps} ref={ref}>
      <svg viewBox={`0 0 ${DIAMETER} ${DIAMETER}`}>
        <circle
          className={bem('stroke')}
          cx={half}
          cy={half}
          r={r}
          fill="none"
          style={{ strokeWidth }}
        />
        <circle className={bem('line')} cx={half} cy={half} r={r} fill="none" style={lineStyle} />
      </svg>
    </div>
  );
});

Circular.displayName = 'Circular';

const Spinner = React.forwardRef<HTMLDivElement, LoadingProps>((props, ref) => {
  const { className, size, ...restProps } = props;
  const { prefixCls } = React.useContext(ConfigContext);
  const bem = createBEM('loading', { prefixCls });

  const cls = bem([
    {
      spinner: true,
      [`${size}`]: !!size,
    },
    className,
  ]);

  const spinner: React.ReactElement[] = [];

  for (let i = 0; i < 9; i++) {
    spinner.push(<div key={i} />);
  }

  return (
    <div ref={ref} className={cls} {...restProps}>
      {spinner}
    </div>
  );
});

Spinner.displayName = 'Spinner';

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>((props, ref) => {
  if (props.type !== 'spinner') {
    const { type, ...restProps } = props;
    return <Circular ref={ref} {...restProps} />;
  }
  const { strokeWidth, percent, loading, type, ...restProps } = props;
  return <Spinner ref={ref} {...restProps} />;
});

Loading.defaultProps = {
  type: 'circular',
  loading: true,
  strokeWidth: 5,
  percent: 20,
};

Loading.displayName = 'Loading';

export default Loading;
