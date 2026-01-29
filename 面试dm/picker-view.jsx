// 页面结构
// 内部组件不暴漏（服务于calendar）
// div mask__top
// <Wheel/>
// div mask__bottom
//

// 模拟数据源（省 → 城市级联）
const dataSource = [
  {
    label: '广东省',
    value: 'gd',
    children: [
      { label: '广州', value: 'gz' },
      { label: '深圳', value: 'sz' },
      { label: '佛山', value: 'fs' },
    ],
  },
  {
    label: '浙江省',
    value: 'zj',
    children: [
      { label: '杭州', value: 'hz' },
      { label: '宁波', value: 'nb' },
      { label: '温州', value: 'wz' },
    ],
  },
];


// <div className={bem([className])} style={style}>
//     <div className={bem('content')}>
//         {columns.map((column, index) => (
//           <Wheel
//             key={+index}
//             dataSource={column}
//             value={innerValue?.[index]}
//             fieldNames={fieldNames}
//             itemRender={itemRender ? (item) => itemRender(item, index) : undefined}
//             disabled={disabled}
//             onChange={(selected: WheelValue) => onValueChange(selected, index)}
//             stopScroll={stopScroll}
//           />
//         ))}
//     </div>
//     <div className={bem('mask', [{ top: true }])} />
//     <div className={bem('mask', [{ bottom: true }])} />
//  </div>

<PickerView
  ref={pickerRef}
  dataSource={dataSource}
  defaultValue={['gd', 'gz']}
  onChange={handleChange}
  style={{
    '--wheel-item-height': '40px',
    '--wheel-item-font-size': '16px',
    '--background': '#fff',
  }}
/>;
