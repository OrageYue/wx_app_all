import { WhiteSpace, WingBlank } from "antd-mobile";
import { connect } from 'dva';
import QAListGroup from '../../components/QAListGroup';
import HeaderTitle from '../../components/HeaderTitle';

function DealerFAQ({ FAQList }) {
  return (
    <WingBlank size="lg">
      <WhiteSpace size="lg"/>
      <HeaderTitle />
      <WhiteSpace size="lg"/>
      <QAListGroup FAQList={ FAQList } />
    </WingBlank>
  )
}

function mapState2Props({ QA }) {
  return {
    FAQList: QA.FAQList,
  }
}

export default connect(mapState2Props)(DealerFAQ);
