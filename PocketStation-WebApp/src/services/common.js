import request_new from '../utils/request_new';
import request from '../utils/request';
import { getLocalToken } from "../utils/user";
import { host } from '../constants';

function queryDealerCarousel() {
  return request_new(`/api/v2/carousel/dealer`,{
    headers: {"Content-Type": 'application/json'}
  });
}

function queryDealerNews(news_id) {
  const token = getLocalToken();
  return request_new(`/api/v2/carousel/dealer/news/${news_id}`, { headers: { Token: token } });
}

function queryStaffCarousel() {
  const token = getLocalToken();
  return request_new(`/api/v2/carousels/staff/`, {
    headers: { "Token": token }
  })
  
}

export default {
  queryDealerCarousel,
  queryStaffCarousel,
  queryDealerNews,
}
