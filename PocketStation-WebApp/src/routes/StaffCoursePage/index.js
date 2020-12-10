import React, { Component } from 'react';
import { connect } from 'dva';
import { Flex, Icon, Toast } from 'antd-mobile';
import { getPageQuery } from '../../utils/utils';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import VideoRender from '../../components/StaffCourseType/VideoRender.js';
import GraphicRender from '../../components/StaffCourseType/GraphicRender.js';
import operationServices from '../../services/operation';

class StaffCoursePage extends Component {
  
  state = {
    thumbs: [],
    collects: [],
  }

  async componentDidMount() {
    const { lesson_id } = getPageQuery();
    const { onLsnInfo, onComments, onQues } = this.props;
    const { data, err} = await operationServices.queryLsn_info( lesson_id );
    if(data) {
      onLsnInfo(data);
      const { be_thumbs, be_collected } = data;
      this.setState({
        thumbs: be_thumbs,
        collects: be_collected,
      })
    }
    await onComments(lesson_id );
    await onQues( lesson_id );
  }
  
  //图片预览
  readImgFun = (item,contents) => {
    window.wx.previewImage({
      current: item,
      urls: contents
    })
  }

  onThumbs = ({thumbed, ...others}) => {
    const { user_id, onThumbs } = this.props;
    const { thumbs } = this.state;
    if( thumbed ) {  //取消点赞
      onThumbs({thumbed, ...others, callback: ()=> {this.setState({
        thumbs: thumbs.filter( bs => bs !== user_id )
      })}});
    }else {
      thumbs.push( user_id );
      onThumbs({thumbed, ...others, callback:()=>this.setState({
        thumbs
      })});
    }
  }

  onCollect = ({collected, ...others}) => {
    const { user_id, onCollect } = this.props;
    const { collects } = this.state;
    if( collected ) {  //取消收藏
      onCollect({collected, ...others, callback: ()=> {this.setState({
        collects: collects.filter( cs => cs !== user_id )
      })}});
    }else {
      collects.push( user_id );
      onCollect({collected, ...others, callback:()=>this.setState({
        collects,
      })});
    }
  }

  onShare = async ({clearInp, ...other}) => {
    const { lesson_id } = getPageQuery();
    const { onShare, onComments } = this.props;
    const { content } = other;
    content?onShare(other):Toast.info('内容不能为空')
    await onComments(lesson_id );
    clearInp();
  }
  
  render() {
    const { lesson_id } = getPageQuery();
    let { lsn_info, user_id, types, loading, onCollect, onExam, ques, ...props } = this.props;
    // const { loading, lessonInfo, comments, lesson_id, token, myComment, collected, thumbed, thumbs  } = this.state;
    let { contents, type} = lsn_info;
    let { lsn_comments, collected } = props;
    const { thumbs, collects } = this.state;

    const videoData = {lsn_info, user_id, types, thumbs, collects, lesson_id, ques,  collected};
    const GraphicData = {contents,lsn_info, user_id, ques, types, collects};
    // const videoData = { lessonInfo, comments, lesson_id, token, myComment, collected, thumbed, thumbs  };
    // const GraphicData = { content, onCollect, token, lesson_id, collected   };
    return(
      <div className={styles.wrap}>
        {
          loading?
          <Flex align="center" justify="center" style={{height:"100%"}}>
            <Icon type='loading' size='lg'  />
          </Flex>
          :(type === 'video' ?
          <VideoRender 
            videoData={videoData} 
            lsn_comments={lsn_comments} 
            onGoThumbs={this.onThumbs} 
            getInpValue={this.getInpValue} 
            changeCollection={this.changeCollection} 
            onGoCollect={this.onCollect} 
            changeThumb={this.changeThumb} 
            onShare={this.onShare}
            onExam={onExam}
          />
          : <GraphicRender 
              GraphicData={GraphicData} 
              lsn_comments={lsn_comments} 
              readImgFun={this.readImgFun} 
              onGoCollect={this.onCollect}
              changeCollection={this.changeCollection} 
              onExam={onExam}
              onShare={this.onShare}
            /> )
        }
      </div>
    )}
}

function mapState2Props({ user, lsnInfo, question, loading }) {
  let { lsn_info, lsn_comments } = lsnInfo;
  return {
    ques: question.ques,
    user_id: user.id,
    types: user.type,
    lsn_info,
    lsn_comments,
    loading:loading.effects["lsnInfo/queryLsnInfo"]
  }
}

function mapDispatch2Props( dispatch ) {
  return {
    onQues(lsn_id) {
      dispatch({type:'question/queryQues', payload:lsn_id});
    },
    onExam(lsn_id) {
      dispatch({type:'question/queryQues', payload:lsn_id})
      return dispatch(routerRedux.push(`/ques/?lesson_id=${lsn_id}`));
    },
    onLsnInfo(params) {
      dispatch({type: 'lsnInfo/saveLsnInfo', payload: params});
    },
    onComments(lsn_id) {
      dispatch({type: 'lsnInfo/queryComments', payload: lsn_id});
    },
    onShare({type, ...others}) {
      const { content } = others;
      type === 'staff'?
      (content?dispatch({type: 'lsnInfo/share', payload: others}):Toast.info('内容不能为空') ): Toast.info('您没有权限');
    },
    //点赞事件
    onThumbs({thumbed, callback, ...others}) {
      thumbed?dispatch({type: 'lsnInfo/dl_thumb', payload: others, callback}):dispatch({type: 'lsnInfo/thumb', payload: others, callback})
    },
    //收藏事件
    onCollect({collected, callback, ...others}) {
      collected?dispatch({type: 'lsnInfo/dl_collect', payload: others, callback}):dispatch({type: 'lsnInfo/collect', payload: others, callback})
    }
  }
}

export default connect(mapState2Props, mapDispatch2Props)(StaffCoursePage);

