import { Flex, WhiteSpace, WingBlank, TextareaItem, Button, Toast } from "antd-mobile";
import { connect } from 'dva';
import React, { Component } from 'react';
import HeaderTitle from '../../components/HeaderTitle';
import DealerReplyGroup from '../../components/DealerReplyGroup';
import { getPageQuery, compare } from '../../utils/utils';
import { createForm } from 'rc-form';
import styles from './index.less';


class DealerActionDetail extends Component {

   onSubmit = async () => {
    const { id } = getPageQuery(window.location.href);
    const { getFieldValue, setFieldsValue } = this.props.form;
    const { user_id, onReply, onReplys } = this.props;
    const answer = getFieldValue('reply');
    answer ? onReply({reply: answer, ques_id: id, user_id}) : Toast.info('回复不能为空');
    await onReplys(id);
    setFieldsValue({reply: ''});
  }
  onCancel = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({reply: ''});
  }

  render() {
    const { question, replys } = this.props;
    const { getFieldProps } = this.props.form;
    replys.sort(compare('reply_id'));
    return (
      <WingBlank style={{height: '100%'}}>
        <Flex style={{height: '100%', width:"100%"}} direction="column" align='center'>
          <WhiteSpace size="lg"/>
          <HeaderTitle />
          <WhiteSpace size="lg"/>
          <Flex style={{flex:1}} direction="column" align="start" justify="start" className={styles.con_container}>
            <Flex className={styles.ques_title}>{question.ques}</Flex>
            <WhiteSpace size="lg" />
            <Flex className={styles.replyContainer} align="start" justify="start">
              <DealerReplyGroup replys={replys} />
            </Flex>
            <Flex justify="between" className={styles.reply_bottom}>
              <TextareaItem 
                {...getFieldProps('reply')}
                autoHeight
                rows={1} 
                className={styles.replyInp}
                placeholder="我的回复..."
              />
              <Button size="small" type="primary" style={{color: '#fff'}} onClick={this.onSubmit}>发布</Button>
              <Button size="small" style={{backgroundColor: '#ccc', color: '#fff', marginRight: '4px'}} onClick={this.onCancel}>取消</Button>
            </Flex>
          </Flex>
        </Flex>
      </WingBlank>
    )
  }
}

function mapState2Props({ user, dealer_interAction }) {
  let { question, replys } = dealer_interAction;
  return {
    user_id: user.id,
    question,
    replys,
  }
}

function mapDispatch2Props( dispatch ) {
  return {
    onReply( params ) {
      dispatch({type: 'dealer_interAction/postReply', payload: params});
    },
    onReplys(id) {
      dispatch({type:'dealer_interAction/queryReplys', payload: id});
    }
  }
}

const DealerActionDetailWrapper = createForm()(DealerActionDetail);

export default connect(mapState2Props, mapDispatch2Props)(DealerActionDetailWrapper);