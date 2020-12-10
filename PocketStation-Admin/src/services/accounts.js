import request_new from '@/utils/request_new';

import { getLocalToken } from '@/utils/user';

async function queryAccounts() {
  let token = getLocalToken();
  return request_new(`/api/v2/admin/`, { headers: { Token: token } });
}

async function postAccounts(params) {
  let token = getLocalToken();
  return request_new('/api/v2/admin/', {
    headers: { Token: token },
    method: 'POST',
    body: params,
  });
}

async function delAccount(account_id) {
  let token = getLocalToken();
  return request_new(`/api/v2/admin/${account_id}`, {
    headers: { Token: token },
    method: 'DELETE',
  });
}

async function updateAccount(params) {
  let { account_id, row } = params;
  return request_new(`/api/v2/admin/${account_id}`, {
    method: 'PUT',
    body: row,
  });
}

async function queryBus() {
  let token = getLocalToken();
  return request_new(`/api/v2/bu/`, { headers: { Token: token } });
}

async function search(params) {
  return request_new(`/api/v2/admin/search/`, { method: 'POST', body: params });
}

async function refreshPwd() {
  return request_new(`/api/v2/password/refresh/`);
}

export { queryAccounts, postAccounts, delAccount, updateAccount, queryBus, search, refreshPwd };
