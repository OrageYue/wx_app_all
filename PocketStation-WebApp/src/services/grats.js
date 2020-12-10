import request from '../utils/request';
import request_new from '../utils/request_new';
import { getLocalToken } from "../utils/user";
import { host } from '../constants';

function queryGratStar() {
  const token = getLocalToken();
  return request_new(`/api/v2/gratstar/`,{
  	headers: {"Token": token}
  });
}

function getGratsRecord() {
  const token = getLocalToken();
  return request_new(`/api/v2/gratitudes/`,{
    // return request(`${host}/api/gratitudes`,{
  	headers: {"Token": token}
  });
}

// function getBu_Staff({buId}) {
//   const token = getLocalToken();
//   return request(`/api/v2/bus/${buId}/staffs`,{
//   	headers: {"Token": token}
//   });
// }

function postGrans(params) {
  const token = getLocalToken();
  return request_new(`/api/v2/gratitudes/`, { 
    method: "POST", 
    body: JSON.stringify(params),
    headers: { "Content-Type": 'application/json', Token: token }
  });
}

function getGratsTree() {
  const token = getLocalToken();
  return request_new('/api/v2/grattrees/',{
  	headers: {Token: token}
  });
}

// function getBus() {
//   const token = getLocalToken();
//   return request('/api/v2/bus',{
//   	headers: {"Token": token}
//   });
// }

export default {
  queryGratStar,
  getGratsRecord,
  // getBu_Staff,
  postGrans,
  getGratsTree,
  // getBus,
}
