import { WingBlank, WhiteSpace, Flex, TextareaItem, Toast } from 'antd-mobile';
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import NewTitle from '../../components/NewTitle';
import HeaderTitle from '../../components/HeaderTitle';
import QAListGroup from '../../components/QAListGroup';
import InterActioinGroup from '../../components/InterActioinGroup';
import { timeFormat } from '../../utils/utils';
import styles from './index.less';

class DealerQAPage extends Component {
  onSubmit = () => {
    const { submit, form, user_id, type } = this.props;
    submit({ques:form.getFieldValue('question'),user_id, type});
  }
  render() {
    let { onMore, onGetMore, onQues, ...props } = this.props;
    let { FAQList, onInterActionClick, addVisible, onCancle } = props;
    let { currAction } = props;
    console.log( currAction )
    currAction = currAction.map(lt => ({ ...lt, create_at: timeFormat(lt.create_at), onCardClick: () => onInterActionClick(lt.ques_id) }))
    const { getFieldProps } = props.form;
    return (
      <div className={styles.QA_container}>
        <WingBlank className={styles.topContainer}>
          <WhiteSpace size="lg"/>
          <HeaderTitle />
          <NewTitle title='FAQ' onMore={onMore} />
          <WhiteSpace />
          <QAListGroup FAQList={ FAQList.slice(0,3) } />
        </WingBlank>
        <Flex className={styles.space}></Flex>
        <WingBlank className={styles.bottomContainer}>
          <NewTitle title='互动' onMore={onGetMore} />
          <WhiteSpace />
          <InterActioinGroup interActionList={currAction} />
          <WhiteSpace />
          <Flex className={styles.action_more} justify="center">
            {addVisible?(<Flex justify="between" style={{width: '100%'}}>
                <TextareaItem 
                  {...getFieldProps('question')}
                  autoHeight
                  rows={1} 
                  className={styles.question} />
                <img src="/submit_btn.png" alt="/submit_btn.png" width="51px" onClick={this.onSubmit}/>
                <Flex className={styles.cancle} justify="center" onClick={onCancle}>取消</Flex>
              </Flex>):
              (<img src="/plus.png" alt="/plus.png" onClick={onQues} width="30px" />)
            }
            
          </Flex>
        </WingBlank>
    </div>
    )
  }
}

function mapState2Props({ user, QA }) {
  let { FAQList, interActionList, addVisible, currAction } = QA;
  console.log( currAction )
  return {
    user_id: user.id,
    type: user.type,
    FAQList,
    interActionList,
    addVisible,
    currAction
  }
}

function mapDispatch2Props(dispatch) {
  return {
    onMore() {
      dispatch( routerRedux.push('/QA/FAQ'))
    },
    onInterActionClick(id) {
      dispatch( routerRedux.push(`/QA/action/question?id=${id}`))
    },
    onGetMore() {
      dispatch( routerRedux.push('/QA/action'))
    },
    onQues() {
      dispatch({type: 'QA/saveVisible', payload: true})
    },
    onCancle() {
      dispatch({type: 'QA/saveVisible', payload: false})
    },
    submit(params) {
      const { ques, type } = params;
      if( type === 'staff' ) {
        Toast.info('您没有权限');
        dispatch({type: 'QA/saveVisible', payload: false});
      }else {
        ques?dispatch({type: 'QA/postQuestion', payload: params}):
        Toast.info('问题不能为空')
      }
    }
  }
}

const DealerQAPageWrapper = createForm()(DealerQAPage);
export default connect(mapState2Props, mapDispatch2Props)(DealerQAPageWrapper);