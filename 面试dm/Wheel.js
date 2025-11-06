// 基于 BetterScroll 的 React Wheel 组件实现，用于实现滚轮选择器（类似 iOS Picker View）
// BScroll.use(WheelPlugin);

const [selectedCity, setSelectedCity] = useState('shanghai');

const cities = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳' },
  { value: 'hangzhou', label: '杭州' },
  { value: 'chengdu', label: '成都' },
  { value: 'xian', label: '西安' },
  { value: 'wuhan', label: '武汉' },
  { value: 'suzhou', label: '苏州' },
];

// 当选择的城市发生变化时更新 state
const handleCityChange = (newValue: string) => {
  setSelectedCity(newValue);
};

<Wheel
  dataSource={cities}
  value={selectedCity}
  onChange={handleCityChange}
  itemRender={(item) => <div>{item.label}</div>} // 自定义渲染每一项
/>;

//1.currentValue 先取defaultValue 再取 value 再取 dataSource[0]

//2.对用户传入的字段名处理
// const userFieldNames = { value: 'id', label: 'name' };
// const fields = resolvedFieldNames(userFieldNames);
// fields = { value: 'id', label: 'name', children: 'children' }

// 3.useSafeLayoutEffect里初始化BScroll
useSafeLayoutEffect(() => {
  let resize;
  heightRef.current = wheelWrapperRef.current?.clientHeight || 0;
  const initIndex = getSelectedIndex(currentValue, dataSource);
  if (wheelWrapperRef.current) {
    scrollInstance.current = new BScroll(wheelWrapperRef.current, {
      wheel: {
        // 初始化时选中的索引。
        selectedIndex: initIndex,
        // 轮子内容容器的 class 名。
        wheelWrapperClass: bem('content'),
        // 每一项的 class 名。
        wheelItemClass: bem('item'),
      },
      // 滚动监听模式：
      // /0：不监听滚动。
      // 1：滚动时触发 scroll 事件（但不频繁）。
      // 2：滚动时触发，较高频率。
      // 3：滚动时高频触发，实时监听滚动位置（常用）。
      probeType: 3,
    });

    if (scrollInstance.current.scroller?.wrapper) {
      resize = new ResizeObserver((entries) => {
        const [entry] = entries || [];
        // 如果高度没有变化，则直接返回
        if (entry.contentRect.height === heightRef.current) return;
        // 更新记录的高度
        heightRef.current = entry.contentRect.height;
        // 刷新滚动实例
        scrollInstance.current?.refresh();
      });
      resize.observe(scrollInstance.current.scroller.wrapper);
    }
  }

  scrollInstance.current?.on('scrollEnd', () => {
    handleScrollEnd();
  });

  return () => {
    resize?.disconnect();
    scrollInstance.current?.destroy();
  };
}, []);
