export function getAnswerFn(wrong_questions){
  let checkedArr = [];
  wrong_questions.forEach( ({correct_opts, other_opts, ques_id, content}) => {
    let answerArr = [];
    correct_opts.forEach( it =>{
      answerArr.push({"optCorrectness":"Cgreen","opt":it});
    })
    other_opts.forEach( it =>{
      answerArr.push({"optCorrectness":"","opt":it});
    })
    checkedArr.push({"resChoices":answerArr,ques_id,content})
 })
 return checkedArr;
}
