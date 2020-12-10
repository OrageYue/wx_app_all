import { WingBlank, WhiteSpace, Flex, Icon } from 'antd-mobile';
import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import ToolsGroup from '../../components/ToolsGroup';
import HeaderTitle from '../../components/HeaderTitle';
import CollectLessonGroup from '../../components/CollectLessonGroup';
import { formatLessonPartsImageUrl } from "../../utils/dev";
import { getResourceUrl } from "../../utils/resource";
import { getPageQuery } from '../../utils/utils';
import { connect } from 'dva';

class StaffcollectToolsPage extends Component {

  componentDidMount() {
    const { id } = getPageQuery(window.location.href);
    const { getCollTools, getCollLessons, user_id } = this.props;
    if(id === '1') {
      getCollLessons({user_id});
    }else {
      getCollTools({user_id});
    }
    
  }
  render() {
    const { loading, tools, onTools, onDownload, onLessonClick } = this.props;
    let { lessons } = this.props;
    const { id } = getPageQuery(window.location.href);
    lessons = lessons.map( ls => ({ ...ls, img: formatLessonPartsImageUrl(ls.img_src), onClick: ()=> onLessonClick(ls.id) }))
    return (
      <WingBlank size='lg'>
        <WhiteSpace />
        <HeaderTitle />
        <WhiteSpace />
        <Flex justify="center" align="center">
          {
            loading? <Icon type="loading" size='md'/>: (
              id === '2'?<WingBlank size="lg" style={{width: '92%'}}><ToolsGroup list={tools} onTools={onTools} onDownload={onDownload} listType="文件类型" /></WingBlank>
            :
            <CollectLessonGroup lessons={lessons} />
            )
          }
        </Flex>
      </WingBlank>
    )
  }
}

function mapState2Props({user, collects, loading}) {
  return {
    user_id: user.id,
    tools: collects.tools,
    lessons: collects.lessons,
    loading: loading.effects['collects/getCollTools'] || loading.effects['collects/getCollLessons'],
  }
}
function mapDispatch2Props( dispatch ) {
  return {
    getCollTools( user_id ) {
      dispatch({type: 'collects/getCollTools', payload: user_id});
    },
    onDownload( tool_content ) {
      window.open( getResourceUrl(tool_content) );
    },
    onTools(tool_id) {
      dispatch(routerRedux.push(`/tools?tool_id=${tool_id}`));
    },
    getCollLessons( user_id ) {
      dispatch({type: 'collects/getCollLessons', payload: user_id});
    },
    onLessonClick( lsn_id ) {
      dispatch(routerRedux.push(`/course?lesson_id=${lsn_id}`));
    },
  }
}
export default connect(mapState2Props, mapDispatch2Props)(StaffcollectToolsPage);