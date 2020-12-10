import { queryOrders, set_orderStatus, remove } from '../services/orders.js';
import { message } from 'antd';

export default {
  namespace: 'order',

  state: {
    list: [],
  },

  effects: {
    *query({ payload }, { call, put }) {
      const res = yield call(queryOrders);
      yield put({ type: 'save', payload: res });
    },
    *set_orderStatus({ payload }, { call, put }) {
      yield call(set_orderStatus, payload);
      yield put({ type: 'query' });
    },
    // *deleLists({ payload, callback }, { call, put }) {
    //   const { key } = payload;
    //   yield call(remove, key[0]);
    //   message.success('删除成功');
    //   yield put({ type: 'query' });
    //   callback();
    // },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, list: payload };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'query' });
    },
  },
};
