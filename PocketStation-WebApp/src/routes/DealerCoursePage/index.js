import React, { Component } from 'react';
import { connect } from 'dva';
import TrainingGainsCardGroup from '../../components/TrainingGainsCard/Group';
import Space from '../../components/Space';
import Title from '../../components/Title';
import { Toast, Flex, Icon, WingBlank, Modal, InputItem, TextareaItem } from 'antd-mobile';
import styles from './index.less';
import { getPageQuery } from '../../utils/utils';
import { createForm } from 'rc-form';

class DealerTrain extends Component {
	state = {
		essenceExperience: [],
    newestGains: [],
    course_id: '',
    visible: false,
	}
	componentDidMount() {
    const { training_id } = getPageQuery();
    this.setState({
      course_id: training_id,
    })
    let { getEssenceGains, getGains, queryTrainingLesson } = this.props;
    getEssenceGains( training_id );
    getGains( training_id );
    queryTrainingLesson( training_id );
  }
  goBack = () => {
    this.props.history.goBack();
  }
  showModal = (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      visible: true,
    });
  }
  onClose = () => {
    this.setState({
      visible: false,
    });
  }
  submitGains = () => {
    const { course_id } = this.state;
    let params = {user_id: this.props.user_id, course_id, title:this.props.form.getFieldValue('title'), content: this.props.form.getFieldValue('content') };
    this.props.onExperienceShare( params, this.onClose );
  }
	render() {
    const { essence_gains, gains, lessonInfo, type, loading, form } = this.props;
    const { getFieldProps } = form;
		return (
			<div className={styles.wrap}>
        <Flex>
          <Flex justify="center" className={styles.videoContainer}>
            {/* <Flex justify="start" style={{width: '100%'}}><img src="/back.png" alt="/back.png" width="20px" onClick={this.goBack}/></Flex> */}
            {
              loading ? <Icon type="loading" size="lg" />
              :(<video controls className={styles.vid}>
                  <source src={lessonInfo.content} type="video/mp4" />
                  <source src={lessonInfo.content} type="video/mov" />
                  <source src={lessonInfo.content} type="video/ogg" />
                </video>)
            }
            <Flex style={{width:'100%',position:"absolute",top: '95%'}}><Space /></Flex>
          </Flex>
        </Flex>
        <WingBlank>
          <Flex direction="column" className={styles.gainsContainer} >
            <Title title="精华心得" />
            <TrainingGainsCardGroup gains={essence_gains}/>
            <Title title="最新心得" />
            <TrainingGainsCardGroup gains={gains}/>
          </Flex>
        </WingBlank>
        {type==='dealer'?<Flex className={styles.public} onClick={this.showModal}><img src="/plus.png" alt="/plus.png" width="40px" /></Flex>:null}
        <Modal
          visible={this.state.visible}
          transparent
          onClose={this.onClose}
          title=""
          closable
          footer={[{ text: '发表', fontSize: '14px', onPress: () => this.submitGains() }]}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
          className={styles.modalContainer}
        >
          <InputItem
            {...getFieldProps('title')}
            clear
            placeholder="请输入心得标题"
            className={styles.inp}
          ></InputItem>
          <TextareaItem
            {...getFieldProps('content')}
            className={styles.content}
            title=""
            autoHeight
            clear
            rows={3}
            placeholder="请输入心得内容"
          />
        </Modal>
			</div>
		)
	}
}

function mapState2Props({user, dealer_lessons, loading}) {
  let { essence_gains, gains, lessonInfo } = dealer_lessons;
  return {
    user_id: user.id,
    type: user.type,
    essence_gains,
    gains,
    lessonInfo,
    loading:loading.effects["dealer_lessons/queryTrainingLesson"]
  }
}
function mapDispatch2Props(dispatch) {
  return {
    queryTrainingLesson( course_id ) {
      dispatch({type:'dealer_lessons/queryTrainingLesson', payload: course_id})
    },
    getEssenceGains( course_id ) {
      dispatch({type:'dealer_lessons/queryEssenceGains', payload: course_id})
    },
    getGains( course_id ) {
      dispatch({type:'dealer_lessons/queryGains', payload: course_id})
    },
    onExperienceShare(params, callback) {
      let { title, content } = params;
      if( title&&content  ) {
        dispatch( {type: 'dealer_lessons/postGains', payload: params, callback } )
      }else{
        Toast.info('请填写完整');
      }
    },
  }
}
const DealerTrainWrapper = createForm()(DealerTrain);
export default connect(mapState2Props, mapDispatch2Props)(DealerTrainWrapper);