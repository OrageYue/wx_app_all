import request from '../utils/request';
import requestV2 from '../utils/requestV2';

export async function query() {
  // return request(`/api/tools`);
  return requestV2(`/api/v2/tools/`);
}

export async function remove({ id }) {
  // return request(`/api/tools/${id}`, { method: 'delete' });
  return requestV2(`/api/v2/tools/${id}/`, { method: 'delete' });
}

export async function add(params) {
  // return request(`/api/tools`, { method: 'POST', body: params });
  return requestV2(`/api/v2/tools/`, { method: 'POST', body: params });
}

export async function edit({tool_id, lsn_id, tool_name}) {
  return requestV2(`/api/v2/tools/${tool_id}/`, { method: 'PATCH', body: {lsn_id, tool_name} });
}

export async function search({tool_id}) {
  return requestV2(`/api/v2/tools/${tool_id}`, { method: 'GET'});
}


