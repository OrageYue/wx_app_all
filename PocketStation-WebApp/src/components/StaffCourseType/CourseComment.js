import React from 'react';
import PropTypes from 'prop-types';
import { Flex, WhiteSpace, WingBlank } from 'antd-mobile';
import styles from "./CourseComment.less";

 const CourseComment = ({staff, content}) => {
  return (
    <Flex direction="column" align="start">
    	<WhiteSpace />
    	<WingBlank>
    		<Flex>
    			<Flex justify="center" className={styles.imgWrap}>
    				<img src={staff.avatar} alt={staff.avatar} />
    			</Flex>
    			<h4>{staff.name}</h4>
    		</Flex>
    		<WingBlank>
    			<p>{content}</p>
    		</WingBlank>
    	</WingBlank>
    	<WhiteSpace />
    </Flex>
  )
}

CourseComment.propTypes = {
  id: PropTypes.number,
  user: PropTypes.object,
  content: PropTypes.string,
}

export default CourseComment;