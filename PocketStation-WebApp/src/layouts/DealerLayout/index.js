import { PureComponent } from "react";
import { connect } from "dva";
import { RouteWithSubRoutes } from "../../routes/Identity";
import TabNav from "../../components/TabNav";
import Space from '../../components/Space';
import { routerRedux } from "dva/router";

class DealerLayout extends PureComponent {

  tabs = [
    {
      title: '主页',
      icon: '/home.png',
      curIcon: '/home_g.png',
      url: '/dealer/index',
    },
    {
      title: '资源',
      icon: '/resources.png',
      curIcon: '/resources_g.png',
      url: '/dealer/res',
    },
    {
      title: '直播',
      icon: '/live.png',
      curIcon: '/live_g.png',
      url: '/dealer/live',
    },
    {
      title: 'Q&A',
      icon: '/QA.png',
      curIcon: '/QA_g.png',
      url: '/dealer/QA',
    },
  ]

  TabNavHeight = 64

  render() {
    const { routes, identProps } = this.props;
    const { goTab } = this.props;
    // console.log(goTab);
    return (
      <div style={{ paddingBottom: this.TabNavHeight, boxSizing:'border-box', height: '100%' }}>

        {routes && routes.map((route, i) => <RouteWithSubRoutes key={i} route={route} identProps={identProps} />)}

        <div style={{ position: 'fixed', zIndex:999, bottom: 0, width: '100%', height: this.TabNavHeight }}>
          <Space />
          <TabNav
            tabs={this.tabs}
            currUrl={window.location.pathname}
            onTabClick={goTab}
            height={this.TabNavHeight}
          />
        </div>
      </div>
    )
  }
}

function mapDispatch2Props(dispatch) {
  return {
    goTab(url) {
      return dispatch(routerRedux.push(url));
    }
  }
}
export default connect(
  () => ({}),
  mapDispatch2Props
)(DealerLayout);