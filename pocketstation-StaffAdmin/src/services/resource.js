import requestV2 from '../utils/requestV2';

export async function query() {
  return requestV2(`/api/v2/staff/getresource/`);
}

export async function remove(res_id) {
  return requestV2(`/api/v2/staff/resource/${res_id}/`, {
    method: 'DELETE',
  });
}

export async function edit(params) {
  let { row, key } = params;
  return requestV2(`/api/v2/staff/resource/${key}/`, {
    method: 'PUT',
    body: row,
  });
}

export async function add(params) {
  return requestV2(`/api/v2/staff/getresource/`, {
    method: 'POST',
    body: params,
  });
}

export async function queryHier() {
  return requestV2(`/api/v2/staff/resource/hier/`, {
    method: 'GET',
  });
}

export async function search(params) {
  return requestV2(`/api/v2/user/resource/search/`, { method: 'POST', body: params });
}