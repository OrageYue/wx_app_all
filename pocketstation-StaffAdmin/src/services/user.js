import request from '../utils/request';
import { timeout } from "../utils/utils";
export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  // return request('/api/currentUser');
  // await timeout()
  return {
    name: 'Admin',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    userid: '00000001'
  }
}
