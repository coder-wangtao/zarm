import Locales from '@/locale';
import Context from '@/utils/context';
import React, { useContext } from 'react';
import { FormattedMessage, IntlProvider } from 'react-intl';
import './style.scss';

const Footer = () => {
  const { locale } = useContext(Context);
  //
  return (
    <IntlProvider locale="zh-CN" messages={Locales[locale]}>
      <footer>
        <div className="copyright">
          <FormattedMessage id="app.demo.footer.copyright" />
        </div>
      </footer>
    </IntlProvider>
  );
};

export default Footer;
