import request from "../utils/request";
import request_new from '../utils/request_new';
import { getLocalToken } from "../utils/user";

function queryTrainingLessons() {
  const token = getLocalToken();
  return request_new(`/api/v2/trainings/`, {headers: {'Token': token}});
}


function queryEssenceGains(course_id) {
  const token = getLocalToken();
  return request_new(`/api/v2/trainings/${course_id}/gains/essence`, { headers: { "Token": token } });
}

function queryGains(course_id) {
  const token = getLocalToken();
  return request_new(`/api/v2/trainings/${course_id}/gains`, { headers: { "Token": token } });
}
function queryTrainingLesson(course_id) {
  const token = getLocalToken();
  return request_new(`/api/v2/trainings/${course_id}`, { headers: { "Token": token } });
}

function postGains({content, title, user_id, course_id}) {
  course_id = course_id * 1;
  const token = getLocalToken();
  let params = {content, title};
  return request_new(`/api/v2/trainings/${course_id}/gains/user_id/${user_id}`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {"Content-type": 'application/json', "Token": token},
  });
}


export default {
    queryTrainingLessons,
    queryEssenceGains,
    queryGains,
    queryTrainingLesson,
    postGains,
}
