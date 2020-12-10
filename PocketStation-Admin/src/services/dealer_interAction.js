import request_new from '@/utils/request_new';
import { getLocalToken } from '@/utils/user';

async function queryQues() {
  let token = getLocalToken();
  return request_new('/api/v2/QA/actions', { headers: { Token: token } });
}

async function queryReplys(ques_id) {
  let token = getLocalToken();
  return request_new(`/api/v2/QA/action/${ques_id}/replys`, { headers: { Token: token } });
}

async function deleActions(ques_id) {
  let token = getLocalToken();
  return request_new(`/api/v2/QA/action/${ques_id}`, {
    method: 'delete',
    headers: { Token: token },
  });
}

export { queryQues, queryReplys, deleActions };
