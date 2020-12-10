import request from '../utils/request';
import requestV2 from '../utils/requestV2';

export async function query() {
  // return request(`/api/lecturers`);
  return requestV2(`/api/v2/lecturers/`);
}
