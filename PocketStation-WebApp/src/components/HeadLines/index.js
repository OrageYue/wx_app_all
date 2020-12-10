import { Flex, WingBlank } from 'antd-mobile';
import styles from './index.less';
import HotNewsCard from './HotNewsCard';

function HeadeLinesGroup({ news }) {
  return (
    <WingBlank size="lg" style={{width: '100%'}}>
      <Flex justify="between" className={styles.hot_container}>
        <img src="/hot.png" alt="/hot.png" width="30px" />
        <Flex direction="column" align="start" justify="start" className={styles.newsContainer}>
          {
            news.length>0 && news.map( news => (
              <HotNewsCard key={news.id} news={news} />
            ))
          }
        </Flex>
       
      </Flex>
    </WingBlank>
    
  )
}

export default HeadeLinesGroup;