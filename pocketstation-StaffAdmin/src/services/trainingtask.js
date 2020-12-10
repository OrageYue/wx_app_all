import request from '../utils/request';
import requestV2 from '../utils/requestV2';

export async function query() {
  // return request(`/api/trainingtasks`);
  return requestV2(`/api/v2/traintask/`);
}

export async function remove({ id }) {
  // return request(`/api/trainingtasks/${id}`, { method: 'delete' });
  return requestV2(`/api/v2/traintask/${id}`, { method: 'delete' });
}

export async function add(params) {
  // return request(`/api/trainingtasks`, { method: 'POST', body: params });
  return requestV2(`/api/v2/traintask/`, { method: 'POST', body: params });
  
}
