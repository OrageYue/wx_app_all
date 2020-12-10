import { connect } from 'dva';
import { Route } from 'dva/router';

// deafault alternative com.
import LoginPage from '../LoginPage';
import { log } from '../../utils/log';
import routes from "../../routeConfig";

const defaultRouteCfg = {
  // Identity props to canRender
  canRender: ({ token }) => {
    return token !== ''
  },

  // route render props to alternative
  alternative: (props) => <LoginPage {...props} />,
}

/**
 * Route Config的单个路由生成函数。
 * 内部检查是否满足准入条件，不满足则渲染替代组件。
 */
export const RouteWithSubRoutes = ({ route, identProps, key }) => {
  return <Route
    key={key}
    path={route.path}
    exact={route.routes ? false : true}
    render={(props) => {
      const cfg = {
        canPass: (route.canRender || defaultRouteCfg.canRender)(identProps),
        alternative: (route.alternative || defaultRouteCfg.alternative)
      }
      log(`Route[${route.path}]:`, cfg);
      return cfg.canPass ? <route.component {...props} routes={route.routes} identProps={identProps} /> : <cfg.alternative {...props} />
    }}
  />
}

function Identity(identProps) {
  return (
    <div style={{height: '100%'}}>
      {/* @BUG 不允许组件化调用, 组件化调用会引起未知问题，导致只能到达数组第一个路由。 */}
      {routes.map((route, i) => RouteWithSubRoutes({ route, identProps, key: i }))}
    </div>
  )
}

export default connect(
  // 为默认canRender提供的数据
  ({ user }) => {
    // console.log(user.token)
    return {
      token: user.token,
      type: user.type,
    }
  }
)(Identity);
