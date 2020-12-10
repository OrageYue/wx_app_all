import request from "../utils/request";
import request_new from "../utils/request_new";
import { getLocalToken } from "../utils/user";
import { host } from "../constants";

function queryToolInfo(tool_id) {
  const token = getLocalToken();
  return request_new(`/api/v2/tools/${tool_id}/`, { headers: { Token: token } });
}

// function queryCollect( user_id ) {
//   const token = getLocalToken();
//   // return request(`${host}/api/staffs/${user_id}/toolcollections`, { headers: { Token: token } });
//   return request_new(`/api/v2/staffs/${user_id}/toolcollections/`, { headers: { Token: token } });
// }

function collect({user_id, tool_id}) {
  let params = {tool_id: tool_id*1, staff_id: user_id*1};
  const token = getLocalToken();
  return request_new(`/api/v2/toolcollections/`, { 
    method: 'POST',
    body: JSON.stringify(params),
    headers: { Token: token }
  });
}

function de_collect({tool_id, user_id}) {
  tool_id = tool_id * 1;
  user_id = user_id;
  const token = getLocalToken();
  return request_new(`/api/v2/staffs/${user_id}/toolcollections/${tool_id}/`, {
    method:"DELETE",
    headers: { "Content-Type": 'application/json', Token: token }
  });
}

export default {
  queryToolInfo,
  // queryCollect,
  collect,
  de_collect,
}