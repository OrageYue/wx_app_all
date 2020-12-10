import request from '@/utils/request';
import request_new from '@/utils/request_new';

async function postResource(params) {
  return request_new(`/api/v2/hier/`, {
    method: 'POST',
    body: params,
  });
}

async function queryResources() {
  return request_new(`/api/v2/resources/all`);
}

async function deleResource(res_id) {
  return request_new(`/api/v2/resources/${res_id}`, {
    method: 'DELETE',
  });
}

async function updateResource(params) {
  let { row, key } = params;
  return request_new(`/api/v2/resources/${key}`, {
    method: 'PUT',
    body: row,
  });
}

async function queryHier() {
  return request_new(`/api/v2/hier/`, {
    method: 'GET',
  });
}

async function search(params) {
  return request_new(`/api/v2/dealer/resources/search/`, { method: 'POST', body: params });
}

export { queryResources, postResource, deleResource, updateResource, queryHier, search };
