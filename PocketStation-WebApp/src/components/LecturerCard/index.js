import React from 'react';
import { PropTypes } from 'prop-types';
import { Flex } from 'antd-mobile';
import styles from './index.less';

const LecturerCard = ({ lecturer, onChangeThumb, user_id, type, thumbs, lesson_id, token, change }) => {
	let { pos } = lecturer;
	let thumbed = false;
	if( thumbs.length > 0 ) {
		thumbed = thumbs.indexOf(user_id*1) !== -1?true: false;
	}else {
		thumbed = false;
	}
  return(
  	<Flex justify="between" className={styles.lecturer}>
      {/*讲师信息*/}
  		<Flex>
  			<Flex justify="center" className={styles.imgWrap}>
  				<img src={lecturer.avatar} alt={lecturer.avatar} />
  			</Flex>
  			<Flex direction="column" align="start" >
  				<h4>{lecturer.name}</h4>
  				<div>
  					<span className={styles.department}>{pos.bu.name}</span>&ensp;
  					<span className={styles.job}>{pos.name}</span>
  				</div>
  				<span className={styles.chapters}>视频课程数: {lecturer.lessons.length}</span>
  			</Flex>
  		</Flex>
			{/*点赞*/}
			{
				type==='staff'?
				<Flex direction="column" className={styles.like} >
					<i className={thumbed?"iconfont icon-dianzan1":"iconfont icon-dianzan"} onClick={() => onChangeThumb({thumbed,user_id,lesson_id})}></i>
					<span>{thumbs.length}</span>
				</Flex>: 
				<Flex direction="column" className={styles.like} >
					<i className="iconfont icon-dianzan1"></i>
					<span>{thumbs.length}</span>
				</Flex>
			}
  		{/* <Flex direction="column" className={styles.like} >
  			<i className={thumbed?"iconfont icon-dianzan1":"iconfont icon-dianzan"} onClick={() => onChangeThumb({thumbed,user_id,lesson_id})}></i>
  			<span>{thumbs.length}</span>
  		</Flex> */}
  	</Flex>
  )
}

LecturerCard.propTypes = {
	// thumbs: PropTypes.
  lecturer: PropTypes.object, 
  me: PropTypes.object, 
  onChangeThumb: PropTypes.func,
  lesson_id: PropTypes.string,
  token: PropTypes.string,
}
export default LecturerCard;