import request_new from '../utils/request_new';
import { stringify } from 'qs';

export async function queryToken( params ) {
  return request_new(`/api/v2/tokens/${stringify( params )}`);
}

export async function userBind( params ) {
  return request_new('/api/v2/tokens/', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {"Content-Type": 'application/json'}
  });
}

export async function userLogin( params ) {
  return request_new('/api/v2/tokens/code/', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {"Content-Type": 'application/json'}
  });
}

export async function checkToken(code) {
  return request_new(`/api/v2/tokens/validation/${code}`,{
    // method: 'get',
    // body: JSON.stringify({code}),
    // headers: {"Content-Type": 'application/json'}
  });
}


export async function loginCounts( params ) {
  params.years = new Date(`${new Date()}0800`).getFullYear();
  params.months = new Date(`${new Date()}0800`).getMonth() + 1;
  params.days = new Date(`${new Date()}0800`).getDate();
  return request_new('/api/v2/numbers/', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {"Content-Type": 'application/json'}
  });
}
