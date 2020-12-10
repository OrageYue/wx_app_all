import React from 'react';
import { Router, Route } from 'dva/router';
import Identity from './routes/Identity';

function RouterConfig({ history }) {
  return (
    <Router history={history} >
      <Route component={Identity}/>
    </Router>
  );
}

export default RouterConfig;
