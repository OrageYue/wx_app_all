import request from '../utils/request';
import requestV2 from '../utils/requestV2';

export async function query() {
  // return request(`/api/hots`);
  return requestV2(`/api/v2/hots/`);
}

export async function add(params) {
  // return request(`/api/hots`, { method: 'POST', body: params });
  return requestV2(`/api/v2/hots/`, { method: 'POST', body: { news: params } });
}
