import { TabBar } from 'antd-mobile';
import { PureComponent } from "react";
import { connect } from 'dva';
import { RouteWithSubRoutes } from "../../routes/Identity";
import { routerRedux } from 'dva/router';

class StaffLayout extends PureComponent {

  tabs = [
    {
      title: '专业知识',
      icon: '/index.png',
      curIcon: '/index_g.png',
      url: '/staff/index',
    }, 
    {
      title: '贝爱感恩',
      icon: '/grats.png',
      curIcon: '/grats_g.png',
      url: '/staff/grats',
    }, 
    {
      title: '专业共享',
      icon: '/share.png',
      curIcon: '/share_g.png',
      url: '/staff/share',
    }, 
    {
      title: '个人中心',
      icon: '/mine.png',
      curIcon: '/mine_g.png',
      url: '/staff/mine',
    },
  ];
  render() {
    const pathname = this.props.location.pathname
    let { routes, identProps } = this.props;
    const { goTab } = this.props;
    return (
      <TabBar
      unselectedTintColor='#949494'
      tintColor='#339f6a'
      barTintColor='white'
    >
      {this.tabs.map( (tab, inx) => (
          <TabBar.Item
            key={tab.title}
            icon={<img src={tab.icon} alt={tab.icon} height="40px" />} 
            selectedIcon={<img src={tab.curIcon} alt={tab.curIcon} height="40px" />}
            selected={pathname === tab.url}
            onPress={() => {
              goTab(tab.url)
            }}
          >
            <RouteWithSubRoutes route={routes[inx]} identProps={identProps} />
          </TabBar.Item>
        ))
      }
    </TabBar>
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
export default connect(()=>({}), mapDispatch2Props)(StaffLayout);