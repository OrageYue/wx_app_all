import request_new from '@/utils/request_new';

export async function query() {
  return request_new(`/api/v2/get/dealer/new/class/`);
}

export async function remove({ id }) {
  return request_new(`/api/v2/put/dealer/new/class/${id}/`, { method: 'delete' });
}

export async function add(params) {
  return request_new(`/api/v2/get/dealer/new/class/`, { method: 'POST', body: params });
}

export async function edit({ id, name, img_src }) {
  return request_new(`/api/v2/put/dealer/new/class/${id}/`, {
    method: 'PUT',
    body: { name, img_src },
  });
}
