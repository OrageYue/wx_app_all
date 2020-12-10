import React, { Component } from 'react';
import { connect } from 'dva';
import LsnListHeader from '../../components/LsnListHeader';
import OperationList from '../../components/OperationList';
import ToolsGroup from '../../components/ToolsGroup';
import { Flex, Icon, WingBlank } from 'antd-mobile';
import { getPageQuery } from '../../utils/utils';
import OperationService from '../../services/operation';
import { getResourceUrl } from "../../utils/resource";

import { routerRedux } from 'dva/router';

class StaffLessonKind extends Component {

  async componentDidMount() {
    const { pathname } = window.location;
    const type_flag = pathname.split('/').includes('staff') ? 'staff': 'dealer';
    const { part_id } = getPageQuery();
    const { onOperation, openid, saveTypeFlag } = this.props;
    saveTypeFlag( type_flag );
    await onOperation( {part_id, openid, types: type_flag} )
  }

  get_all_tools = async ({openid, list, types}) => {
    console.log( openid )
    let all_tools = [];
    for( let opr of list) {
      const { data: lessons } = await OperationService.queryOprt_lsn({openid, subPart_id:opr.id, types});
      for( let lsn of lessons ) {
        for (let tool of lsn.tools) {
          all_tools.push(tool);
        }
      }
    }
    this.props.saveTools(all_tools)
  }

  valueChange = ( value ) => {
    const { part_id } = getPageQuery();
    let { onOperation, openid, user_id, list, type_flag } = this.props;

    value === '课程' ? onOperation( {part_id, openid, types: type_flag} ) : this.get_all_tools({openid, list, types: type_flag});
  }
  render() {
    const { onGoLsn, onMore, onTools, onDownload, values, type, selectedIndex, loading, onNewExam } = this.props;
    let { list, all_tools } = this.props;
    return (
      <Flex direction="column">
        <LsnListHeader selectedIndex={selectedIndex} values={values} onValueChange={this.valueChange} />
        {loading? <Flex align="center" justify="center" style={{height:"100%"}}>
            <Icon type='loading' size='lg'/>
          </Flex>:
          <Flex justify="center" style={{width: '100%'}}>
            {type === '课程'?<OperationList operationList={list} onGoLsnPage={onGoLsn} onMore={onMore}/>
            :<WingBlank style={{width: '80%'}}><ToolsGroup list={all_tools} onTools={onTools} onDownload={onDownload} listType="文件类型" /></WingBlank>
          }
          </Flex>
        }
        <Flex style={{width:'72%',margin: '30px 0'}}>
          <Flex justify="center" style={{width:'120px',height:'50px',border:'1px solid #f1f1f1',background:'url(https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544003932166&di=1fcb9465b1e3f546a269729f80c9d316&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Fback_pic%2F03%2F85%2F00%2F7057cbcecaa171b.jpg)'}} onClick={onNewExam}>NES试题</Flex>
        </Flex>
      </Flex>
    )
  }
}

StaffLessonKind.defaultProps = {
  values: ['课程', '资源']
}

function mapState2Props({user, lessons, loading}) {
  let { list, type, selectedIndex, all_tools, type_flag } = lessons;
  return {
    user_id: user.user_id,
    openid: user.openid,
    list,
    all_tools,
    type,
    type_flag,
    selectedIndex,
    loading:loading.effects["lessons/queryOperations"],
  }
}

function mapDispatch2Props( dispatch ) {
  return {
    onNewExam() {
      dispatch(routerRedux.push(`/newExam`));
    },
    onDownload( tool_content ) {
      console.log( '下载工具',tool_content );
      window.open( getResourceUrl(tool_content) );
    },
    onGoLsn(lsn_id) {
      dispatch(routerRedux.push(`/course?lesson_id=${lsn_id}`));
    },
    onOperation(params) {
      console.log( params )
      dispatch({type: 'lessons/queryOperations', payload: params})
    },
    saveTools(tools) {
      dispatch({type: 'lessons/saveTools', payload: tools})
    },
    onTools(tool_id) {
      dispatch(routerRedux.push(`/tools?tool_id=${tool_id}`));
    },
    onMore(opr_id) {
      dispatch(routerRedux.push(`/lessons?opr_id=${opr_id}`));
    },
    saveTypeFlag(flg) {
      dispatch({type: 'lessons/saveTypeFlag', payload: flg})
    }
  }
}
export default connect(mapState2Props,mapDispatch2Props)( StaffLessonKind );