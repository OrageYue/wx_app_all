import request_new from '@/utils/request_new';

export async function queryNews() {
  return request_new(`/api/v2/dealer/news/`);
}

export async function remove({ id }) {
  return request_new(`/api/v2/get/dealer/new/${id}/`, { method: 'delete' });
}

export async function add(params) {
  return request_new(`/api/v2/dealer/news/`, { method: 'POST', body: params });
}

export async function edit({ id, data }) {
  return request_new(`/api/v2/get/dealer/new/${id}/`, { method: 'PUT', body: data });
}

export async function search(params) {
  return request_new(`/api/v2/serach/dealer/new/name/`, { method: 'POST', body: params });
}

export async function news_cls_search({ cls_id }) {
  return request_new(`/api/v2/search/dealer/new/class/${cls_id}/`, { method: 'GET' });
}
