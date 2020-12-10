import request from "../utils/request";
import request_new from "../utils/request_new";
import { getLocalToken } from "../utils/user";
import { host } from "../constants";

function queryOprt_lsn({openid, subPart_id, types}) {
  console.log(openid)
  const token = getLocalToken();
  // return request(`${host}/api/operations/${subPart_id}/staffs/${user_id}/lessons`, { headers: { Token: token } }).then( ({data}) => ({
    return request_new(`/api/v2/operations/${subPart_id}/staffs/${openid}/lessons/${types}/`, { headers: { Token: token } }).then( ({data}) => ({
    data: data.map( one => (
      { ...one, img_src: host + one.img_src, contents: host+one.contents }
    ))
  }))
}
function queryLsn_info(lsn_id) {
  const token = getLocalToken();
  // return request(`${host}/api/lessons/${lsn_id}`, { headers: { Token: token } });
  return request_new(`/api/v2/lesson/${lsn_id}`, { headers: { Token: token } })
}

function queryLsn_comments(lsn_id) {
  const token = getLocalToken();
  // return request(`${host}/api/lessons/${lsn_id}/comments`, { headers: { Token: token } });
  return request_new(`/api/v2/lessons/${lsn_id}/comments/`, { headers: { Token: token } });
}

// function query_user_collect(user_id) {
//   const token = getLocalToken();
//   return request_new(`/api/v2/staffs/${user_id}/collections/`, { headers: { Token: token } });
// }

function collect({lesson_id, user_id}) {
  const token = getLocalToken();
  let params = {lsn_id: lesson_id*1, staff_id: user_id};
  // return request(`${host}/api/collections`, {
  return request_new(`/api/v2/collections/`, {
    method:"POST", 
    body:JSON.stringify(params), 
    headers: { "Content-Type": 'application/json', Token: token }
  });
}

function de_collect({lesson_id, user_id}) {
  lesson_id = lesson_id * 1;
  user_id = user_id;
  const token = getLocalToken();
  return request_new(`/api/v2/staffs/${user_id}/collections/${lesson_id}/`, {
    method:"DELETE",
    headers: { "Content-Type": 'application/json', Token: token }
  });
}

// function query_user_thumb(user_id) {
//   const token = getLocalToken();
//   return request_new(`/api/v2/staffs/${user_id}/thumb/`, { headers: { Token: token } });
// }

function thumb({lesson_id, user_id}) {
  const token = getLocalToken();
  let params = {lsn_id: lesson_id*1, staff_id: user_id};
  console.log( params  )
  // return request(`${host}/api/thumbs`, {
    return request_new(`/api/v2/thumbs/`, {
    method:"POST", 
    body:JSON.stringify(params), 
    headers: { "Content-Type": 'application/json', Token: token }
  });
}

function dl_thumb({lesson_id, user_id}) {
  return request_new(`/api/v2/staffs/${user_id}/thumbs/${lesson_id}/`, {
    method:"DELETE"
  });
}

function postComment({lesson_id, user_id, content}) {
  // function postComment({lesson_id, openid, types, content}) {
  const token = getLocalToken();
  let params = {lsn_id: lesson_id*1, staff_id: user_id, content};
  // let params = {lsn_id: lesson_id*1, openid, types, content};
  // return request(`${host}/api/comments`, {
  return request_new(`/api/v2/les_comment/`, {
    method:"POST", 
    body:JSON.stringify(params), 
    headers: { "Content-Type": 'application/json', Token: token}
  });
}

export default {
  queryOprt_lsn,
  queryLsn_info,
  queryLsn_comments,
  // query_user_collect,
  collect,
  de_collect,
  thumb,
  dl_thumb,
  postComment,
  // query_user_thumb,
}
