import request from '../utils/request';
import request_new from '../utils/request_new';
import { getLocalToken } from "../utils/user";

async function queryFAQ() {
  return request_new(`/api/v2/QA/FAQ/`, {headers: {'Token': getLocalToken()}});
}

async function queryActions() {
  return request_new(`/api/v2/QA/actions`, {headers: {'Token': getLocalToken()}});
}

async function postQuestion({ ques, user_id, type}) {
  const params = {ques, type};
  return request_new(`/api/v2/QA/${user_id}/actions/`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {"Content-Type": "application/json"}
  });
}

async function queryAction(id) {  //获取某一个action
  return request_new(`/api/v2/QA/action/${id}`, {headers: {'Token': getLocalToken()}});
}

async function queryReplys(id) {  //获取某一问题的所有回复
  return request_new(`/api/v2/QA/action/${id}/replys`, {headers: {'Token': getLocalToken()}});
}

async function postReply({ reply, user_id, ques_id}) {  //提交回复
  ques_id = ques_id*1;
  return request_new(`/api/v2/QA/action/${ques_id}/replys/${user_id}`, {
    method: 'POST',
    body: JSON.stringify({reply}),
    headers: {'Token': getLocalToken()}
  });
}

export default {
  queryFAQ,
  queryActions,
  postQuestion,
  queryAction,
  queryReplys,
  postReply,
}