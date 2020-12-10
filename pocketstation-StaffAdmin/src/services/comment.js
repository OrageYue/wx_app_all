import request from '../utils/request';
import requestV2 from '../utils/requestV2';

export async function query() {
  // return request(`/api/comments`);
  return requestV2(`/api/v2/les_comment/`);
}

export async function remove({ id }) {
  // return request(`/api/comments/${id}`, { method: 'delete' });
  return requestV2(`/api/v2/les_comment/${id}`, { method: 'delete' });
}

export async function add(params) {
  // return request(`/api/lesson_classes/${params.cls_id}/operations`, { method: 'POST', body: params });
}

export async function staff_search({ staff_id }) {
  // return request(`/api/comments/${id}`, { method: 'delete' });
  return requestV2(`/api/v2/staff/${staff_id}/comments/`, { method: 'GET' });
}

export async function lsn_search({ lsn_id }) {
  return requestV2(`/api/v2/lessons/${lsn_id}/comments/`, { method: 'GET' });
}
