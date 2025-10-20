import { createBEM } from '@zarm-design/bem';
import { ArrowLeft, ArrowRight } from '@zarm-design/icons';
import dayjs from 'dayjs';
import React, { useContext, useState } from 'react';
import { ConfigContext } from '../config-provider';
import PickerView from '../picker-view';
import parseDataSource from './utils/parseDataSource';

interface HeaderProps {
  months: Date[];
  currentMonth: number;
  changeMonth: Function;
}

function Header(props: HeaderProps) {
  const { prefixCls, locale: globalLocal } = useContext(ConfigContext);
  const locale = globalLocal?.Calendar;

  const bem = createBEM('calendar', { prefixCls });

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const { changeMonth, months, currentMonth } = props;

  // 根据传过的value[0] 匹配到 当前月
  const current = months[currentMonth] || new Date();
  const year = current.getFullYear();
  const month = current.getMonth();
  //
  const title = dayjs().year(year).month(month).format(globalLocal?.Calendar?.yearMonthFormat);
  //   {
  //     "value": 2022,
  //     "label": 2022,
  //     "children": [
  //         {
  //             "value": 4,
  //             "label": "5月"
  //         },
  //         {
  //             "value": 5,
  //             "label": "6月"
  //         },
  //         {
  //             "value": 6,
  //             "label": "7月"
  //         },
  //         {
  //             "value": 7,
  //             "label": "8月"
  //         },
  //         {
  //             "value": 8,
  //             "label": "9月"
  //         },
  //         {
  //             "value": 9,
  //             "label": "10月"
  //         }
  //     ]
  // }
  const dataSource = parseDataSource(months, locale);
  const currentValue = [year, month];

  // 根据日期修改外面的月份
  const dateChange = (value) => {
    const day = dayjs().year(value[0]).month(value[1]);
    const index = months.findIndex((i) => {
      return dayjs(i).isSame(day, 'month');
    });
    changeMonth(index);
  };

  return (
    <>
      <div className={bem('header')}>
        <div
          className={bem('title', [
            {
              animate: showDatePicker,
            },
          ])}
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          {title}
          <ArrowRight theme="primary" size="sm" />
        </div>
        <div className={bem('action')}>
          <ArrowLeft
            theme="primary"
            className={bem('action-btn', [
              {
                disabled: currentMonth === 0,
              },
            ])}
            onClick={() => {
              if (currentMonth > 0) {
                changeMonth(currentMonth - 1);
              }
            }}
          />
          <ArrowRight
            theme="primary"
            className={bem('action-btn', [
              {
                disabled: currentMonth >= months.length - 1,
              },
            ])}
            onClick={() => {
              if (currentMonth < months.length - 1) {
                changeMonth(currentMonth + 1);
              }
            }}
          />
        </div>
      </div>
      {showDatePicker ? (
        // TODO: PickerView待定
        <PickerView
          dataSource={Object.values(dataSource)}
          value={currentValue}
          onChange={dateChange}
        />
      ) : null}
    </>
  );
}

export default React.memo(Header);
