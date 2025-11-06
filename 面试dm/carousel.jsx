// 使用@use-gesture/react实现的一个 拖拽滑动（useDrag）
// useDrag 是一个 React Hook，用于监听 拖拽手势事件（鼠标或触摸）。
// 主要做一些边缘逻辑处理
// 1.是否处于正在滚动动画中
// 如果仍在运动中，这里会做“边界检查”
if (onMoving.current) {
  if (activeIndex <= 0) {
    onJumpTo(0);
  } else if (activeIndex >= count - 1) {
    onJumpTo(count - 1);
  }
  onMoving.current = false;
}
// 2.防止用户是否有意地拖拽
if (!state.intentional) {
  return false;
}
// 3.如果轮播图开启了自动播放，那么拖拽时需要暂停播放。
intervalRef.current && window.clearInterval(intervalRef.current);
// 4.判断滑动方向：
// 水平：右滑 → prev（上一张）；左滑 → next（下一张）。
// 垂直：下滑 → prev；上滑 → next。
const action = (!isVertical && offsetX > 0) || (isVertical && offsetY > 0) ? 'prev' : 'next';

// 5.如果没有开启循环（loop = false）：
// 当前在第一张时，不能再往前；
// 当前在最后一张时，不能再往后。

// 6.在拖拽过程中（非 last）执行实时跟随；
// 即时更新元素位置（x/y 平移），无动画延迟（duration=0）。
doTransition({ x: translateXRef.current + offset[0], y: translateYRef.current + offset[1] }, 0);

// 7.判断滑动临界点
// 滑动距离超过0，且滑动距离和父容器长度之比超过moveDistanceRatio
// 滑动释放时间差低于moveTimeSpan

// 8.满足任意一个条件，就认为用户希望翻页：
// 拖拽距离比例超过 moveDistanceRatio（比如 0.3）
// 拖拽时间小于 moveTimeSpan（快速滑动）
if (ratio >= moveDistanceRatio! || elapsedTime <= moveTimeSpan!) {
  activeIndex = action === 'next' ? activeIndex + 1 : activeIndex - 1;
}
// 9.如果启用了循环模式，在首尾页时需要特殊处理动画；兼容1
if (loop && (activeIndex >= count - 1 || activeIndex <= 1)) {
  onMoving.current = true;
}


if (
  !loop &&
  ((action === 'prev' && activeIndex <= 0) || (action === 'next' && activeIndex >= count - 1))
) {
  return false;
}

// 外面用useDrag
<div className={cls} style={style} ref={carouselRef} {...bind()}>
  // 里面是轮播图的每一项
  <div
    ref={carouselItemsRef}
    className={bem('items')}
    onTransitionEnd={transitionEnd}
    // 垂直需要一个高度
    style={itemsStyle}
  >
    {carouselItems}
  </div>
  // 旁边是页面
  {pagination}
</div>;

// carouselItems
// 如果是循环模式 增加头尾拼接节点，节点追加后使用React.Children.map和React.cloneElement 重排key
const newItems = React.Children.map(itemList, (element: any, index) => {
  return React.cloneElement(element, {
    key: index,
    className: bem('item', [element.props.className]),
  });
});

//pagination 根据传入的carouselItems数量 生成角标
Children.map(children, (_child: React.ReactNode, index: number) => {
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

// 轮播组件点击切换时
const onMoveTo = useCallback(
  (index: number, animationDurationNum: number) => {
    const dom = carouselItemsRef.current; // 获取当前轮播容器的 DOM。
    const previousIndex = stateRef.current.activeIndex; // 获取上一次的 activeIndex
    const activeIndexChanged = previousIndex !== index; // 判断当前索引是否发生变化，用于决定是否执行动画。
    // 如果轮播是 循环的，通常在 DOM 上会额外增加一个 前后克隆节点 用于无缝循环。
    // num = 1 表示在计算偏移时要考虑这个额外的克隆节点。
    const num = loop ? 1 : 0; // num = 1 用于在计算位移时偏移这额外的克隆节点。
    const size = getBoundingClientRect(dom); // 获取轮播容器的宽高。
    translateXRef.current = -size.width * (index + num); // 根据索引计算 X/Y 轴偏移量（translate），同时考虑循环克隆节点。
    translateYRef.current = -size.height * (index + num);
    doTransition({ x: translateXRef.current, y: translateYRef.current }, animationDurationNum);

    // 如果超出最大索引，则回到 0。
    // 如果小于 0，则跳到最后一个元素。
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

// transitionEnd动画结束时 此activeIndex = 0 强制没有动画走到最终位置
const transitionEnd = useCallback(() => {
  // 动画结束后的处理逻辑
  onMoving.current = false;
  const { activeIndex, activeIndexChanged } = stateRef.current;
  const dom = carouselItemsRef.current;
  // 循环轮播通常会在开头和结尾增加克隆节点：
  // activeIndex + 1：对应 DOM 中的真实位置（第一个克隆节点后偏移 1）
  // 非循环轮播：直接使用
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

// autoPlay为true开启定时器 
if (!autoPlay || count <= 1) return;
intervalRef.current = window.setInterval(() => {
  !onMoving.current && onSlideTo(stateRef.current.activeIndex + 1);
}, autoPlayIntervalTime);
return () => {
  window.clearInterval(intervalRef.current);
};
