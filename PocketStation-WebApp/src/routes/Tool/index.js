import { Flex, Icon, Button, WingBlank, WhiteSpace } from 'antd-mobile';
import { connect } from 'dva';
import React, { Component } from 'react';
import { getPageQuery } from '../../utils/utils';
import { formatLessonPartsImageUrl } from "../../utils/dev";
import ToolServices from '../../services/tool';
import styles from './index.less';

class Tool extends Component {
  state = {
    collects: [],
  }
  async componentDidMount() {
    const { saveToolInfo } = this.props;
    const { tool_id } =  getPageQuery(window.location.href);
    const { data, err} = await ToolServices.queryToolInfo(tool_id*1);
    if( data ) {
      saveToolInfo(data);
      this.setState({
        collects: data.staffs
      })
    }
  }
  changeCollect = ({is_collect, ...others}) => {
    const { user_id, changeCollect } = this.props;

    const { collects } = this.state;
    if( is_collect ) {  //取消收藏
      changeCollect({is_collect, ...others, callback: ()=> {this.setState({
        collects: collects.filter( cs => cs !== user_id )
      })}});
    }else {
      collects.push( user_id );
      changeCollect({is_collect, ...others, callback:()=>this.setState({
        collects,
      })});
    }

  }
  render() {
    let { tool_info, loading, user_id } = this.props;
    let { collects } = this.state;
    let { tool_id } = getPageQuery(window.location.href);
    let { lsn, type, content } = tool_info;
    content = formatLessonPartsImageUrl(content);
    let is_collect = false;

		if( collects.length > 0 ) {
      is_collect = collects.indexOf(user_id)!==-1?true: false;
		}else {
			is_collect = false;
    }
    return (
      <WingBlank size="lg" >
      {loading? <Icon className='loading' />:
        <Flex direction="column" className={styles.toolWrap}>
          <WhiteSpace />
          <Flex className={styles.title} justify="between">
            {
              lsn?<span>{`${lsn.oprt.cls.name} / ${lsn.oprt.name} / ${lsn.name}`}</span>: null
            }
            <i className={is_collect?"iconfont icon-shoucang":"iconfont icon-shoucang1"} onClick={() => this.changeCollect({is_collect,user_id,tool_id})}></i>
          </Flex>
          <WhiteSpace />
          {
            type && type === 'video'? 
            <Flex justify="center" className={styles.videoWrap}>
              <video controls className={styles.vid}>
                <source src={content} alt={content} type="video/mp4" />
              </video>
            </Flex>
            : <a href={content} target="_blank" style={{width: '100%'}}><Button type="primary" className={styles.btn}>预览</Button></a>
          }
        </Flex>}
    </WingBlank>
    )
  }
}

function mapState2Props({ user, tool, loading }) {
  let { tool_info, collects } = tool;
  return {
    user_id: user.id,
    tool_info,
    collects,
    loading: loading.effects['tool/getToolInfo'],
  }
}
function mapDispatch2Props(dispatch) {
 return {
  saveToolInfo(data) {
    dispatch({type: 'tool/saveTool', payload: data});
  },
  collect_all( user_id ) {
    dispatch({type: 'tool/onCollect_all', payload: user_id});
  },
  changeCollect({is_collect, callback, ...params}) {
    if( is_collect ) {
      dispatch({type: 'tool/cancleCollect', payload: params, callback});
    }else {
      dispatch({type: 'tool/collect', payload: params, callback});
    }
  }
 }
}
export default connect(mapState2Props, mapDispatch2Props)(Tool);