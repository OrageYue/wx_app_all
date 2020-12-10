import request from '@/utils/request';
import request_new from '@/utils/request_new';

import { getLocalToken } from '@/utils/user';

async function queryFaqs() {
  let token = getLocalToken();
  return request_new(`/api/v2/QA/FAQ/`, { headers: { Token: token } });
}

async function queryFaq(faq_id) {
  let token = getLocalToken();
  return request_new(`/api/v2/QA/FAQ/${faq_id}`, { headers: { Token: token } });
}

async function deleFaqs(faq_id) {
  let token = getLocalToken();
  return request_new(`/api/v2/QA/FAQ/${faq_id}`, {
    method: 'delete',
    headers: { Token: token },
  });
}

async function postFAQ(params) {
  let token = getLocalToken();
  return request_new(`/api/v2/QA/FAQ/`, {
    method: 'POST',
    body: params,
    headers: { Token: token },
  });
}

async function updateFAQ({ fieldsValue, id }) {
  let token = getLocalToken();
  return request_new(`/api/v2/QA/FAQ/${id}`, {
    method: 'PUT',
    body: fieldsValue,
    headers: { Token: token },
  });
}

export { queryFaqs, queryFaq, deleFaqs, postFAQ, updateFAQ };
