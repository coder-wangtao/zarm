// 在浏览器端运行 Babel，把含 JSX/ES2015+ 的源码字符串编译成普通的可执行 JS 字符串
import { transform } from '@babel/standalone';
import * as ZarmDesignIcons from '@zarm-design/icons';
import React, { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Panel } from 'zarm';
import enUS from 'zarm/config-provider/locale/en_US';
import zhCN from 'zarm/config-provider/locale/zh_CN';
import 'zarm/style/entry';

export default ({ location, globalContext, children }) => {
  const containerId = `${parseInt(Math.random() * 1e9, 10).toString(36)}`;
  const document = children.match(/([^]*)\n?(```[^]+```)/);
  const title = String(document[1]); // 基本用法
  const containerRef = useRef();

  const renderSource = useCallback(() => {
    const source = document[2].match(/```(.*)\n?([^]+)```/); // 代码逻辑
    import('zarm')
      .then((Element) => {
        const locale = {
          en_US: enUS,
          zh_CN: zhCN,
        };

        const args = [
          'context',
          'React',
          'ReactDOM',
          'Zarm',
          'GlobalContext',
          'Locale',
          'ZarmDesignIcons',
        ];

        // this是undefined 这个 this 被传入只是出于历史或兼容原因，很可能在最早的版本中代码是类组件写法时还用到过。
        const argv = [this, React, ReactDOM, Element, globalContext, locale, ZarmDesignIcons];

        return {
          args,
          argv,
        };
      })
      .then(({ args, argv }) => {
        const renderTpl = `ReactDOM.render(
          <Zarm.ConfigProvider primaryColor={GlobalContext.primaryColor} theme={GlobalContext.theme} locale={Locale[GlobalContext.locale === 'zhCN' ? 'zh_CN' : 'en_US']}>
            $1
          </Zarm.ConfigProvider>,
          document.getElementById('${containerId}'),
        )`;

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

        // const { List, Loading } = Zarm;
        // ReactDOM.render(
        //   <Zarm.ConfigProvider
        //     primaryColor={GlobalContext.primaryColor}
        //     theme={GlobalContext.theme}
        //     locale={Locale[GlobalContext.locale === 'zhCN' ? 'zh_CN' : 'en_US']}
        //   >
        //     <List>
        //       <List.Item title="普通" suffix={<Loading />} />
        //       <List.Item title="大号" suffix={<Loading size="lg" />} />
        //       <List.Item title="无旋转动画" suffix={<Loading loading={false} />} />
        //       <List.Item title="指定百分比" suffix={<Loading loading={false} percent={75} />} />
        //     </List>
        //   </Zarm.ConfigProvider>,
        //   document.getElementById('c1iosj'),
        // );

        const value = source[2]
          // 把 import { Button } from 'zarm'; 转成 const { Button } = Zarm;
          .replace(/import\s+\{\s+([\s\S]*)\s+\}\s+from\s+'react';/, 'const { $1 } = React;')
          .replace(/import\s+\{\s+([\s\S]*)\s+\}\s+from\s+'zarm';/, 'const { $1 } = Zarm;')
          .replace(
            /import\s+\{\s+([\s\S]*)\s+\}\s+from\s+'@zarm-design\/icons';/,
            'const { $1 } = ZarmDesignIcons;',
          )
          .replace(
            /import\s+([\s\S]*)\s+from\s+'@zarm-design\/icons';/,
            'const $1 = ZarmDesignIcons;',
          )
          .replace(
            /import\s+(.*)\s+from\s+'zarm\/lib\/config-provider\/locale\/(.*)';/g,
            "const $1 = Locale['$2'];",
          )
          // 替换格式
          // ReactDOM.render(<Demo />, mountNode);
          .replace(/ReactDOM.render\(\s?([^]+?)(,\s?mountNode\s?\))/g, renderTpl)
          // 替换格式
          // ReactDOM.render(
          //   <>
          //     <Button>default</Button>
          //     <Button theme="primary">primary</Button>
          //   </>,
          //   mountNode,
          // );
          .replace(/ReactDOM.render\(\s?([^]+?)(,([\r\n])(\s)*mountNode,(\s)*\))/g, renderTpl);

        // 这里使用的是浏览器端 Babel (@babel/standalone)，可以即时将 JSX/ES6 转成浏览器可执行的 JS。
        const { code } = transform(value, {
          presets: ['es2015', 'react'],
          plugins: ['proposal-class-properties'],
        });
        args.push(code);

        // 这句相当于创建一个新的作用域执行编译后的 JS 代码，使其能够访问 React、Zarm、GlobalContext 等变量。
        // eslint-disable-next-line
        new Function(...args)(...argv);
        // source[2] = value;
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== 'production') {
          throw err;
        }
      });
  }, [containerId, document, globalContext]);

  useEffect(() => {
    const container = containerRef.current;
    renderSource();

    return function cleanup() {
      // 用于卸载一个已经通过 ReactDOM.render() 挂载到某个 DOM 节点的 React 组件。
      container && ReactDOM.unmountComponentAtNode(container);
    };
  }, [renderSource]);

  // Panel的例子特殊处理
  return location.pathname === '/panel' ? (
    <div id={containerId} ref={containerRef} />
  ) : (
    <Panel title={title}>
      <div id={containerId} ref={containerRef} />
    </Panel>
  );
};
