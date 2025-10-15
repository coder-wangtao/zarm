import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './style.scss';

const App = () => {
  return (
    <Switch>
      {/* TODO：ok */}
      <Redirect exact from="/docs" to="/docs/about-zarm" />
      {/* TODO：ok */}
      <Redirect exact from="/components" to="/components/button" />
      {/* TODO：ok */}
      <Redirect exact from="/design" to="/design/download" />
      {/* TODO：ok */}
      <Route exact path="/" component={require('@/web/pages/Index').default} />
      {/* TODO：ok */}
      <Route path="/docs/:doc" component={require('@/web/pages/Components').default} />
      {/* TODO：ok */}
      <Route path="/components/:component" component={require('@/web/pages/Components').default} />
      {/* TODO：ok */}
      <Route path="/design/:page" component={require('@/web/pages/Design').default} />
      {/* TODO：ok */}
      <Route path="*" component={require('@/web/pages/NotFoundPage').default} />
      <Redirect to="/" />
    </Switch>
  );
};

export default App;
