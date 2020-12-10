import { userBind, userLogin, checkToken } from '../services/user';
import { getQueryString, redirectWXAuthURL, getPageQuery } from '../utils/utils';
import { saveLocalToken, getLocalToken, saveLocalOpenid, getLocalOpenid } from "../utils/user";
import { log, warn } from "../utils/log";
import { routerRedux } from 'dva/router';
import { Toast } from 'antd-mobile';
export default {
  namespace: "user",
  state: {
    token: '',
    openid: '',
    type: '',
    id: undefined,
    // ... other info
  },
  effects: {
    /**
     * 获取Token，成功后继续获取个人数据
     */
    *getTokens({ payload: {code} }, { call, put, select }) {
      // if(!code) {
      //   redirectWXAuthURL(window.location.href);
      // }
      // const { openid } = yield select( state => state.user );
      // console.log(openid)
      const local_token = getLocalToken();
      // Toast.info(local_token)
      // let token;
      // Step 1 : check local token
      if (!!local_token) {
        const local_openid = getLocalOpenid();
        // console.log(local_openid)
        const { data, err } = yield call(checkToken, local_openid);
        if(err) {
         warn(err)
        }else {
          Toast.loading('登录中...', 1, () => {
            console.log('Load complete !!!');
          });
          yield put(routerRedux.push('/select_type'))
          yield put({type: 'saveUserInfo', payload: data});
          // console.log( data )
          // const { token } = data;
          // token === local_token? yield put(routerRedux.push('/select_type')):yield put(routerRedux.push(`/?code=${code}`))
        }
      }else{ log('Local Token Not Found.')};

      // Step 2 If Check Local Token Failed:  code => token
      if (!local_token) { //本地token不存在，code存在，第一次登陆，进入邮箱界面，发送邮箱判断用户是否存在
        // Toast.info('22')
        if (code){
          yield put(routerRedux.push(`/?code=${code}`));
        }else{ log('Code Not Found.')}
      }

      // Step 3 If Code2Token Failed: Redirect Auth Url
      if (!local_token) {
        if (!code){
          redirectWXAuthURL(window.location.href);
        }
      }
    },

    /**
     * 绑定邮箱，绑定后继续获取个人数据
     */
    *userBind({ payload }, { call, put }) {
      const { data, err } = yield call(userBind, payload);
      if(err){
        warn(err);
      }else {
        const { msg } = data;
        const { code } = getPageQuery(window.location.href);
        if( msg ) {
          const { data, err } = yield call(userLogin, {...payload, code} );
          if(err) {
            console.log(err)
          }else {
            const { err } = data;
            if(err) {
              Toast.info(err);
            }else {
              yield put({type: 'saveUserInfo', payload: data});
              yield put(routerRedux.push('/select_type'));
            }
           
          }
        }else {
          Toast.info('用户不存在');
        }
      }
    },
  },
  reducers: {
    saveUserInfo(state, { payload }) {
      // console.log(  payload)
      const { token, openid } = payload;
      saveLocalToken(token);
      saveLocalOpenid(openid);
      return { ...state, ...payload };
    }
  },
  subscriptions: {
    setup({ dispatch }) {
      const code = getQueryString('code');
      dispatch({
        type: 'getTokens',
        payload: { code }
      })
    }
  }
};