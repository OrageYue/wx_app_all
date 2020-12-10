import request from '../utils/request';
import requestV2 from '../utils/requestV2';

export async function query() {
  // return request(`/api/operations`);
  return requestV2(`/api/v2/oper/`);
}

export async function remove({ oper_id }) {
  // return request(`/api/operations/${oper_id}`, { method: 'delete' });
  return requestV2(`/api/v2/oper/${oper_id}`, { method: 'delete' });
}

export async function add(params) {
  // return request(`/api/lesson_classes/${params.cls_id}/operations`, { method: 'POST', body: params });
  return requestV2(`/api/v2/oper/`, { method: 'POST', body: params });
}

export async function updateS({ oper_id, data }) {
  // return request(`/api/operations/${oper_id}`, {method:"PATCH", body: data});
  return requestV2(`/api/v2/oper/${oper_id}`, { method: 'PUT', body: data });
}
