import { Flex } from 'antd-mobile';
import styles from './HotNewsCard.less';

function HotNewsCard({ news: {name, onClick} }) {
  return (
  <Flex justify="between" align="center" className={styles.container} onClick={onClick}>
    <p className={styles.brief}>{name}</p>
    <i className='iconfont icon-jiantou'></i>
  </Flex>
  )
}

export default HotNewsCard;