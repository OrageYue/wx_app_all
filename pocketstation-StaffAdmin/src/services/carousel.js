import request from '../utils/request';
import requestV2 from '../utils/requestV2';

export async function query() {
  // return request(`/api/carousels`);
  return requestV2(`/api/v2/carousels/staff/`);
}

export async function add(params) {
  // return requestV2(`/api/carousels`, { method: 'POST', body: params });
  return requestV2(`/api/v2/carousels/staff/`, { method: 'POST', body: { news: params } });
}
