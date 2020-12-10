import request from '../utils/request';
import requestV2 from '../utils/requestV2';

export async function query() {
  // return request(`/api/questions`);
  return requestV2(`/api/v2/questions/`);
}

export async function remove({ id }) {
  // return request(`/api/questions/${id}`, { method: 'delete' });
  return requestV2(`/api/v2/questions/${id}`, { method: 'delete' });
}

export async function add(params) {
  // return request(`/api/questions`, { method: 'POST', body: params});
  return requestV2(`/api/v2/questions/`, { method: 'POST', body: params });
}

export async function search({ lsn_id }) {
  return requestV2(`/api/v2/questions/${lsn_id}`, { method: 'GET' });
}
