import request from '../utils/request';
import request_new from '../utils/request_new';
import { getLocalToken } from "../utils/user";
import { host } from '../constants';

async function queryNews ( news_id ) {
  const token = getLocalToken();
  return request_new(`/api/v2/news/${news_id}`, {headers: {'Token': token}}).then(({ data: news })=> {
    news.content = JSON.parse(news.content).map(url=>host+url);
    return { data: news }
  });
}

async function queryNews_classes() {
  const token = getLocalToken();
  return request_new(`/api/v2/news_cls/`, {headers: {'Token': token}});
}

function get_all() {
  const token = getLocalToken();
  return request_new(`/api/v2/newses/`,{
    headers: { "Token": token }
  })
  // .then(({ data: newses }) => {
  //   newses.map(news => {
  //       news.content = JSON.parse(news.content);
  //       return news
  //   });
  //   return { data: newses };
  // });
}

export default {
  queryNews,
  queryNews_classes,
  get_all,
}