// 你贴的这段代码是一个 React 错误边界（Error Boundary），结合了 Sentry 用于捕获和上报生产环境的前端错误

import { version } from '@/package.json';
import * as Sentry from '@sentry/browser';
import React, { Component } from 'react';

if (process.env.NODE_ENV === 'production') {
  // 仅在生产环境下初始化 Sentry。
  Sentry.init({
    dsn: 'https://94149d955af0480aaef1edd42fa6c17e@ets.zhongan.io/8',
    release: version,
    environment: 'prd',
  });
}

class SentryBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      eventId: null,
    };
  }

  componentDidCatch(error, errorInfo) {
    // 生产环境：
    //     将错误保存到 state.error。
    //     使用 Sentry.withScope：
    //     setExtras(errorInfo)：附加错误信息（比如组件栈）。
    //     captureException(error)：上报错误并返回事件 ID。
    // 开发环境：
    //     仅打印到控制台，不上报 Sentry。
    if (process.env.NODE_ENV === 'production') {
      this.setState({ error });
      Sentry.withScope((scope) => {
        scope.setExtras(errorInfo);
        const eventId = Sentry.captureException(error);
        this.setState({ eventId });
      });
    } else {
      console.error('SentryBoundary', error, errorInfo);
    }
  }

  render() {
    const { children } = this.props;
    const { error, eventId } = this.state;

    return error ? (
      // 如果捕获到错误：
      // 显示一个按钮，点击会弹出 Sentry 的 用户反馈对话框。
      // 如果没有错误：
      // 正常渲染子组件。
      <button onClick={() => Sentry.showReportDialog({ eventId })}>Report feedback</button>
    ) : (
      children
    );
  }
}

export default SentryBoundary;
