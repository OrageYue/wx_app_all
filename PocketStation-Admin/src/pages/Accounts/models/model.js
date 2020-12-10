import {
  queryAccounts,
  postAccounts,
  delAccount,
  updateAccount,
  queryBus,
  search,
  refreshPwd,
} from '../../../services/accounts';
import { message } from 'antd';

export default {
  namespace: 'dealer_accounts',

  state: {
    accounts: [],
    bus: [],
  },

  effects: {
    *refreshPwd(_, { call, put }) {
      yield call(refreshPwd);
      yield put({ type: 'getAccounts' });
    },
    *queryBus(_, { call, put }) {
      const { data, err } = yield call(queryBus);
      if (err) {
        console.log(err);
      } else {
        yield put({ type: 'saveBus', payload: data });
      }
    },
    *getAccounts(_, { call, put }) {
      const { data, err } = yield call(queryAccounts);
      if (err) {
        console.log(err);
      } else {
        yield put({ type: 'saveAccounts', payload: data });
      }
    },
    *postAccounts({ payload }, { call, put, select }) {
      let { accounts } = yield select(state => state.dealer_accounts);
      const { data, err } = yield call(postAccounts, payload);
      if (err) {
        console.log(err);
      } else {
        // accounts.unshift(data);
        // yield put({ type: 'saveAccounts', payload: accounts });
        yield put({ type: 'getAccounts' });
      }
    },
    *delAccount({ payload, callback }, { call, put, select }) {
      const { key } = payload;
      const { accounts } = yield select(state => state.dealer_accounts);
      const { data, err } = yield call(delAccount, key[0]);
      if (err) {
        console.log('请求错误，刷新页面');
      } else {
        message.success('delete success');
      }
      for (var i = key.length - 1; i >= 0; i--) {
        accounts.forEach((item, index) => {
          if (item.key === key[i]) {
            accounts.splice(index, 1);
          }
        });
      }
      callback();
    },
    *editList({ payload }, { call, put, select }) {
      const { accounts } = yield select(state => state.dealer_accounts);
      const { data, err } = yield call(updateAccount, payload);
      if (err) console.log(err);
      else {
        // accounts.forEach((cs, inx) => {
        //   if (cs.id === payload.account_id) {
        //     accounts.splice(inx, 1, data);
        //   }
        // });
        // yield put({ type: 'saveAccounts', payload: accounts });
        yield put({ type: 'getAccounts' });
      }
    },
    *search({ payload }, { call, put }) {
      const { data } = yield call(search, payload);
      data.length > 0
        ? yield put({
            type: 'saveAccounts',
            payload: data,
          })
        : message.info('该用户不存在');
    },
  },

  reducers: {
    saveAccounts(state, { payload }) {
      return { ...state, accounts: payload };
    },
    saveBus(state, { payload }) {
      return { ...state, bus: payload };
    },
  },
};
