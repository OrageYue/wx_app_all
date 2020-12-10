
/**
 * 通过用户类型判断是否能获取员工主页
 * @param {str} type 用户类型
 */
export function canAccessStaffHome(type) {
  return type === 'staff';
}

/**
 * 获取本地存储的TOKEN
 */
export function getLocalToken() {
  let token = window.localStorage.getItem('TOKEN');
  if (token==='undefined') return undefined;
  else return token;
}

export function getLocalOpenid() {
  let openid = window.localStorage.getItem('OPENID');
  if (openid==='undefined') return undefined;
  else return openid;
}


/**
 * 将TOKEN存储到本地
 * @param {string} token
 */
export function saveLocalToken(token) {
  return window.localStorage.setItem('TOKEN', token)
}

export function saveLocalOpenid(openid) {
  return window.localStorage.setItem('OPENID', openid)
}