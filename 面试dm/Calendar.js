// 暴露
// 1.组件结构
//   <Header/>
//   <Week/>
//   <monthsContent/>

// 1. Header
// 根据min max日期 生成一个months(一个月范围)
// 根据传入的时间value[0] 或者 当前时间 去获取当前月的索引
// 展示月份，点击展示一个PickerView，然后展示月份选项，点击月份修改当前月份

// 2. Week
// 渲染周一、周二、周三、.....周日

// 3.monthsContent
// 支持水平和垂直模式
// 水平模式 里面用的是<Carousel/>
// Carousel里的每一项是Month组件(Month组件展示每月的30天)

// 垂直模式 里面用的是直接展示Month组件(Month组件展示每月的30天)
// 里面是还有一个<Transition/>
// Transition里面的逻辑：它会在用户滚动 scrollBodyRef 对应的容器时，计算当前显示的“元素”（对应某个日期），然后更新状态 setScrollDate，显示当前滚动到的日期。
// 初始挂载的时候会根据用户传进来的月份，调用scrollIntoView

// 4.Month组件
// 处理用户点击
// mode === 'range' => value[currentStep - 1] = date
// mode === 'multiple' => value.push(date)
// mode === 'default' => value[currentStep - 1] = date;

// 日期禁用（日期小于min || 大于max禁用 || 调用用户传进来disabledDate返回true）
const isDisabled = useCallback(
  (date) => {
    return (
      dayjs(date).isBefore(dayjs(min), 'day') ||
      dayjs(date).isAfter(dayjs(max), 'day') ||
      (typeof disabledDate === 'function' && disabledDate(date))
    );
  },
  [min, max, disabledDate],
);

// 日期选中
const isSelected = useCallback(
  (date) => {
    const currentDate = dayjs(date);
    return mode === 'single'
      ? value[0] && currentDate.isSame(dayjs(value[0]), 'day')
      : // 用于检测数组中 是否至少有一个元素满足指定条件
        value.some((item) => (item ? currentDate.isSame(dayjs(item), 'day') : false));
  },
  [mode, value],
);

// 处理一个时间间隔
const range = useCallback(
  (date) => {
    if (mode !== 'range') {
      return '';
    }
    const currentDate = dayjs(date);
    const start = value[0];
    const end = value[value.length - 1];
    if (currentDate.isAfter(dayjs(start)) && currentDate.isBefore(dayjs(end))) {
      return 'range';
    }
    if (value.length > 1 && !dayjs(start).isSame(dayjs(end))) {
      if (currentDate.isSame(dayjs(start), 'day') && start) {
        return 'start';
      }
      if (currentDate.isSame(dayjs(end), 'day') && end) {
        return 'end';
      }
    }
    return '';
  },
  [mode, value],
);
