// 基于 BetterScroll 的 React Wheel 组件实现，用于实现滚轮选择器（类似 iOS Picker View）

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

//currentValue 先取defaultValue 再取 value 再取 dataSource[0]