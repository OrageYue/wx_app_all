import request from '../utils/request';
import requestV2 from '../utils/requestV2';

export async function query() {
  // return request(`/api/news_classes`);
  return requestV2(`/api/v2/news_cls/`);
}

export async function remove({ id }) {
  // return request(`/api/news_classes/${id}`, { method: 'delete' });
  return requestV2(`/api/v2/news_cls/${id}`, { method: 'delete' });
}

export async function add(params) {
  // return request(`/api/news_classes`, { method: 'POST', body: params });
  return requestV2(`/api/v2/news_cls/`, { method: 'POST', body: params });
}

export async function edit({id, name}) {
  return requestV2(`/api/v2/news_cls/${id}`, { method: 'PUT', body: {name} });
}