import { parse } from 'qs';
import { WxAppID } from "../constants";

const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
export function isUrl(path) {
  return reg.test(path);
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

/**
 * 获取url中的某个参数的值
 * @param {string}} field 
 */
export function getQueryString(field) {
  var reg = new RegExp("(^|&)" + field + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}

/**
 * 验证邮箱格式
 */
export function isEmail(e) {return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(e)}

export function redirectWXAuthURL(url) {
  const redirect = 'https://pocketstation.cn/test/index.html';
  const state = url || 'http://localhost:8000/staff';
  const scope = 'snsapi_userinfo';
  const authurl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WxAppID}&redirect_uri=${redirect}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
  window.location.href = authurl;
}


/**
 * 时间格式化
 */

 export function timeFormat(create_at) {
    let d = new Date(`${create_at}0800`);
    // d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
 }


 /**
  * 降序排序
  */

  export function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
    }
}

/***
 * 员工积分比例
 */
let honorRatio = 0;
export function integralRadio( inte ) {
  if( inte>=0 && inte<=50 ) {
    honorRatio = (inte/50)*100;
  }else if( inte>=51 && inte<=100 ) {
    honorRatio = (inte/100)*100;
  }else if( inte>=101 && inte<=200 ) {
    honorRatio = (inte/200)*100;
  }if( inte>=201 && inte<=400 ) {
    honorRatio = (inte/400)*100;
  }if( inte>=401 && inte<=700 ) {
    honorRatio = (inte/700)*100;
  }if( inte>=701 && inte<=1000 ) {
    honorRatio = (inte/1000)*100;
  }else if( inte >=1001 ){
    honorRatio = 100;
  }
  return honorRatio;
}