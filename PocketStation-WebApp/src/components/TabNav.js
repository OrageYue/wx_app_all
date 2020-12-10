import T from 'prop-types';
import { Flex } from "antd-mobile";

function TabItem({ onTab, icon, curIcon, title, url, onTabClick }) {
  return (
    <Flex
      style={{ height: '100%', width: '100%', color: onTab ? '#0F800E' : 'black', fontSize: '18px' }}
      onClick={onTab ? null : () => onTabClick(url, icon)}
      justify='center'
      align='center'
    >
      <img src={onTab?curIcon:icon} alt='' height="40px" />
    </Flex>
  )
}

function TabNav({ tabs, currUrl, onTabClick, height }) {
  return (
    <Flex style={{ height, width: '100%', backgroundColor: 'white' }} justify='between'>
      {tabs.map(tab => (
        <TabItem key={tab.url} onTab={currUrl === tab.url} {...tab} onTabClick={onTabClick} />
      ))}
    </Flex>
  )
}

TabNav.propTypes = {
  // tab栏配置
  tabs: T.arrayOf(T.shape({
    title: T.string.isRequired,
    url: T.string.isRequired,
  })),
  // 当前路径
  currUrl: T.string.isRequired,
  // Tab点击事件（一般为路由跳转） f(url)
  onTabClick: T.func.isRequired,
  // 导航栏高度
  height: T.number,
}

TabNav.defaultProps = {
  height: 64
}

export default TabNav;