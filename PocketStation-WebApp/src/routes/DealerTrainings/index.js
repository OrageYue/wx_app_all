import React from 'react';
import { connect } from 'dva';
import { Flex, WhiteSpace, WingBlank } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import HeaderTitle from '../../components/HeaderTitle';
import DetailsLessonCard from "../../components/DetailsLessonCard";

function DealerTraings({ trainings, onTrainingLearn }) {
  trainings = trainings.map(lt => ({ ...lt, img: lt.cover_img, onBtnClick: () => onTrainingLearn(lt.id) }))
  return (
    <WingBlank>
      <Flex direction="column">
        <WhiteSpace size="lg"/>
        <HeaderTitle />
        <WhiteSpace size="lg"/>
        {trainings.map((t,idx)=><DetailsLessonCard key={idx} {...t}/>)}
      </Flex>
    </WingBlank>
  )
}
function mapState2Props({dealer}) {
  let { trainings } = dealer;
  return {
    trainings
  }
}

function mapDispatch2Props( dispatch ) {
  return {
    onTrainingLearn(training_id) {
      dispatch(routerRedux.push(`/train?training_id=${training_id}`));
    },
  }
}
export default connect(mapState2Props, mapDispatch2Props)(DealerTraings);