import request_new from '@/utils/request_new';

export async function queryCarousel() {
  return request_new(`/api/v2/carousel/dealer`);
}

export async function updateCarousel(params) {
  let { id, data } = params;
  return request_new(`/api/v2/carousel/dealer/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleCarousel(key) {
  return request_new(`/api/v2/carousel/dealer/${key}`, {
    method: 'DELETE',
  });
}

export async function postCarousel(params) {
  return request_new(`/api/v2/carousel/dealer`, {
    method: 'POST',
    body: params,
  });
}

export async function query() {
  return request_new(`/api/v2/dealer/banner/`);
}

export async function add(params) {
  return request_new(`/api/v2/dealer/banner/`, { method: 'POST', body: { news: params } });
}
