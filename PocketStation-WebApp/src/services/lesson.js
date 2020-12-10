import request from "../utils/request";
import request_new from "../utils/request_new";
import { getLocalToken } from "../utils/user";
import { host } from '../constants';

function queryLessonParts() {
  const token = getLocalToken();
  return request_new(`/api/v2/lesson_classes/`, { headers: { Token: token } });
}

function get_operations(cls_id) {
  const token = getLocalToken();
  cls_id = cls_id * 1;
  return request_new(`/api/v2/lesson_classes/${cls_id}/operations/`, { headers: { Token: token } });
}

export default {
  queryLessonParts,
  get_operations
}
