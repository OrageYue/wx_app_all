import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Flex, Button } from 'antd-mobile';
import { compare } from '../../utils/utils';
import CourseComment from './CourseComment';
import styles from "./GraphicRender.less";
import { formatLessonPartsImageUrl } from "../../utils/dev";


class GraphicRender extends Component {

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
    const { lsn_info: { id }, user_id, ques, types, collects } = this.props.GraphicData;
    const { changeCollection, lsn_comments, readImgFun, onExam, onGoCollect, onShare } = this.props;
    let graphicArr = [];
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

    let collected = false;
    let { contents } = this.props.GraphicData;
    if( collects.length > 0 ) {
			collected = collects.indexOf(user_id)!==-1?true: false;
		}else {
			collected = false;
		}
    if( contents ) {
      contents = JSON.parse(contents);
      contents.map( item => (
    		graphicArr.push(<img alt={formatLessonPartsImageUrl(item)} src={formatLessonPartsImageUrl(item)} style={styles.imgStyle} key={item} onClick={()=>readImgFun(item, contents)} />)
    	))
    }else {
    	graphicArr.push(<div key='0'>暂无数据</div>)
    }
    return (
    	<Flex direction="column" className={styles.graphicWrap}>
        {/* {
          types === 'staff'?
          <Flex className={styles.collectedIcon} direction="column" >
            <i className={collected?"iconfont icon-shoucang":"iconfont icon-shoucang1"} onClick={() => onGoCollect({collected,lesson_id: id,user_id, type: types})} ></i>
            <span>{collected?"已收藏":"收藏它"}</span>
          </Flex>: null
        } */}
        {ques.length > 0 && types!=='dealer'?<Flex justify="center" className={styles.exam} onClick={() => onExam(id)}>考试</Flex>:null}
        
        {/* 图文课程信息， 评论 */}
        <Flex direction="column" className={styles.centerContainer}>
    			<Flex direction="column" justify="start" className={styles.graphicCon}>{graphicArr}</Flex>
    			<div className={styles.commentList}>
            <Flex justify="center" className={styles.commentsTitle}>评论信息</Flex>
            {commentArr}
    			</div>
    		</Flex>
        {/*发表课程评论*/}
        <Flex justify="between" className={styles.shareWrap}>
					{types === 'staff'?<i className={collected?"iconfont icon-shoucang":"iconfont icon-shoucang1"} onClick={() => onGoCollect({collected, lesson_id: id, user_id, type: types})} ></i>
          :null}
					<input className={styles.shareInp} ref="shareInp" onChange={() => this.getInpValue()}/>
    			<Button type="primary" size="small" className={styles.shareBtn} onClick={() => onShare({content: this.state.myComment,lesson_id: id, user_id, type: types, clearInp:this.clearInp})}>Share</Button>
    		</Flex>
    	</Flex>
    )
  }
}
GraphicRender.propTypes = {
  contents: PropTypes.array, 
  onCollect: PropTypes.func, 
  token: PropTypes.string, 
  lesson_id: PropTypes.string, 
  collected: PropTypes.bool
}
export default GraphicRender;