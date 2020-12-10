import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Component } from 'react';
import styles from './index.less';
import { Flex, WingBlank, WhiteSpace, SegmentedControl } from 'antd-mobile';
import ToolsGroup from '../../components/ToolsGroup';
import { getPageQuery } from '../../utils/utils';
import { formatLessonPartsImageUrl } from '../../utils/dev';

class StaffOprLessons extends Component {

  valueChange = ( value ) => {
    const { list, saveTools, saveLsn } = this.props;
    let tools = [];

    if( value === '资源' ) {
      const { opr_id } = getPageQuery( window.location.href );
      let lessons = list.filter( tl => (
        opr_id*1 === tl.id
      ))

      lessons&&lessons[0].children.forEach( item => {
        item.tools.forEach( ts => {
          ts.c = formatLessonPartsImageUrl(ts.content);
          tools.push( ts )
        })
      });
      saveTools(tools);
    }else {
      saveLsn();
    }
  }
  render() {
    const { type, onGoLsn, selectedIndex, values, onTools, onDownload } = this.props;
    const { opr_id } = getPageQuery( window.location.href );
    let { list, tools } = this.props;
    const view = 12;

    list = list.filter( opr => {
      return opr.id === opr_id*1;
    });

    return (
      <WingBlank>
        <WhiteSpace />
        <Flex className={styles.lsn_title}>
          <span>{list[0].name}&ensp;/</span>
          <SegmentedControl 
            className={styles.choice}
            values={values} 
            style={{"width": "80px",height: '40px', lineHeight: '40px'}}
            onValueChange = { this.valueChange }
            selectedIndex={selectedIndex}
          />
        </Flex>
        <WhiteSpace />
        {
          type === '课程'?
            <Flex justify="start" direction="column">
            {
              list[0].children.map( ({id, img_src, name, type}) => (
                <Flex key={id} className={styles.lsn_container} onClick={() => onGoLsn(id)}>
                  <img src={img_src} alt={img_src} className={styles.lsn_img} />
                  <Flex direction="column" align="start" className={styles.lsn_R}>
                    <span className={styles.title}>{name}</span>
                    <Flex className={styles.lsn_B}>
                      <span className={styles.type}>{`课程类型: ${type==='video'?'视频':'图文'}`}</span>
                      <i className="iconfont icon-yonghu"></i>
                      <span>{view}</span>
                    </Flex>
                  </Flex>
                </Flex>
              ))
            }
          </Flex>
          :<WingBlank><ToolsGroup list={tools} onTools={onTools} onDownload={onDownload} listType="文件类型" /></WingBlank>
        }
      </WingBlank>
    )
  }
}


StaffOprLessons.defaultProps = {
  values: ['课程', '资源']
}

function mapState2Props({user, lessons, courses}) {
  let { list } = lessons;
  let { selectedIndex, type, courseLists } = courses;
  return {
    user_id: user.id,
    list,
    tools: courseLists,
    selectedIndex,
    type,
  }
}
function mapDispatch2Props( dispatch ) {
  return {
    saveLsn() {
      dispatch({type: 'courses/saveIndex', payload: 0});
      dispatch({type: 'courses/saveType', payload: '课程'});
    },
    saveTools(tools) {
      dispatch({type: 'courses/saveTools', payload: tools});
    },
    onGoLsn(lsn_id) {
      dispatch(routerRedux.push(`/course?lesson_id=${lsn_id}`));
    },
    onTools(tool_id) {
      dispatch(routerRedux.push(`/tools?tool_id=${tool_id}`));
    },
    onDownload( tool_id ) {
      console.log( '收藏工具',tool_id );
    },
  }
}

export default connect( mapState2Props, mapDispatch2Props )(StaffOprLessons);