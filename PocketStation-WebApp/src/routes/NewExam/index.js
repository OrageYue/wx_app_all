import { Flex, WingBlank, WhiteSpace, TextareaItem, Button, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import styles from './index.less';
import React, { Component } from 'react';
import NewQuestion from '../../components/NewQuestion';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import QuesServices from '../../services/question';

class NewExam extends Component {
  state = {
    answer: [],
    sel: [
      {
        id: 1,
        content: '脑脊膜分三层,分别是',
        option: ['硬脑膜','软脑膜','蛛网膜','腱膜']
      },
      {
        id: 2,
        content: '下列哪些是人工硬脑膜在使用中会出现的问题',
        option: ['脑脊液漏','感染','异物排斥','脑疝']
      },
      {
        id: 3,
        content: '下列哪些是神经补钙常见的取材来源',
        option: ['猪跟腱','人工合成','牛跟腱','猪心包']
      },
      {
        id: 4,
        content: '贝朗神经补片的特性有',
        option: ['独特的微孔结构','人工合成','需要缝合','不可吸收']
      },
      {
        id: 5,
        content: '需要缝合的神经补片最大的优点是',
        option: ['预防感染','预防出血','抗高颅压','防止脑脊液漏']
      },
      {
        id: 6,
        content: '最常见的需要二开开颅的哪种手术',
        option: ['大骨瓣减压术','脑动脉瘤','胶质瘤','垂体瘤']
      },
      {
        id: 7,
        content: '补片使用的禁忌症有哪些',
        option: ['大骨瓣减压术','开放性脊柱裂','感染区域','开放性颅脑外伤']
      },
      {
        id: 8,
        content: '贝朗神经补片的常用规格是: __, __;最大规格是: __',
        option: ['4*5, 4*10, 6*2','4*5, 6*8, 12*14','4*5, 6*12, 12*14','4*5, 4*10, 12*14']
      },
      {
        id: 9,
        content: '下列哪些产品是可以吸收的',
        option: ['强生duraform','冠朗','贝朗神经补片','Intergra']
      },
      {
        id: 10,
        content: '下列哪些产品是可缝合的',
        option: ['强生duraform','冠朗','贝朗神经补片','Intergra']
      },
      {
        id: 11,
        content: '翼点入路最适合处理',
        option: ['鞍上池','枕大池','终池','鞍内']
      },
      {
        id: 12,
        content: '脑的主要组成部分',
        option: ['大脑、小脑、脑干','端脑、小脑、脑干、间脑','端脑、小脑、延髓','大脑、小脑、脑桥、延髓、中脑']
      },
      {
        id: 13,
        content: '一侧颈内动脉闭塞，可无临床症状，是因为',
        option: ['同侧颈外动脉未闭塞可迅速机那里侧支循环','正常脑底动脉环可迅速建立侧支循环','双侧椎动脉未闭塞可迅速建立侧支循环','颅内血管变异可迅速建立侧支循环']
      },
      {
        id: 14,
        content: '脑出血最创建的原因是',
        option: ['脑动脉炎','高血压和脑动脉硬化','血液病','脑动脉肿瘤']
      },
      {
        id: 15,
        content: '蛛网膜下腔出血最常见的病因是',
        option: ['高血压','脑动脉粥样硬化','先天性颅内动脉瘤','脑血管畸形']
      },
      {
        id: 16,
        content: '“盒状锁”设计的优势',
        option: ['稳定性好','对颚部的精确导引','防止“剪切”的作用','无创，无锐利边角']
      },
      {
        id: 17,
        content: 'RoseGold玫瑰金头端最小直径是__，最大直径是__;工作长度最长为__',
        option: ['0.5MM; 2.0MM; 155MM','0.5MM; 2.5MM; 160MM','0.2MM; 2.0MM; 160MM','0.2MM; 2.5MM; 155MM']
      },
      {
        id: 18,
        content: '以下哪些不是蛇牌proGAV可调压分流管重力阀的开启压力',
        option: ['5cm','10cm','15cm','20cm']
      },
      {
        id: 19,
        content: '对于常压脑积水病人，我们推荐proGAV可调压分流管初始压力设置是多少',
        option: ['0-15cm','3-7cm','5-7cm','11-13cmm']
      },
      {
        id: 20,
        content: 'ZEBRA动脉瘤夹,从颚部顶端开始，每隔( )有一个标记，目前国内有( )中型号',
        option: ['1mm/5','2mm/5','5mm/6','5mm/5']
      },
    ],
    blanks: [
      '颅骨固定钛钉的施钉钳在压力到达多少时自动解除压力？',
      '颅骨固定钛钉有几个规格，分别是多少mm',
      '蛇牌关颅产品有哪几种？',
      '蛇牌有哪些单面固定关颅产品？',
      '蛇牌有哪些双面固定关颅产品？',
      '可吸收钉有哪几个规格？',
      '请举出可吸收钉的三个特点:',
      '列举神经外科手术常用的体位:_______，_________，________，________，_________。',
      '翼点的概念：是_______、_______、_______和_______4骨相交处所形成的“H”形骨缝称为翼点。',
      '脑膜瘤大部分来自________，也与内环境改变和基因变异有关.',
      '对脑膜瘤的治疗，以________为主。________是有效的辅助治疗手段.',
      '__________是最常见的颅内原发性神经系统肿瘤.',
      '胶质瘤按恶性程度划分,可分为:_____________和_____________.',
      '胶质瘤最常见的表现是_________.  ____________是胶质瘤治疗的第一步.',
      '列举三个术中区分胶质瘤边界的方法:__________，___________，___________. ',
      '2017年是贝朗________周年， 蛇牌Aesculap_______周年。',
      '以下颅底肿瘤可以通过哪种入路：前颅底：_______,中颅底：_______,后颅底：_______',
      'Yasargil脑动脉瘤夹的优点，列举5个：_____、_________、_________、_________、______。',
      '请说明以下颜色标识的意义：瘤夹颚部金色:______,瘤夹颚部银色: ________,蓝色弹簧圈:________,紫红色弹簧圈:________,金色夹子:________,银色夹子:________',
      '目前临床MRI检查的磁场强度分别是_____Tesla和______Tesla; Yasargil脑动脉瘤夹能兼容_____Tesla的磁场强度。',
      'GN160主机______模式可以自动检测夹持组织的_______并智能的降低主机输出功率。____________（可以/不可以）显示版本号和SN序列号。',
      '影响植入分流管的患者脑室压力的4个因子_____，______，_______，_________。',
      '目前市面上可抗3.0 T磁场的分流管是__________________。',
      '脑积水分流装置的主要达到的目的是________。'
    ],
    shortAnswer: [
      'Elan 4从动力来源来说分为哪两个系统？',
      '与MicroSpeed Uni相比，Elan 4具有哪些优势？',
    ],
    picQues: [
      {
        content: '请看图写出对应双极镊的名称以及至少四点特性和优势',
        url: ['/ques_1-1.png','/ques_1-2.png','/ques_1-3.png','/ques_1-4.png'],
      },
      {
        content: '请写出以下施夹钳系列的名称及特点，并解答为何使用施夹钳时，施夹钳的材质必须与瘤夹保持一致。',
        url: ['/ques_2-1.png','/ques_2-2.png','/ques_2-3.png','/ques_2-4.png'],
      }
    ]
  }
  getInpAns = () => {
    const { getFieldValue } = this.props.form;
    let blanksArr = [];
    let shortAnsArr = [];
    let picQuesArr = [];

    for( let i=0; i<24; i++ ) {
      blanksArr.push({id:i+1, answer: getFieldValue(`blank_${i}`)})
    }
    for( let i=0; i<2; i++ ) {
      shortAnsArr.push({id:i+1, answer: getFieldValue(`shortAns_${i}`)})
    }

    for( let i=0; i<4; i++ ) {
      picQuesArr.push({id:i+1, answer: getFieldValue(`picQues_${i}`)})
    }
    return {blanks:blanksArr,shortAns:shortAnsArr,picQues:picQuesArr};
  }

  submitTest = async () => {
    let selAnswer = this.state.answer;
    let obj = {};
    let selArr = [];
    selAnswer.forEach( item => {
      let arr = [];
      arr.push(item.val);
      obj[item.id] = obj[item.id]?[...obj[item.id], ...arr]:arr;
    })

    for( let key in obj ) {
      selArr.push( {"ques_id":key,"choices":obj[key]} );
    }
    const inpAns = this.getInpAns();

    const testAnswer = {sel:selArr, ...inpAns };
    const { data, err } = await QuesServices.post_new_exam({staff_id: this.props.id, content: testAnswer});
    
    if( err ) {
      Toast.info('请刷新页面，重新提交');
    }else {
      Toast.info('恭喜你，试题已上传');
      this.props.onBack();
    }
    
  }

  onChange = (id,inx,selected) => {
    let val = selected.target.checked?selected.target.children:'';
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

  render() {
    let { sel, blanks, shortAnswer, picQues } = this.state;
    const { getFieldProps } = this.props.form;
    return (
      <WingBlank>
        <Flex className={styles.select_ques} justify="start" align="start" direction="column">
          <h1 style={{fontSize: '13px'}}>一、不定项选择题</h1>
          <NewQuestion sel={sel} onChange={this.onChange}/>
          <h1 style={{fontSize: '13px'}}>二、填空题</h1>
          <Flex direction="column" align="start" className={styles.bSpace} >
            {
              blanks.map( (item, index) => (
                <WingBlank key={index} style={{width: '92%'}}>
                  <WhiteSpace size="lg"/>
                  <Flex className={styles.ques_tit}>{index+1}.{item}</Flex>
                  <Flex className={styles.textarea}>
                    <TextareaItem
                      {...getFieldProps(`blank_${index}`)}
                      rows={3}
                    />
                  </Flex>
                  <WhiteSpace size="lg"/>
                </WingBlank>
              ))
            }
          </Flex>
          <h1 style={{fontSize: '13px'}}>三、简答题</h1>
          <Flex direction="column" align="start" className={styles.bSpace} >
            {
              shortAnswer.map( (item, index) => (
                <WingBlank key={index} style={{width: '92%'}}>
                  <WhiteSpace size="lg"/>
                  <Flex className={styles.ques_tit}>{index+1}.{item}</Flex>
                  <Flex className={styles.textarea}>
                    <TextareaItem
                      {...getFieldProps(`shortAns_${index}`)}
                      rows={3}
                    />
                  </Flex>
                  <WhiteSpace size="lg"/>
                </WingBlank>
              ))
            }
          </Flex>
          <h1 style={{fontSize: '13px'}}>四、填图题</h1>
          <Flex direction="column" align="start" className={styles.bSpace} >
            {
              picQues.map( (item, index) => (
                <WingBlank key={index} style={{width: '92%'}}>
                  <WhiteSpace size="lg"/>
                  <Flex className={styles.ques_tit}>{index+1}.{item.content?item.content:''}</Flex>
                  {
                    item.url.map( im => (<img key={im} src={im} alt={im} style={{width: '240px', height: '60px', marginBottom: '20px'}} />))
                  }
                  <Flex className={styles.textarea}>
                    <TextareaItem
                      {...getFieldProps(`picQues_${index}`)}
                      rows={3}
                    />
                  </Flex>
                  <WhiteSpace size="lg"/>
                </WingBlank>
              ))
            }
          </Flex>
          <Flex className={styles.btnWrap}>
            <Button type="primary" size="small" inline onClick={() => this.submitTest()}>提交</Button>
          </Flex>
        </Flex>
      </WingBlank>
    )
  }
}

function mapState2Props({ user }) {
  return {
    id: user.id,
  }
}
function mapDispatch2Props( dispatch ) {
  return {
    onBack() {
      dispatch( routerRedux.push('/staff/index') );
    }
  }
}

const NewExamWrapper = createForm()(NewExam);
export default connect( mapState2Props, mapDispatch2Props)(NewExamWrapper);