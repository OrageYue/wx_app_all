import request from '@/utils/request';
import { getLocalToken } from '@/utils/user';

//  获取管理员token
export async function getTokens(params) {
  // let token = getLocalToken();
  // return request('/admin/token', {
  //   headers: { Token: token },
  //   method: 'POST',
  //   body: params,
  // });
  const { password, userName } = params;
  if (password === 'admin' && userName === 'admin') {
    return {
      data: { token: 'TOKEN' },
    };
  } else if (userName !== 'admin') {
    return { data: { message: '用户名错误' } };
  } else if (password !== 'admin') {
    return { data: { message: '密码错误' } };
  }
}
//  获取管理员权限
export async function getCurrentAuthorities() {
  // let token = getLocalToken();
  // return request('/admin/authorities', { headers: { Token: token } });
  return {
    data: {
      currentAuthority: ['admin', 'course', 'resources'],
    },
  };
}
