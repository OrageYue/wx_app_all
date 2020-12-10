import React from 'react';
import { Flex, WingBlank } from 'antd-mobile';
import styles from './index.less';

const KnowlPanel = () => {

  return (
    <WingBlank>
      <Flex justify="around" className={styles.wrap} direction="column" align="start">
      	<Flex className={styles.knowTop} justify="between">
      		<h4>专业知识</h4>
      		当前成绩已超过了<span>68%</span>的小伙伴
      	</Flex>
        <Flex>
        	<span className={styles.kindTitle}>必修课</span>
        	<Flex>当前课程已修完</Flex>
        </Flex>
      </Flex>
    </WingBlank>
  )
}

export default KnowlPanel;