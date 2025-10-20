import { createBEM } from '@zarm-design/bem';
import dayjs from 'dayjs';
import React, {
  forwardRef,
  isValidElement,
  ReactNode,
  useCallback,
  useContext,
  useImperativeHandle,
  useRef,
} from 'react';
import { ConfigContext } from '../config-provider';
import { BaseCalendarMonthProps } from './interface';

export type CalendarMonthProps = BaseCalendarMonthProps & React.HTMLAttributes<HTMLElement>;

const CalendarMonthView = forwardRef<any, CalendarMonthProps>((props, ref) => {
  const { dateRender, min, max, disabledDate, onDateClick, dateMonth, value, mode } = props;
  const { prefixCls, locale: globalLocal } = useContext(ConfigContext);

  // "Monday"
  const weekStartsOn = globalLocal?.Calendar.weekStartsOn;

  const bem = createBEM('calendar', { prefixCls });

  const monthRef = useRef<any>();

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

  const hanlerDateClick = useCallback(
    (date) => {
      if (!isDisabled(date) && typeof onDateClick === 'function') {
        onDateClick(date);
      }
    },
    [onDateClick],
  );

  const renderDay = (day: number, year: number, month: number, firstDay: number): ReactNode => {
    const date = new Date(year, month, day);
    const dayjsDate = dayjs(date);
    const isToday = dayjs().isSame(dayjsDate, 'day');
    let text: string | ReactNode = '';
    if (typeof dateRender === 'function') {
      text = dateRender(date, value);
      if (typeof text === 'object' && !isValidElement(text)) {
        console.warn('dateRender函数返回数据类型错误，请返回基本数据类型或者reactNode');
        text = '';
      }
    }

    // firstDay 就是设置首行的样式 偏移量
    const style =
      day === 1
        ? {
            marginLeft: `${14.28571 * firstDay}%`,
          }
        : {};

    const rangeStatus = range(date);
    const className = bem('day', [
      {
        disabled: isDisabled(date), // 是否禁用
        today: isToday, // false
        selected: isSelected(date) && rangeStatus !== 'range', // 不是rang 并选中
        range: rangeStatus === 'range', // 范围模式 开始和结束中间的
        d6: (day + firstDay) % 7 === 0 && !!rangeStatus, // 范围模式 周日
        d7: (day + firstDay) % 7 === 1 && !!rangeStatus, // 范围模式 周一
        start: rangeStatus === 'start', // 范围 开始
        end: rangeStatus === 'end', // 范围 结束
        last: rangeStatus === 'end' && (day === 1 || (day + firstDay) % 7 === 1), // 范围模式 当前月的最后一天
        first:
          rangeStatus === 'start' &&
          (dayjsDate.daysInMonth() === day || (day + firstDay) % 7 === 0), // 范围模式 当前月的第一天
      },
    ]);
    return (
      <li
        key={`${year}-${month}-${day}`}
        className={className}
        style={style}
        onClick={() => hanlerDateClick(date)}
      >
        {(text && <div className={bem('day__content')}>{text}</div>) || ''}
      </li>
    );
  };

  const renderDays = (year: number, month: number): ReactNode[] => {
    // .date(1)：设置日期为 1 号，也就是把这个日期对象改成当月的第一天。
    const date = dayjs().year(year).month(month).date(1);
    const daysInMonth = date.daysInMonth();
    let firstDay = date.day(); // 返回当月第一天星期几，值是 0~6：
    // 星期日不是第一天
    // 一周从 星期一开始
    // 如果 firstDay === 0（原本是星期日）
    // → 调整为 0 + 6 = 6
    // → 放到一周的最后一天（星期日成为第 7 列）

    // 否则 firstDay - 1
    // → 原来的星期一（1）变 0（第一列）
    // → 星期二（2）变 1
    // → …
    // → 星期六（6）变 5
    if (weekStartsOn !== 'Sunday') {
      firstDay = firstDay === 0 ? firstDay + 6 : firstDay - 1;
    }
    const days: ReactNode[] = [];
    let i = 1;
    while (i <= daysInMonth) {
      days.push(renderDay(i, year, month, firstDay));
      i += 1;
    }
    return days;
  };

  useImperativeHandle(ref, () => {
    return {
      el: () => {
        return monthRef.current;
      },
    };
  });

  const year = dateMonth.getFullYear();
  const month = dateMonth.getMonth();
  const monthKey = `${year}-${month}`;
  const title = dayjs().year(year).month(month).format(globalLocal?.Calendar?.yearMonthFormat);

  return (
    <div key={monthKey} className={bem('month__wrapper')} ref={monthRef} title={title}>
      <div className={bem('month')}>{title}</div>
      <ul>{renderDays(year, month)}</ul>
    </div>
  );
});

CalendarMonthView.defaultProps = {
  value: [],
  dateMonth: new Date(),
  min: new Date(),
  max: new Date(),
  dateRender: (date: Date) => date.getDate(),
  disabledDate: () => false,
};

export default React.memo(CalendarMonthView);
