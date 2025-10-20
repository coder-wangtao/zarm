import dayjs from 'dayjs';

// // 示例 1：单个日期
// const state1 = parseState({
//   value: new Date('2023-05-10'),
//   mode: 'single',
// });
// console.log(state1);
// // 输出: { value: [ 2023-05-10T00:00:00.000Z ] }

// // 示例 2：日期数组
// const state2 = parseState({
//   value: [new Date('2023-05-15'), new Date('2023-05-10')],
//   mode: 'single',
// });
// console.log(state2);
// // 输出: { value: [ 2023-05-10T00:00:00.000Z, 2023-05-15T00:00:00.000Z ] }
// // 注意数组会自动排序

// // 示例 3：范围模式，使用单个日期作为 value
// const state3 = parseState({
//   value: new Date('2023-05-10'),
//   defaultValue: new Date('2023-05-01'),
//   mode: 'range',
// });
// console.log(state3);
// // 输出: { value: [ 2023-05-01T00:00:00.000Z, 2023-05-10T00:00:00.000Z ] }

// // 示例 4：范围模式，日期数组
// const state4 = parseState({
//   value: [new Date('2023-05-20'), new Date('2023-05-05'), new Date('2023-05-10')],
//   mode: 'range',
// });
// console.log(state4);
// // 输出: { value: [ 2023-05-05T00:00:00.000Z, 2023-05-20T00:00:00.000Z ] }

// // 示例 5：没有 value，使用 defaultValue
// const state5 = parseState({
//   defaultValue: [new Date('2023-06-01'), new Date('2023-06-15')],
//   mode: 'single',
// });
// console.log(state5);
// // 输出: { value: [ 2023-06-01T00:00:00.000Z, 2023-06-15T00:00:00.000Z ] }
// mode 'single' | 'multiple' | 'range';
const parseState = (props: {
  value?: Date | Date[];
  defaultValue?: Date | Date[];
  mode: string;
}) => {
  const { defaultValue, mode } = props;
  let { value } = props;

  let tmpValue: Date[];

  value = value || defaultValue;
  value = Array.isArray(value) ? value : ((value ? [value] : []) as Date[]);
  tmpValue = value
    .map((item: Date) => dayjs(item).toDate())
    .sort((item1: Date, item2: Date) => +item1 - +item2);
  if (mode === 'range') {
    tmpValue = [tmpValue[0], tmpValue[tmpValue.length - 1]];
  }
  return {
    value: tmpValue,
  };
};

export default parseState;
