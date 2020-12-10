export function checkAnswerFn({answerArr,data}){
  data.forEach( (itm) => {
    let optFlagArr = [];
    const {other_option, correct_option, content} = itm;
    answerArr.forEach( (item,index) => {
      if(itm.id===item.ques_id*1){
        optFlagArr.push('true');
        const { choices } = item;
        let optArr = [];
        correct_option.forEach( it => {  //正确
          if( choices.indexOf(it)===-1 ) { 
            optArr.push({"optCorrectness":"Cgreen","opt":it,"checkFlag": false})
          }else{
            optArr.push({"optCorrectness":"Cgreen","opt":it,"checkFlag": true})
          }
        })
        other_option.forEach( it => { //其他
          if( choices.indexOf(it)===-1 ) {
            optArr.push({"optCorrectness":"","opt":it,"checkFlag": false})
          }
        })
        choices.forEach( it =>{  //用户选择错误
          if( other_option.indexOf(it)!==-1 ) {
            optArr.push({"optCorrectness":"Cred","opt":it,"checkFlag": true})
          }
        })
        answerArr[index] = {"resChoices":optArr,ques_id:itm.id,content, ques_flag: true };
      }else{
        optFlagArr.push('false');
      }
    })
    if( optFlagArr.indexOf('true')===-1 ) {  //处理用户有没有选择的题目
      let otherOptArr = [];
      correct_option.forEach( it => {  //正确
        otherOptArr.push({"optCorrectness":"Cgreen","opt":it})
      })
      other_option.forEach( it => { //其他
        otherOptArr.push({"optCorrectness":"","opt":it})
      })
      answerArr[answerArr.length] = {"resChoices":otherOptArr,ques_id:itm.id,content, ques_flag: false };
    }
  })
  return answerArr;
}

