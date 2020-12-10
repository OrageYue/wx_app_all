import request_new from "../utils/request_new";
import { getLocalToken } from "../utils/user";
import { host } from '../constants';

function query_grat_toCount(user_id) {
  const token = getLocalToken();
  return request_new(`/api/v2/gratitudes/to/${user_id}`, { headers: { Token: token } });
}

function query_grat_fromCount(user_id) {
  const token = getLocalToken();
  return request_new(`/api/v2/gratitudes/from/${user_id}`, { headers: { Token: token } });
}

function query_grat_loginCount(user_id) {
  const token = getLocalToken();
  return request_new(`/api/v2/staff/${user_id}`, { headers: { Token: token } });
}

function query_integral({ user_id }) {
  const token = getLocalToken();
  return request_new(`/api/v2/points/${user_id}`, { headers: { Token: token } });
}


export default {
  query_grat_toCount,
  query_grat_fromCount,
  query_grat_loginCount,
  query_integral,
}
