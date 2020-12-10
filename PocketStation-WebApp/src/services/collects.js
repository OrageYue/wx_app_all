import request_new from '../utils/request_new';

function queryCollTools({user_id}) {
  return request_new(`/api/v2/staff/${user_id}/tools/`,{
    headers: {"Content-Type": 'application/json'}
  });
}

function queryLessons({user_id}) {
  return request_new(`/api/v2/staffs/${user_id}/lesson/`,{
    headers: {"Content-Type": 'application/json'}
  });
}

export default {
  queryCollTools,
  queryLessons
}
