import Context from '@/utils/context';
import { marked } from 'marked';
import React, { useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
// import { NavBar, Radio, Icon } from 'zarm';
import { useLocation } from 'react-router-dom';
import Demo from './Demo';

// # Loading 加载中

// ## 基本用法

// ```jsx
// import { List, Loading } from 'zarm';

// ReactDOM.render(
//   <List>
//     <List.Item title="普通" suffix={<Loading />} />
//     <List.Item title="大号" suffix={<Loading size="lg" />} />
//     <List.Item title="无旋转动画" suffix={<Loading loading={false} />} />
//     <List.Item title="指定百分比" suffix={<Loading loading={false} percent={75} />} />
//   </List>,
//   mountNode,
// );
// ```

// ## 传统菊花状

// ```jsx
// import { List, Loading } from 'zarm';

// ReactDOM.render(
//   <List>
//     <List.Item title="普通" suffix={<Loading type="spinner" />} />
//     <List.Item title="大号" suffix={<Loading type="spinner" size="lg" />} />
//   </List>,
//   mountNode,
// );
// ```

// ## API

// | 属性        | 类型    | 默认值     | 说明                                                       |
// | :---------- | :------ | :--------- | :--------------------------------------------------------- |
// | type        | string  | 'circular' | 指示器类型，可选值 `circular` 圆环状、`spinner` 传统菊花状 |
// | size        | string  | -          | 指示器大小，可选值 `lg`                                    |
// | loading     | boolean | ture       | 圆环指示器是否执行旋转动画                                 |
// | strokeWidth | number  | 5          | 圆环指示器线条宽度                                         |
// | percent     | number  | 20         | 圆环状无动画指示器填充百分比                               |

// ## CSS 变量

// | 属性                         | 默认值                    | 说明                     |
// | :--------------------------- | :------------------------ | :----------------------- |
// | --size                       | '22px'                    | 指示器大小               |
// | --size-large                 | '29px'                    | 大型指示器大小           |
// | --stroke-color               | '#e6e6e6'                 | 指示器轨道颜色           |
// | --stroke-active-color        | 'var(--za-theme-primary)' | 指示器激活色             |
// | --spinner-item-color         | '#80858e'                 | 菊花状指示器花瓣颜色     |
// | --spinner-item-width         | '3px'                     | 菊花状指示器花瓣宽度     |
// | --spinner-item-height        | '32%'                     | 菊花状指示器花瓣长度     |
// | --spinner-item-border-radius | '1.5px'                   | 菊花状指示器花瓣圆角大小 |

export default (props) => {
  const globalContext = useContext(Context);
  const { content } = props;
  const components = new Map();
  const nodeList = [];

  if (typeof content !== 'string') return null;

  const renderDOM = () => {
    // eslint-disable-next-line
    for (const [id, component] of components) {
      const div = document.getElementById(id);
      nodeList.push(div);
      if (div instanceof HTMLElement) {
        ReactDOM.render(component, div);
      }
    }

    // 加载样式
    // const head = document.getElementsByTagName('head')[0];
    // const style = document.createElement('style');
    // style.type = 'text/css';
    // style.appendChild(document.createTextNode(this.style));
    // head.appendChild(style);
  };

  useEffect(() => {
    renderDOM();

    return function cleanup() {
      nodeList.forEach((node) => {
        ReactDOM.unmountComponentAtNode(node);
      });
    };
  });

  // doc.replace(/<style>\s?([^]+?)(<\/style>)/g, (match, p1) => {
  //   style = p1;
  // });

  const html = marked(
    content
      .replace(/## 自定义 Iconfont 图标\s?([^]+)/g, '') // 排除无法展示示例的情况
      .replace(/## API\s?([^]+)/g, '') // 排除API显示
      .replace(/##\s?([^]+?)((?=##)|$)/g, (match, p1) => {
        const id = parseInt(Math.random() * 1e9, 10).toString(36);
        components.set(
          id,
          React.createElement(Demo, { ...props, globalContext, location: useLocation() }, p1),
        );
        return `<div id=${id}></div>`;
      }),
    {
      renderer: new marked.Renderer(),
    },
  );

  return (
    <main dangerouslySetInnerHTML={{ __html: html }} />
    //     <NavBar
    //   style={{ position: 'fixed', top: 0 }}
    //   title={`${data.name} ${data.description}`}
    //   left={leftControl}
    // />
  );
};
