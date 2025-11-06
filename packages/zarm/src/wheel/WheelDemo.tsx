import React, { useState } from 'react';
import Wheel from './Wheel'; // 引入你实现的 Wheel 组件

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

const WheelDemo: React.FC = () => {
  // 当前选择的城市值
  const [selectedCity, setSelectedCity] = useState('shanghai');

  // 当选择的城市发生变化时更新 state
  const handleCityChange = (newValue: string) => {
    setSelectedCity(newValue);
  };

  return (
    <div>
      <h1>请选择城市</h1>
      <Wheel
        dataSource={cities}
        value={selectedCity}
        onChange={handleCityChange}
        itemRender={(item) => <div>{item.label}</div>} // 自定义渲染每一项
      />
      <div>
        <p>当前选择的城市：{cities.find((city) => city.value === selectedCity)?.label}</p>
      </div>
    </div>
  );
};

export default WheelDemo;
