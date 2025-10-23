import { useDrag } from '@use-gesture/react';
import { createBEM } from '@zarm-design/bem';
import type { CSSProperties } from 'react';
import React, {
  Children,
  cloneElement,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ConfigContext } from '../config-provider';
import { getBoundingClientRect } from '../utils/dom';
import Events from '../utils/events';
import type { HTMLProps } from '../utils/utilityTypes';
import type { BaseCarouselProps } from './interface';

export interface CarouselCssVars {
  '--pagination-margin'?: React.CSSProperties['right' | 'bottom'];
  '--pagination-item-width'?: React.CSSProperties['width'];
  '--pagination-item-height'?: React.CSSProperties['height'];
  '--pagination-item-border-radius'?: React.CSSProperties['borderRadius'];
  '--pagination-item-spacing'?: React.CSSProperties['marginRight'];
  '--pagination-item-background'?: React.CSSProperties['background'];
  '--pagination-item-active-background'?: React.CSSProperties['background'];
}

export type CarouselProps = BaseCarouselProps & HTMLProps<CarouselCssVars>;

export interface CarouselHTMLElement extends HTMLDivElement {
  onJumpTo: (index: number) => void;
  onSlideTo: (index: number) => void;
}

interface Offset {
  x: number;
  y: number;
}

interface StateProps {
  activeIndex: number;
  activeIndexChanged: boolean;
}

// 用户向左滑动到克隆节点（Item3）：
// 动画显示克隆节点，用户感觉无缝滚动
// 动画结束后，程序 立即把索引切回真实 Item3，位置瞬移但用户看不到
// 用户向右滑动到克隆节点（Item0）：
// 同理，动画显示克隆节点，结束后切回真实 Item0

const Carousel = forwardRef<CarouselHTMLElement, CarouselProps>((props, ref) => {
  // props CarouselProps
  // CarouselHTMLElement
  const { prefixCls } = React.useContext(ConfigContext);

  const bem = createBEM('carousel', { prefixCls });

  const {
    className,
    height,
    style,
    children,
    direction,
    loop,
    onChangeEnd,
    onChange,
    autoPlay,
    autoPlayIntervalTime,
    swipeable,
    animationDuration,
    activeIndex: propActiveIndex,
    showPagination,
    moveDistanceRatio,
    moveTimeSpan,
  } = props;

  // 为什么要同时用
  // 如果只用 useState：
  // 拖拽或动画中，索引和标志频繁变化 → 每次更新都会触发渲染 → 性能损耗大。
  // 内部逻辑需要快速读取最新索引（比如拖拽计算），但不想每次渲染 → useState 无法做到不触发渲染。
  // 如果只用 useRef：
  // UI 不会更新 → React 不知道轮播项索引变了 → 页面不会显示最新滑块。
  // 所以两者结合：
  // useRef：内部逻辑和标志管理。
  // useState：驱动 UI 渲染，且只在需要显示变化时触发。
  // TODO: 搞定
  const stateRef = useRef<StateProps>({
    activeIndex: propActiveIndex!,
    activeIndexChanged: false,
  });
  // TODO: 搞定
  const [activeIndexState, setActiveIndexState] = useState(stateRef.current.activeIndex);
  // TODO: 搞定
  const updateRef = useRef((state: StateProps) => {
    stateRef.current = state;
    setActiveIndexState(state.activeIndex);
  });

  // TODO: 搞定
  const isVertical = direction === 'vertical';
  // TODO: 搞定
  const carouselRef = (ref as any) || React.createRef<CarouselHTMLElement>();
  // TODO: 搞定
  const carouselItemsRef = useRef<HTMLDivElement>(null);
  // TODO: 搞定
  const translateXRef = useRef(0);
  const translateYRef = useRef(0);
  // TODO: 搞定
  const count = useMemo(() => Children.count(children), [children]);

  // 处理节点（首尾拼接）
  // TODO: 搞定
  const carouselItems = useMemo(() => {
    if (children == null || children.length === 0) {
      return;
    }
    // 增加头尾拼接节点
    const itemList = [...children];
    const firstItem = itemList[0];
    const lastItem = itemList[itemList.length - 1];

    if (loop) {
      itemList.push(firstItem);
      itemList.unshift(lastItem);
    }

    // 节点追加后重排key
    const newItems = React.Children.map(itemList, (element: any, index) => {
      return cloneElement(element, {
        key: index,
        className: bem('item', [element.props.className]),
      });
    });
    return newItems;
  }, [children]);

  // 执行过渡动画
  // TODO: 搞定
  const doTransition = useCallback(
    (offset: Offset, animationDurationNum: number) => {
      const dom = carouselItemsRef.current;
      let x = 0;
      let y = 0;

      if (!isVertical) {
        ({ x } = offset);
      } else {
        ({ y } = offset);
      }
      dom!.style.transitionDuration = `${animationDurationNum}ms`;
      dom!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    },
    [isVertical],
  );
  // TODO: 搞定
  const onMoving = useRef(false);

  // TODO: 搞定
  const transitionEnd = useCallback(() => {
    // 动画结束后的处理逻辑
    onMoving.current = false;
    const { activeIndex, activeIndexChanged } = stateRef.current;
    const dom = carouselItemsRef.current;
    // 循环轮播通常会在开头和结尾增加克隆节点：
    // activeIndex + 1：对应 DOM 中的真实位置（第一个克隆节点后偏移 1）
    // 非循环轮播：直接使用 activeIndex
    const index = loop ? activeIndex + 1 : activeIndex;
    const size = getBoundingClientRect(dom);
    translateXRef.current = -size.width * index;
    translateYRef.current = -size.height * index;
    // 强制移动到最终位置（无动画）
    doTransition({ x: translateXRef.current, y: translateYRef.current }, 0);

    if (activeIndexChanged) {
      onChangeEnd?.(activeIndex);
    }
  }, [loop, doTransition, onChangeEnd]);

  // 移动到指定编号
  // TODO: 搞定
  const onMoveTo = useCallback(
    (index: number, animationDurationNum: number) => {
      const dom = carouselItemsRef.current;
      const previousIndex = stateRef.current.activeIndex;
      const activeIndexChanged = previousIndex !== index;
      // 如果轮播是 循环的，通常在 DOM 上会额外增加一个 前后克隆节点 用于无缝循环。
      // num = 1 表示在计算偏移时要考虑这个额外的克隆节点。
      const num = loop ? 1 : 0;
      const size = getBoundingClientRect(dom);
      translateXRef.current = -size.width * (index + num);
      translateYRef.current = -size.height * (index + num);
      doTransition({ x: translateXRef.current, y: translateYRef.current }, animationDurationNum);

      if (index > count - 1) {
        index = 0;
      } else if (index < 0) {
        index = count - 1;
      }

      updateRef.current({
        activeIndex: index,
        activeIndexChanged,
      });
      if (activeIndexChanged) {
        onChange?.(index);
      }
    },
    [children, doTransition, loop, onChange],
  );

  // TODO: 搞定
  // 滑动到指定编号
  const onSlideTo = useCallback(
    (index: number) => {
      onMoveTo(index, animationDuration!);
    },
    [onMoveTo, animationDuration],
  );

  // TODO: 搞定
  // 静默跳到指定编号
  const onJumpTo = useCallback(
    (index: number) => {
      onMoveTo(index, 0);
    },
    [onMoveTo],
  );

  // 更新窗口变化的位置偏移
  // TODO: 搞定
  const resize = useCallback(() => {
    onJumpTo(stateRef.current.activeIndex);
  }, [onJumpTo]);

  const intervalRef = useRef<number>();

  // 你这段代码是用 @use-gesture/react（或类似库）实现的一个 拖拽滑动（useDrag）逻辑，通常用于轮播图（carousel）中。
  // useDrag 是一个 React Hook，用于监听 拖拽手势事件（鼠标或触摸）。
  // 它返回一个函数（bind），可以绑定到 DOM 元素上，例如 <div {...bind()}>。
  // 回调函数的参数 state 包含当前拖拽手势的所有状态
  const bind = useDrag(
    (state) => {
      // 这里 state 包含了当前拖拽的状态，例如：
      // offset: 当前拖拽的累计偏移量（x, y）。
      // last: 是否是“最后一次拖拽事件”（即释放手指或鼠标）。
      // intentional: 用户是否有意地拖拽（防止误触，比如轻轻滑动一下不算）。
      // elapsedTime: 当前拖拽持续的时间（ms）。
      let { activeIndex } = stateRef.current; // 前活跃的 slide 下标
      // 是否处于正在滚动动画中
      // 如果仍在运动中，这里会做“边界检查”
      if (onMoving.current) {
        if (activeIndex <= 0) {
          onJumpTo(0);
        } else if (activeIndex >= count - 1) {
          onJumpTo(count - 1);
        }
        onMoving.current = false;
      }
      if (!state.intentional) {
        return false;
      }
      // 如果轮播图开启了自动播放，那么拖拽时需要暂停播放。
      intervalRef.current && window.clearInterval(intervalRef.current);

      // 从拖拽状态中取出偏移量和持续时间。
      const { offset, elapsedTime } = state;

      const [offsetX, offsetY] = offset;
      const index = isVertical ? 1 : 0;
      if (!offset[index]) {
        return false;
      }

      // 判断滑动方向：
      // 水平：右滑 → prev（上一张）；左滑 → next（下一张）。
      // 垂直：下滑 → prev；上滑 → next。
      const action = (!isVertical && offsetX > 0) || (isVertical && offsetY > 0) ? 'prev' : 'next';

      // 如果没有开启循环（loop = false）：
      // 当前在第一张时，不能再往前；
      // 当前在最后一张时，不能再往后。
      if (
        !loop &&
        ((action === 'prev' && activeIndex <= 0) || (action === 'next' && activeIndex >= count - 1))
      ) {
        return false;
      }

      if (state.last) {
        // 当用户松开手指时（last === true）才会进入此逻辑。
        const dom = carouselItemsRef.current;
        // 拿到轮播容器的尺寸信息（宽度或高度）。
        const size = getBoundingClientRect(dom);

        // 计算拖拽偏移量与容器长度的比例。
        // 比如水平滑动 200px，而容器宽 400px → ratio = 0.5
        const ratio = !isVertical
          ? Math.abs(offsetX / size.width)
          : Math.abs(offsetY / size.height);
        // 判断滑动临界点
        // 1.滑动距离超过0，且滑动距离和父容器长度之比超过moveDistanceRatio
        // 2.滑动释放时间差低于moveTimeSpan

        // 满足任意一个条件，就认为用户希望翻页：
        // 拖拽距离比例超过 moveDistanceRatio（比如 0.3）
        // 拖拽时间小于 moveTimeSpan（快速滑动）
        if (ratio >= moveDistanceRatio! || elapsedTime <= moveTimeSpan!) {
          activeIndex = action === 'next' ? activeIndex + 1 : activeIndex - 1;
        }
        // 如果启用了循环模式，在首尾页时需要特殊处理动画；
        // 设置 onMoving.current = true 表示需要在动画结束后修正位置。
        if (loop && (activeIndex >= count - 1 || activeIndex <= 1)) {
          onMoving.current = true;
        }
        // 执行滑动到新的页面；
        // 返回 false 阻止默认行为。
        onSlideTo(activeIndex);
        return false;
      }
      // 在拖拽过程中（非 last）执行实时跟随；
      // 即时更新元素位置（x/y 平移），无动画延迟（duration=0）。
      doTransition(
        { x: translateXRef.current + offset[0], y: translateYRef.current + offset[1] },
        0,
      );
    },
    {
      from: () => [0, 0], // 初始偏移
      enabled: swipeable, // 是否允许拖拽
      axis: isVertical ? 'y' : 'x', // 拖拽轴
      pointer: { touch: true }, // 支持触摸
      preventScroll: !isVertical, // 禁止滚动（非垂直时）
      triggerAllEvents: true, // 触发所有事件
    },
  );

  // TODO: 搞定
  useEffect(() => {
    // 如果 autoPlay 为 false，说明关闭自动播放，直接退出。
    // 如果 count <= 1，只有一张图也没必要轮播，也直接退出。
    if (!autoPlay || count <= 1) return;
    intervalRef.current = window.setInterval(() => {
      !onMoving.current && onSlideTo(stateRef.current.activeIndex + 1);
    }, autoPlayIntervalTime);
    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [autoPlay, autoPlayIntervalTime, loop, onSlideTo, stateRef.current.activeIndex]);

  useEffect(() => {
    // 监听窗口变化
    Events.on(window, 'resize', resize);
    // 设置起始位置编号
    onJumpTo(propActiveIndex!);

    return () => {
      // 移除监听窗口变化
      Events.off(window, 'resize', resize);
    };
  }, [onJumpTo, onSlideTo, propActiveIndex, resize, transitionEnd]);

  // TODO: 搞定
  // 是将子组件的内部逻辑（如函数或状态）暴露给父组件，而无需公开整个组件实例或 DOM 节点。
  useImperativeHandle(carouselRef, () => {
    return {
      onJumpTo: (index: number) => {
        onJumpTo(index);
      },
      onSlideTo: (index: number) => {
        onSlideTo(index);
      },
    };
  });

  // TODO: 搞定
  const pagination = useMemo(() => {
    if (!showPagination) return null;
    const paginationItems = Children.map(children, (_child: React.ReactNode, index: number) => {
      return (
        <div
          key={`pagination-${+index}`}
          className={bem('pagination__item', [
            {
              active: index === activeIndexState,
            },
          ])}
          onClick={() => onSlideTo(index)}
        />
      );
    });

    return <div className={bem('pagination')}>{paginationItems}</div>;
  }, [showPagination, children, activeIndexState]);

  // TODO: 搞定
  const cls = bem([
    {
      horizontal: !isVertical,
      vertical: isVertical,
    },
    className,
  ]);
  // TODO: 搞定
  const itemsStyle: CSSProperties = {};
  if (isVertical) {
    itemsStyle.height = height;
  }

  return (
    <div className={cls} style={style} ref={carouselRef} {...bind()}>
      <div
        ref={carouselItemsRef}
        className={bem('items')}
        onTransitionEnd={transitionEnd}
        // 垂直需要一个高度
        style={itemsStyle}
      >
        {carouselItems}
      </div>
      {pagination}
    </div>
  );
});

Carousel.displayName = 'Carousel';

Carousel.defaultProps = {
  direction: 'horizontal',
  height: 160,
  loop: false,
  activeIndex: 0,
  animationDuration: 500,
  swipeable: true,
  autoPlay: false,
  autoPlayIntervalTime: 3000,
  moveDistanceRatio: 0.5,
  moveTimeSpan: 300,
  showPagination: true,
};

export default Carousel;
