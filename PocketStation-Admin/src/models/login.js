import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { getTokens, getCurrentAuthorities } from '@/services/api';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { saveLocalToken } from '@/utils/user';

export default {
  namespace: 'login',

  state: {
    message: undefined,
    currentAuthority: ['admin'],
    currentUser: 'admin',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const res = yield call(getTokens, payload);
      const { data, err } = res;
      if (data.message) {
        const { message } = data;
        yield put({ type: 'saveMessage', payload: { message } });
      } else {
        const { token } = data;
        saveLocalToken(token);
        const {
          data: { currentAuthority },
        } = yield call(getCurrentAuthorities);
        yield put({
          type: 'saveAccountInfo',
          payload: {
            currentAuthority,
            currentUser: payload.userName,
          },
        });
        //  Login successfully
        if (currentAuthority) {
          reloadAuthorized();
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params;
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.startsWith('/#')) {
                redirect = redirect.substr(2);
              }
            } else {
              window.location.href = redirect;
              return;
            }
          }
          yield put(routerRedux.replace(redirect || '/'));
        }
      }
    },
    //  退出登录
    *logout(_, { put }) {
      yield put({
        type: 'saveAccountInfo',
        payload: {
          currentUser: undefined,
          currentAuthority: [],
        },
      });
      yield put({
        type: 'saveMessage',
        payload: {
          message: undefined,
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    saveAccountInfo(state, { payload }) {
      const { currentUser, currentAuthority } = payload;
      return {
        ...state,
        currentAuthority,
        currentUser,
      };
    },
    saveMessage(state, { payload }) {
      const { message } = payload;
      return {
        ...state,
        message,
      };
    },
  },
};
