import requestV2 from '../utils/requestV2';

function present(params) {
  return requestV2(`/api/v2/staff/birthday/`, {
    method: 'POST',
    body: params,
  });
}

function search() {
  return requestV2(`/api/v2/search/staff/birthday/`);
}

export default {
  present,
  search,
};
