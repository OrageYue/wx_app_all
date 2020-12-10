import { Flex, WhiteSpace, WingBlank } from "antd-mobile";
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { timeFormat } from '../../utils/utils';
import HeaderTitle from '../../components/HeaderTitle';
import InterActioinGroup from '../../components/InterActioinGroup';

function DealerAction({ interActionList, onInterActionClick }) {
  interActionList = interActionList.map(lt => ({ ...lt, create_at: timeFormat(lt.create_at), onCardClick: () => onInterActionClick(lt.ques_id) }))
  return (
    <WingBlank>
      <Flex style={{height: '100%'}} direction="column" align='center'>
        <WhiteSpace size="lg"/>
        <HeaderTitle />
        <WhiteSpace size="lg"/>
        <InterActioinGroup interActionList={interActionList} />
      </Flex>
    </WingBlank>
    
  )
}

function mapState2Props({ QA }) {
  return {
    interActionList: QA.interActionList,
  }
}
function mapDispatch2Props( dispatch ) {
  return {
    onInterActionClick(id) {
      dispatch( routerRedux.push(`/QA/action/question?id=${id}`))
    },
  }
}
export default connect(mapState2Props, mapDispatch2Props)(DealerAction);