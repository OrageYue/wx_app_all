import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Flex, Button } from 'antd-mobile';
import styles from "./VideoRender.less";
import { compare } from '../../utils/utils';
import LecturerCard from '../../components/LecturerCard';
import CourseComment from './CourseComment';
import { formatLessonPartsImageUrl } from "../../utils/dev";

class VideoRender extends Component {
  state = {
		myComment: ''
	}
  getInpValue = () => {
  	this.setState({
  		myComment: this.refs.shareInp.value
		})
	}
	clearInp = () => {
		this.refs.shareInp.value = '';
	}
  render() {
		const { onExam, changeThumb, changeCollection, onGoThumbs, onGoCollect, onShare, ...others } = this.props;

		let { lsn_comments, videoData } = others;
		let { lsn_info, lesson_id, user_id, ques, types, thumbs, collects } = videoData;

		let { contents, lecturer } = lsn_info;
		let collected = false;
		if( collects.length > 0 ) {
			collected = collects.indexOf(user_id*1)!==-1?true: false;
		}else {
			collected = false;
		}
		lsn_comments&&lsn_comments.sort(compare('id'));
		let commentArr = [];
    if(lsn_comments.length>0) {
    	lsn_comments.forEach( ({id, staff, content}) => {
    		commentArr.push(
          <CourseComment key={id} staff={staff} content={content} />
    		)
    	})
    }else {
    	commentArr.push(<Flex key='0' style={{margin: '20px'}}>该课程暂时没有评论</Flex>)
    }
    return (
    	<Flex direction="column" align="start" className={styles.container}>
    		{/*video*/}
    		<Flex justify="center" className={styles.videoWrap}>
    			<video controls className={styles.vid}>
    				<source src={formatLessonPartsImageUrl(contents)} alt={formatLessonPartsImageUrl(contents)} type="video/mp4" />
    				<source src={formatLessonPartsImageUrl(contents)} alt={formatLessonPartsImageUrl(contents)} type="video/mov" />
    				<source src={formatLessonPartsImageUrl(contents)} alt={formatLessonPartsImageUrl(contents)} type="video/ogg" />
    			</video>
    		</Flex>
    		{/* 讲师信息，课程评论 */}
    		<Flex direction="column" className={styles.centerContainer}>
    			<LecturerCard thumbs={thumbs} lesson_id={lesson_id} user_id={user_id} type={types} lecturer={lecturer} change={changeThumb} onChangeThumb={onGoThumbs} />
    			<div className={styles.commentList}>
    				{commentArr}
    			</div>
    		</Flex>
				{ques.length > 0 && types !=='dealer' ? <Flex justify="center" className={styles.exam} onClick={() => onExam(lesson_id)}>考试</Flex>: null}
    		{/*发表课程评论*/}
    		<Flex justify="between" className={styles.shareWrap}>
					{types === 'staff'?<i className={collected?"iconfont icon-shoucang":"iconfont icon-shoucang1"} onClick={() => onGoCollect({collected, lesson_id, user_id})} ></i>
					:null}
					<input className={styles.shareInp} ref="shareInp" onChange={() => this.getInpValue()}/>
    			<Button type="primary" size="small" className={styles.shareBtn} onClick={() => onShare({content: this.state.myComment,lesson_id, user_id, type: types, clearInp:this.clearInp})}>Share</Button>
    			{/* <Button type="primary" size="small" className={styles.shareBtn} onClick={() => onShare({contents:myComment,lesson_id, token})}>Share</Button> */}
    		</Flex>
    	</Flex>
    )
  }
}

VideoRender.propTypes = {
  videoData: PropTypes.object,
  onGoThumbs: PropTypes.func,
  onGoCollect: PropTypes.func,
  changeCollection: PropTypes.func,
  changeThumb: PropTypes.func,
  onShare: PropTypes.func,
}

export default VideoRender;