import React from 'react';
import PropTypes from 'prop-types';
import { Flex } from 'antd-mobile';
import styles from './index.less';

const MeCollections = ({ id, onClickCourses, onClickTools }) => {

  return (
    <Flex justify="around" className={styles.wrap}>
      <Flex onClick={()=>onClickCourses('收藏课程')}><i className={`iconfont icon-shoucang ${styles.icons}`}></i>收藏课程</Flex>
      <span className={styles.line}></span>
      <Flex onClick={()=>onClickTools('收藏工具')}><i className={`iconfont icon-star-copy ${styles.icons}`}></i>收藏工具</Flex>
    </Flex>
    
  )
}

MeCollections.props = {
  id: PropTypes.string,
  onClickCourses: PropTypes.func,
  onClickTools: PropTypes.func
}

export default MeCollections;