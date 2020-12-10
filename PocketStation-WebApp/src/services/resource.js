import request from '../utils/request';
import request_new from '../utils/request_new';
import { getLocalToken } from "../utils/user";

async function query( resId ) {
  return request_new(`/api/v2/resources/${resId}`, {headers: {'Token': getLocalToken()}});
}

// async function queryThisNode( resId ) {
//   return request_new(`/api/v2/resources/${resId}?this=true`, {headers: {'Token': getLocalToken()}});
// }

async function query_resources_staff({ resId, user_id, hier }) {
  return request_new(`/api/v2/staff/${user_id}/hier/${hier}/resources/${resId}/`, {headers: {'Token': getLocalToken()}});
  // return request_new(`/api/v2/staffs/resources/${resId}/`, {headers: {'Token': getLocalToken()}});
}

export default {
  query, 
  // queryThisNode,
  query_resources_staff,
}
