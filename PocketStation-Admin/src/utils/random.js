const $chars =
  'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
const Numbers = '0123456789';

export function randomString(len, str = Numbers) {
  len = len || 6;
  const maxPos = str.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += str.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
