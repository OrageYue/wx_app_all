import request_new from '@/utils/request_new';

async function query() {
  return request_new(`/api/v2/resources/folder/`);
}

async function remove(res_id) {
  return request_new(`/api/v2/dealer/resources/${res_id}/`, {
    method: 'DELETE',
  });
}

async function edit(params) {
  let { row, key } = params;
  return request_new(`/api/v2/dealer/resources/${key}/`, {
    method: 'PUT',
    body: row,
  });
}

export { query, remove, edit };
