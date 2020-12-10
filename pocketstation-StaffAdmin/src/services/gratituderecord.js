import request from '../utils/request';
import requestV2 from '../utils/requestV2';
// 感谢
export async function query() {
  // return request('/api/gratitudes');
  return requestV2('/api/v2/gratitudes/');
}

export async function remove({ gra_id }) {
  // return request(`/api/gratitudes/${gra_id}`, {method:"delete"});
  return requestV2(`/api/v2/gratitudes/${gra_id}`, { method: 'delete' });
}

export async function search({ _from, _to }) {
  return requestV2(`/api/v2/grattrees/`, { method: 'POST', body: { _from, _to } });
}

export default {
  query,
  remove,
  search,
};
