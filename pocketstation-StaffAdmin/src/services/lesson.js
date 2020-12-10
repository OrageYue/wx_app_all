import request from '../utils/request';
import requestV2 from '../utils/requestV2';

export async function query() {
  // return request(`/api/lessons`);
  return requestV2(`/api/v2/lesson/`);
}

export async function remove({ lsn_id }) {
  // return request(`/api/lessons/${lsn_id}`, { method: 'delete' });
  return requestV2(`/api/v2/lesson/${lsn_id}`, { method: 'delete' });
}

export async function add(params) {
  // console.log( params.permissions )
  let { permissions } = params;
  let obj = {};
  permissions.forEach((el, inx) => {
    obj[inx] = el;
  });
  params.permissions = obj;
  return requestV2(`/api/v2/lesson/`, { method: 'POST', body: params });
}

export async function updateS({ lsn_id, data }) {
  // return request(`/api/lessons/${lsn_id}`, { method: 'PATCH', body: data });
  return requestV2(`/api/v2/lesson/${lsn_id}`, { method: 'PUT', body: data });
}

export async function set_recommend({ id, recommended }) {
  recommended = recommended === 1 ? 0 : 1;
  return requestV2(`/api/v2/lesson/${id}`, { method: 'POST', body: { recommended } });
}

export async function set_islook({ id, is_look }) {
  is_look = is_look === 1 ? 0 : 1;
  return requestV2(`/api/v2/is_look/${id}/lessons/`, { method: 'POST', body: { is_look } });
}

export async function push(params) {
  params = params.map(item => item.bu.id);
  return requestV2(`/api/v2/get/staffs/lesson/`, {
    method: 'POST',
    body: { permissions: JSON.stringify(params) },
  });
}

export async function pushInfo({ selected, name }) {
  return requestV2(`/api/v2/push/lesson/`, {
    method: 'POST',
    body: { selected: JSON.stringify(selected), name },
  });
}

// [
//   {
//     bu_id: 1,
//     staffs: [
//       {
//         id: 2,
//         name: 'xx'
//       }
//     ]
//   },

// ]
