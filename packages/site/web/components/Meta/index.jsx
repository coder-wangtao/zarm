//  React + react-helmet 管理页面 <head> 元信息（title、meta）的组件
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet';

class Meta extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    description: '',
  };

  render() {
    const { title, description } = this.props;
    // <Helmet>
    //   <title>Tom & Jerry</title>
    // </Helmet>
    // 默认会被渲染为：
    // <title>Tom &amp; Jerry</title>
    // 这里 & 被转义为 &amp;。
    // encodeSpecialCharacters={false} 禁止自动转义特殊字符。
    // <Helmet encodeSpecialCharacters={false}>
    //   <title>Tom & Jerry</title>
    // </Helmet>
    // <title>Tom & Jerry</title>
    return (
      <Helmet encodeSpecialCharacters={false}>
        <html lang="zh" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://zarm.design/images/logo.ce68565d.svg" />
      </Helmet>
    );
  }
}

export default Meta;
