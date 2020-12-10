import request from "../utils/request";
import request_new from "../utils/request_new";
import { getLocalToken } from "../utils/user";
import { host } from "../constants";

// function queryCarouselList() {
//   const token = getLocalToken();
//   return request(`${host}/api/carousels`, { headers: { "Token": token } });
// }

function query_hot() {
  const token = getLocalToken();
  // return request(`${host}/api/hots`, {
  return request_new(`/api/v2/hots/`, {
    headers: { "Token": token }
  }).then(({ data }) => ({
    data: data.map(one => (
        { ...one, img_src: host + one.img_src }
       )) 
   }))
}

function get_all() {  //获取所有员工
  const token = getLocalToken();
  return request_new(`/api/v2/staffs/`, {
    headers: { "Token": token }
  }).then(({ data }) => ({
    data: data.map(one => (
        { ...one, avatar: host + one.avatar }
    ))
  }));
}

export default {
  // queryCarouselList,
  query_hot,
  get_all,
}