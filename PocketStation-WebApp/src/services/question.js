import request_new from '../utils/request_new';
import request from '../utils/request';
import { getLocalToken } from "../utils/user";
import { host } from "../constants";

function get_ques(lsn_id) {
  const token = getLocalToken();
  return request_new(`/api/v2/questions/${lsn_id}`,{
    headers: { "Content-Type": 'application/json', Token: token }
  }).then(
    ({data:questions})=>{
      questions.map(data=>{
        data.correct_option = data.correct_option.split("#");
        data.other_option = data.other_option==="" ? [] : data.other_option.split("#");
        return data
      });
      return {data: questions};
    }
  );
}

function post_test({lesson_id,user_id, score}) {
  const token = getLocalToken();
  let params = {lsn_id: lesson_id, staff_id: user_id, score };
  return request_new(`/api/v2/testing/`, {
    method:"POST", 
    body:JSON.stringify(params),
    headers: { "Content-Type": 'application/json', Token: token }
  });
}

function post_new_exam(params) {
  return request_new(`/newtest/`,{
    method: 'POST',
    body: JSON.stringify(params),
  });
}


export default {
  get_ques,
  post_test,
  post_new_exam,
}