import { query, remove, edit } from '@/services/resources_folder';
import { queryHier } from '@/services/dealerResources';
import { message } from 'antd';

export default {
  namespace: 'resources_folder',

  state: {
    list: [],
    hier: [],
  },

  effects: {
    *query(_, { call, put }) {
      let { data } = yield call(query);
      yield put({ type: 'save', payload: data });
    },
    *deleLists({ payload, callback }, { call, put, select }) {
      const { key } = payload;
      yield select(state => state.resources_folder);
      yield call(remove, key[0]);
      message.success('删除成功');
      yield put({ type: 'query' });
      callback();
    },
    *editResource({ payload }, { call, put }) {
      yield call(edit, payload);
      yield put({ type: 'query' });
    },
    *queryHier(_, { call, put }) {
      let { data } = yield call(queryHier);
      yield put({ type: 'saveHier', payload: data });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, list: payload };
    },
    saveHier(state, { payload }) {
      return { ...state, hier: payload };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'query' });
      dispatch({ type: 'queryHier' });
    },
  },
};
