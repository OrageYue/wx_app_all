/**
 * 获取本地存储的TOKEN
 */
export function getLocalToken() {
  let token = localStorage.getItem('TOKEN');
  if (token === 'undefined') return undefined;
  else return token;
}

/**
 * 将TOKEN存储到本地
 * @param {string} token
 */
export function saveLocalToken(token) {
  return localStorage.setItem('TOKEN', token);
}
