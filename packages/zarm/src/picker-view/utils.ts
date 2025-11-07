import omit from 'lodash/omit';
import { toArray } from '../utils';
import type {
  BasePickerViewProps as PickerViewProps,
  PickerColumn,
  PickerColumnItem,
  PickerDataSource,
  PickerOption,
  PickerValue,
} from './interface';
// const userFieldNames = { value: 'id', label: 'name' };
// const fields = resolvedFieldNames(userFieldNames);
// fields = { value: 'id', label: 'name', children: 'children' }

const DEFAULT_FIELD_NAMES = {
  value: 'value',
  label: 'label',
  children: 'children',
};

export const resolvedFieldNames = <T = object>(left: Partial<T> | undefined) => {
  const merged = { ...DEFAULT_FIELD_NAMES };
  left &&
    Object.keys(left).forEach((key) => {
      merged[key] = left?.[key] || DEFAULT_FIELD_NAMES[key];
    });
  return merged;
};

export const isCascader = (dataSource?: PickerDataSource): dataSource is PickerOption[] => {
  return Array.isArray(dataSource) && dataSource[0] && !Array.isArray(dataSource[0]);
};
export const isColumn = (dataSource?: PickerDataSource): dataSource is PickerColumn => {
  return Array.isArray(dataSource) && dataSource[0] && Array.isArray(dataSource[0]);
};

export const isValidValue = (value?: PickerValue | PickerValue[]) => {
  const currentValue = toArray(value);
  return currentValue.some((item) => !!item || item === 0 || item === false);
};

const resolvedValue = (props: PickerViewProps, initialValue?: PickerValue[]) => {
  const { value, defaultValue, wheelDefaultValue } = props;
  if ('value' in props && isValidValue(value)) {
    return toArray(value);
  }

  if ('defaultValue' in props && isValidValue(defaultValue)) {
    return toArray(defaultValue);
  }

  if ('wheelDefaultValue' in props && isValidValue(wheelDefaultValue)) {
    return toArray(wheelDefaultValue);
  }

  return toArray(initialValue);
};

// const dataSource = [
//   [
//     { label: '苹果', value: 'apple' },
//     { label: '香蕉', value: 'banana' },
//     { label: '橙子', value: 'orange' },
//   ],
//   [
//     { label: '红色', value: 'red' },
//     { label: '黄色', value: 'yellow' },
//     { label: '橙色', value: 'orange' },
//   ],
// ];

// const result = resolveColumn({
//   dataSource,
//   value: ['banana'], // 第一列默认选香蕉，第二列未传则取第一项
//   fieldNames: { label: 'label', value: 'value' },
// });

// {
//   value: ['banana', 'red'],   // 第一列选香蕉，第二列默认红色
//   columns: [
//     [
//       { label: '苹果', value: 'apple' },
//       { label: '香蕉', value: 'banana' },
//       { label: '橙子', value: 'orange' }
//     ],
//     [
//       { label: '红色', value: 'red' },
//       { label: '黄色', value: 'yellow' },
//       { label: '橙色', value: 'orange' }
//     ]
//   ],
//   items: [
//     { label: '香蕉', value: 'banana' },
//     { label: '红色', value: 'red' }
//   ]
// }

export const resolveColumn = (props: PickerViewProps) => {
  const columns = toArray(props.dataSource) as PickerColumn;
  const fieldNames = resolvedFieldNames(props.fieldNames);
  const value = resolvedValue(
    props,
    columns.map((item) => item?.[0]?.[fieldNames?.value!]),
  );
  return {
    value,
    columns,
    items: columns.map(
      (column, index) => column.filter((option) => option?.[fieldNames.value] === value[index])[0],
    ),
  };
};

// const dataSource = [
//   {
//     label: '广东省',
//     value: 'gd',
//     children: [
//       { label: '广州', value: 'gz' },
//       { label: '深圳', value: 'sz' },
//     ],
//   },
//   {
//     label: '浙江省',
//     value: 'zj',
//     children: [
//       { label: '杭州', value: 'hz' },
//       { label: '宁波', value: 'nb' },
//     ],
//   },
// ];

// const result = resolveCascade({
//   dataSource,
//   cols: 2, // 省 + 市
//   fieldNames: {
//     // 默认字段名
//     label: 'label',
//     value: 'value',
//     children: 'children',
//   },
//   value: ['zj'], // 默认选中浙江省
// });

// TODO: 输出
// {
//   value: ['zj', 'hz'],  // 浙江省 → 杭州
//   items: [
//     { label: '浙江省', value: 'zj' },
//     { label: '杭州', value: 'hz' }
//   ],
//   columns: [
//     [
//       { label: '广东省', value: 'gd' },
//       { label: '浙江省', value: 'zj' }
//     ],
//     [
//       { label: '杭州', value: 'hz' },
//       { label: '宁波', value: 'nb' }
//     ]
//   ]
// }

const resolveCascade = (props: PickerViewProps) => {
  const { cols } = props;
  const fieldNames = resolvedFieldNames(props.fieldNames);

  const value: PickerValue[] = resolvedValue(props, []);
  const columns: PickerColumn[] = [];
  const items: PickerColumnItem[] = [];
  const traverse = (options: PickerOption[], depth = 0) => {
    columns[depth] = options.map((option, index) => {
      const rest = omit<PickerColumnItem>(option, fieldNames.children) as PickerColumnItem;
      const children = option[fieldNames.children] as PickerOption[] | undefined;
      const currentValue = value[depth];
      if (
        (isValidValue(currentValue) && rest[fieldNames.value] === currentValue) ||
        (!isValidValue(currentValue) && index === 0)
      ) {
        value[depth] = rest[fieldNames.value];
        items[depth] = rest;

        if (Array.isArray(children) && children.length > 0 && depth + 1 < cols!) {
          traverse(children, depth + 1);
        }
      }
      return rest;
    });
  };

  traverse(props.dataSource as PickerOption[]);

  return {
    value,
    items,
    columns,
  };
};

export const resolved = (props: PickerViewProps) => {
  return isCascader(props.dataSource) ? resolveCascade(props) : resolveColumn(props);
};
