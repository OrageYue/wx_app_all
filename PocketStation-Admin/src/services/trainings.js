import request from '@/utils/request';
import request_new from '@/utils/request_new';
import { getLocalToken } from '@/utils/user';

export async function queryTrainings() {
  return request_new(`/api/v2/trainings`);
}

export async function updateLesson({ course_id, row }) {
  let token = getLocalToken();
  let id = course_id * 1;
  return request_new(`/api/v2/trainings/${id}`, {
    method: 'PUT',
    body: row,
    headers: { Token: token },
  });
}

export async function deleLesson(course_id) {
  return request_new(`/api/v2/trainings/${course_id}`, {
    method: 'DELETE',
  });
}

export async function getLecturers() {
  return request_new(`/api/v2/teacher/`);
}

export async function postTrainingCourse(params) {
  return request_new(`/api/v2/trainings/`, {
    method: 'POST',
    body: params,
  });
}

export async function getGains(course_id) {
  return request_new(`/api/v2/trainings/${course_id}/gains`);
}

export async function changeEssence({ gains_id, course_id }) {
  return request_new(`/api/v2/trainings/${course_id}/gains/${gains_id}`, {
    method: 'PUT',
  });
}
