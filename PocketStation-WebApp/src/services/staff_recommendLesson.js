import request from '../utils/request';
import request_new from '../utils/request_new';
import { getLocalToken } from "../utils/user";
import { host } from '../constants';

function queryStaffRecommendLsn( { user_id } ) {
  const token = getLocalToken();
  // return request_new(`${host}/api/recommend/${user_id}/lessons`, { 
    return request_new(`/api/v2/recommend/${user_id}/lessons/`, { 
    headers: { Token: token } 
  })
}


export default {
  queryStaffRecommendLsn,
}
