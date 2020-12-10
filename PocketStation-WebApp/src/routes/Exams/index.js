import React, { Component } from 'react';
import { connect } from 'dva';
import { getPageQuery } from '../../utils/utils';
import { Flex, WingBlank, Button, Toast, Icon } from 'antd-mobile';
import TestQuesRender from '../../components/ExamRender/TestQuesRender';
import CheckedRender from '../../components/ExamRender/CheckedRender';
import {checkAnswerFn} from '../../components/ExamRender/CheckAnswer';
import {getAnswerFn} from '../../components/ExamRender/GetAnswer';
import styles from './index.less';

class Exams extends Component {
  state = {
    ques: [],  //课程对应的所有题目
    answer: [], //用户提交的答案
    flag: false,  //是否提交试卷
    checkedArr: [],
    optCorrectness: '' //选项字体颜色
  }
  componentDidMount(){
    // const { lesson_id } = getPageQuery();
    // const { getQues } = this.props;
    // getQues(lesson_id);
  }

  //返回课程页面
  goCourseList() {
    window.history.back();
  }

  imgPreview = (img, urls) => {
    window.wx.previewImage({
      current: img,
      urls,
    })
  }

  //获取用户选择结果
  onChange = (id,inx,selected) => {
    let val = selected.target.checked?selected.target.children:'';
    // console.log( selected.target.checked )
    let answer = this.state.answer;
    let arr = [];
    if( selected.target.checked ) {
      let choices = {id,val,inx,checkFlag:true};
      arr.push(choices);
    } else {
      answer.forEach( (item,index) => {
        if( item.id === id && item.inx === inx ) {
          answer.splice( index, 1);
        }
      })
    }
    this.setState({
      answer: [...answer, ...arr]
    })
  }
  
  //用户不做题直接提交
  async getAnswer() {
    const {user_id, post_score} = this.props;
    const { lesson_id } = getPageQuery();
    post_score({user_id, lesson_id: lesson_id*1, score:0});
    this.setState({
      checkedArr: getAnswerFn(this.props.ques),
      flag: true
    })
    Toast.success("试题已提交~", 1);
  }
  
  
  //对比用户选择和答案
  checkAnswer = (answerArr ,data) => {
    let testing_res = checkAnswerFn({answerArr,data});
    this.setState({
      checkedArr: testing_res,
      flag: true
    })
    const { user_id, post_score, history } = this.props;
    const { lesson_id } = getPageQuery();
    const total = testing_res.length;
    let right = testing_res.length;
    let pass = true;

    testing_res.forEach( ts => {
      if( ts.ques_flag) {
        for( var i=0; i< ts.resChoices.length; i++) {
          let itm = ts.resChoices;
          if( itm[i].optCorrectness === 'Cred'||!itm[i].checkFlag&&itm[i].optCorrectness === "Cgreen"){
            right--;
            pass = false;
            break;
          }
        }
      }else {
        right--;
        pass = false;
      }
    })
    // if( pass ) {
    //   Toast.success("通过考试!", 1);
    // }else {
    //   Toast.fail("再接再厉~", 1);
    // }
    Toast.success("试题已提交~", 1);
    post_score({user_id, lesson_id: lesson_id*1, score:right/total});
    history.goBack();
  }
  //结果页渲染
  checkedRender = () => {
    const { checkedArr } = this.state;
    // const { goCourseList } = this.props;
    var arr = [];
    if( checkedArr.length>0 ) { 
    	checkedArr.forEach( (item, index) => {
        arr.push(
          <CheckedRender key={item.ques_id}  item={item} index={index} />
    	)})
      arr.push(<Flex className={styles.btnWrap} justify="end" key={arr.length+1}>
      	<WingBlank>
      		<Button type="primary" size="small" inline onClick={ this.goCourseList }>返回页面</Button>
      	</WingBlank>
      </Flex>) 
    }else{
    	this.getAnswer();
    }
    return arr;
  }
  //答题页渲染
  testQuesRender = ( ques ) => {
    const { answer } = this.state;
    const { submitTest } = this.props;
    var arr = [];
    ques.forEach( (item, index) => {
      arr.push(
        <TestQuesRender 
          key={item.id} 
          imgPreview={this.imgPreview} 
          onOptionChange={this.onChange} 
          item={item} 
          index={index} 
        />
    )})
    arr.push(<Flex className={styles.btnWrap} justify="end" key={arr.length+1}>
      <WingBlank>
        <Button type="primary" size="small" inline onClick={() => submitTest(answer,ques,this.checkAnswer)}>提交</Button>
      </WingBlank>
    </Flex>) 
    return arr;
  }

  
  render() {
    const { flag } = this.state;
    const { loading, ques } = this.props;
    return(
      <Flex className={styles.wrap} justify="center">
        {loading? <Icon type="loading" size="lg" />:
          <Flex direction="column" align="start" className={styles.item}>
            {flag?this.checkedRender():this.testQuesRender(ques) }
          </Flex>}
      </Flex>
    )
  }
}

function mapState2Props({user, question, loading}) {
  let { ques } = question;
  return {
    user_id: user.id,
    ques,
    loading: loading.effects['question/queryQues'],
  }
}

function mapDispatch2Props(dispatch) {
  return {
    // getQues(lesson_id) {
    //   dispatch({type: 'question/queryQues', payload: lesson_id});
    // },
    post_score(params) {
      dispatch({type: 'question/post_test', payload: params});
    },
    //用户提交答案
    submitTest(answer, ques, checkAnswer) {  
      let obj = {};
      let answerArr = [];
      answer.forEach( item => {
        let arr = [];
        arr.push(item.val);
        obj[item.id] = obj[item.id]?[...obj[item.id], ...arr]:arr;
      })

      for( let key in obj ) {
        answerArr.push( {"ques_id":key,"choices":obj[key]} );
      }
      checkAnswer( answerArr, ques )
    },
    
  }
}

export default connect(mapState2Props,mapDispatch2Props)(Exams);