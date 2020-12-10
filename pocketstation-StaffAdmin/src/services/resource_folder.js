import requestV2 from '../utils/requestV2';

export async function query() {
  return requestV2(`/api/v2/staff/getresource/folder/`);
}

export async function remove(res_id) {
  return requestV2(`/api/v2/staff/resourcees/${res_id}/`, {
    method: 'DELETE',
  });
}

export async function edit(params) {
  console.log(params);
  let { row, key } = params;
  return requestV2(`/api/v2/staff/resourcees/${key}/`, {
    method: 'PUT',
    body: row,
  });
}
