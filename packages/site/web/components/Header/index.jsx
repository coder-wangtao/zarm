import Locales from '@/locale';
import { assets } from '@/site.config';
import Context from '@/utils/context';
import Events from '@/utils/events';
import MenuComponent from '@/web/components/Menu';
import { Search as SearchIcon } from '@zarm-design/icons';
import pkg from '@zarmDir/package.json';
import { Select } from 'antd';
import classnames from 'classnames';
import docsearch from 'docsearch.js';
import 'docsearch.js/dist/cdn/docsearch.min.css';
import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { Icon, Popup, Radio } from 'zarm';
import { Dropdown, Menu } from 'zarm-web';
import 'zarm/style/entry';
import './style.scss';

const initDocSearch = () => {
  docsearch({
    apiKey: '44e980b50447a3a5fac9dc2a4808c439', // 替换成你自己的 Algolia API 密钥
    indexName: 'zarm', // 替换成你在 Algolia 中的索引名称
    inputSelector: '.search input', // 选择器，指向你想要初始化搜索的容器（例如输入框的 ID）
    debug: false, // 可选：启用调试模式，可以帮助你查看调试信息
  });
};

const Icons = Icon.createFromIconfont(assets.iconfont);

const Header = ({ children }) => {
  const searchInput = useRef();
  const location = useLocation();
  const [menu, toggleMenu] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [locale, setLocale] = useState(window.localStorage.locale || 'zhCN');
  const currentPageKey = location.pathname.split('/')[1] || '/';

  const keyupEvent = (event) => {
    if (event.keyCode === 83 && event.target === document.body) {
      // 当按下 'S' 键时，且事件发生在页面的 body 元素上，条件成立。
      searchInput.current.focus();
    }
  };

  const activeClassName = (keys) => {
    return classnames({
      active: keys.indexOf(currentPageKey) > -1,
    });
  };

  const NAV_ITEMS = [
    {
      key: 'docs',
      link: '#/docs',
      title: <FormattedMessage id="app.home.nav.docs" />,
    },
    {
      key: 'components',
      link: '#/components',
      title: <FormattedMessage id="app.home.nav.components" />,
    },
    {
      key: 'design',
      link: '#/design',
      title: <FormattedMessage id="app.home.nav.resources" />,
    },
    { key: 'gitee', link: 'https://zarm.gitee.io', title: '国内镜像' },
  ];

  if (document.location.host.indexOf('gitee') > -1 || locale === 'enUS') {
    NAV_ITEMS.pop();
  }

  useEffect(() => {
    Events.on(document, 'keyup', keyupEvent);
    initDocSearch();

    return () => {
      Events.off(document, 'keyup', keyupEvent);
    };
  }, []);

  const menuRender = currentPageKey !== '/' && (
    <div className="header-icon header-icon-menu">
      {currentPageKey !== 'design' && (
        <>
          <Icons type="menu" onClick={() => toggleMenu(!menu)} />
          <Popup visible={menu} direction="left" onMaskClick={() => toggleMenu(!menu)}>
            <div className="header-menu">
              {/* <div className="header-menu__close"><CloseIcon /></div> */}
              <MenuComponent />
            </div>
          </Popup>
        </>
      )}
    </div>
  );

  const moreRender = (
    <div className="header-icon header-icon-more">
      <Dropdown
        visible={dropdown}
        onVisibleChange={setDropdown}
        direction="bottom"
        content={
          <div className="header-nav">
            <Menu selectedKeys={[currentPageKey]}>
              {NAV_ITEMS.map((item) => (
                <Menu.Item key={item.key}>
                  <a href={item.link}>{item.title}</a>
                </Menu.Item>
              ))}
              <Menu.Item>
                <a
                  href="https://github.com/ZhongAnTech/zarm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </a>
              </Menu.Item>
            </Menu>
          </div>
        }
      >
        <Icons type="more" />
      </Dropdown>
    </div>
  );

  return (
    // locale 属性定义了应用程序的当前语言和区域。
    // messages 属性接受一个包含翻译字符串的对象，这些字符串会在应用中根据当前 locale 来进行替换。
    <IntlProvider locale="zh-CN" messages={Locales[locale]}>
      <Context.Provider value={{ locale }}>
        <header>
          <div className="header-container">
            {menuRender}
            <div className="logo">
              <a href="#/">
                <img alt="logo" src={require('./images/logo.svg')} />
                Zarm
                <sup className="logo-version">v{pkg.version}</sup>
              </a>
            </div>
            {moreRender}
            <nav>
              <div className="search">
                <SearchIcon />
                {/* FormattedMessage组件会根据当前 locale 和提供的 id，自动显示正确的翻译内容。 */}
                <FormattedMessage id="app.home.nav.search">
                  {(txt) => <input placeholder={txt} ref={searchInput} />}
                </FormattedMessage>
              </div>
              <ul>
                {NAV_ITEMS.map((item) => (
                  <li key={item.key}>
                    <a href={item.link} className={activeClassName([item.key])}>
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="version">
                <Select
                  defaultValue=""
                  options={[
                    {
                      value: '',
                      label: pkg.version,
                    },
                    {
                      value: '2x',
                      label: '2.x',
                    },
                    {
                      value: '1x',
                      label: '1.x',
                    },
                  ]}
                  onChange={(version) => {
                    if (version) window.location.href = `https://${version}.zarm.design`;
                  }}
                />
              </div>
              <div className="lang">
                <Radio.Group
                  compact
                  type="button"
                  value={locale}
                  onChange={(value) => {
                    setLocale(value);
                    window.localStorage.locale = value;
                  }}
                >
                  <Radio value="zhCN">中文</Radio>
                  <Radio value="enUS">EN</Radio>
                </Radio.Group>
              </div>
              <a
                className="github"
                href="https://github.com/ZhongAnTech/zarm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icons type="github" />
              </a>
            </nav>
          </div>
        </header>
        {children}
      </Context.Provider>
    </IntlProvider>
  );
};

export default Header;
