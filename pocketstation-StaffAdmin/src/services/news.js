import request from '../utils/request';
import requestV2 from '../utils/requestV2';

export async function query() {
  // return request(`/api/news`);
  return requestV2(`/api/v2/newses/`);
}

export async function remove({ id }) {
  // return request(`/api/news/${id}`, { method: 'delete' });
  return requestV2(`/api/v2/news/${id}`, { method: 'delete' });
}

export async function add(params) {
  // return request(`/api/news`, { method: 'POST', body: params });
  return requestV2(`/api/v2/newses/`, { method: 'POST', body: params });
}

export async function edit({ id, data }) {
  return requestV2(`/api/v2/news/${id}`, { method: 'PUT', body: data });
}

export async function search(params) {
  return requestV2(`/api/v2/news/search/`, { method: 'POST', body: params });
}

export async function news_cls_search({ cls_id }) {
  return requestV2(`/api/v2/news/look/${cls_id}`, { method: 'GET' });
}

export async function setTop({ id, top }) {
  top = top === 1 ? 0 : 1;
  return requestV2(`/api/v2/news/${id}`, { method: 'POST', body: { top } });
}
