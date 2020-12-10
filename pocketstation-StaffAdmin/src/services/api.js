import { stringify } from 'qs';
import { timeout } from '../utils/utils';
import request from '../utils/request';
import requestV2 from '../utils/requestV2';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin() {
  // export async function fakeAccountLogin(params) {
  await timeout(500);
  return {
    status: 'ok',
    type: 'post',
    currentAuthority: 'admin',
  };
  // return request('/api/login/account', {
  //   method: 'POST',
  //   body: params,
  // });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

// departments
export async function queryBusinessUnits() {
  // return request('/api/departments');
  return requestV2('/api/v2/bu/');
}
export async function removeBusinessUnit({ bu_id }) {
  // return request(`/api/departments/${bu_id}`, { method: 'DELETE' });
  return requestV2(`/api/v2/bu/${bu_id}`, { method: 'DELETE' });
}
export async function addBusinessUnit({ name }) {
  // return request(`/api/departments`, { method: 'POST', body: { name } });
  return requestV2(`/api/v2/bu/`, { method: 'POST', body: { name } });
}

export async function editBusinessUnit({ bu_id, name }) {
  return requestV2(`/api/v2/bu/${bu_id}`, { method: 'PUT', body: { name } });
}

// positions
export async function queryPositions() {
  // return request(`/api/positions`);
  return requestV2(`/api/v2/pos/`);
}

export async function deletePosition({ pos_id }) {
  // return request(`/api/positions/${pos_id}`, { method: 'DELETE' });
  return requestV2(`/api/v2/pos/${pos_id}`, { method: 'DELETE' });
}

export async function addPosition({ bu_id, name, is_manager }) {
  // return request(`/api/departments/${bu_id}/positions`, {
  return requestV2(`/api/departments/${bu_id}/positions`, {
    method: 'POST',
    body: { name, is_manager },
  });
}

export async function editPosition({ pos_id, name, bu_id }) {
  return requestV2(`/api/v2/pos/${pos_id}`, { method: 'PUT', body: { name, bu_id } });
}

// staffs
export async function queryStaffs() {
  // return request(`/api/staffs`);
  return requestV2(`/api/v2/staffs/`);
}

export async function removeStaff({ staff_id }) {
  // return request(`/api/staffs/${staff_id}`, { method: 'delete' });
  return requestV2(`/api/v2/staff/${staff_id}`, { method: 'delete' });
}

export async function addStaff(params) {
  // return request(`/api/staffs`, { method: 'POST', body: params });
  return requestV2(`/api/v2/staffs/`, { method: 'POST', body: params });
}

export async function patchUpdateStaff({ staff_id, data }) {
  // return request(`/api/staffs/${staff_id}`, {method: 'PATCH', body: data});
  return requestV2(`/api/v2/staff/${staff_id}`, { method: 'PATCH', body: data });
}

export async function search(params) {
  return requestV2(`/api/v2/staff/search/`, { method: 'POST', body: params });
}

// lesson classes
export async function queryLessonClasses() {
  // return request(`/api/lesson_classes`);
  return requestV2(`/api/v2/lesson_classes/`);
}

export async function removeLessonClass({ cls_id }) {
  // return request(`/api/lesson_classes/${cls_id}`, { method: 'delete' });
  return requestV2(`/api/v2/les_cls/${cls_id}`, { method: 'delete' });
}

export async function addLessonClass(params) {
  // return request(`/api/lesson_classes`, { method: 'POST', body: params });
  return requestV2(`/api/v2/lesson_classes/`, { method: 'POST', body: params });
}

export async function patchLessonClass({ lsn_id, data }) {
  // return request(`/api/lesson_classes/${lsn_id}`, { method: 'PATCH', body: data });
  return requestV2(`/api/v2/les_cls/${lsn_id}`, { method: 'PUT', body: data });
}
