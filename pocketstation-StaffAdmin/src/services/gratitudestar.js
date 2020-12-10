import request from '../utils/request';
import requestV2 from '../utils/requestV2';

export async function query() {
  // return request('/api/gratitude_stars');
  return requestV2('/api/v2/gratstar/');
}

export async function add(params) {
  // return request('/api/gratitude_stars', { method: 'POST', body: params });
  return requestV2('/api/v2/gratstar/', { method: 'POST', body: params });
}
