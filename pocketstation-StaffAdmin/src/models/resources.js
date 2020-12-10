import { query, add, remove, queryHier, edit, search } from '../services/resource';
import { message } from 'antd';

export default {
  namespace: 'resources',

  state: {
    list: [],
    hier: [{ id: 1, name: '根目录' }],
  },

  effects: {
    *search({ payload }, { call, put }) {
      const response = yield call(search, payload);
      response.length > 0
        ? yield put({
            type: 'save',
            payload: response,
          })
        : message.info('该资源不存在');
    },
    *query(_, { call, put }) {
      let data = yield call(query);
      yield put({ type: 'save', payload: data });
    },
    *postResource({ payload }, { call, put }) {
      yield call(add, payload);
      yield put({ type: 'query' });
    },
    *deleLists({ payload, callback }, { call, put, select }) {
      const { key } = payload;
      const { list } = yield select(state => state.resources);
      const { data, err } = yield call(remove, key);
      message.success('删除成功');
      for (var i = key.length - 1; i >= 0; i--) {
        list.forEach((item, index) => {
          if (item.key === key[i]) {
            list.splice(index, 1);
          }
        });
      }
      yield put({ type: 'query' });
      callback();
    },
    *editResource({ payload }, { call, put, select }) {
      const { list } = yield select(state => state.resources);
      const data = yield call(edit, payload);
      list.forEach((itm, inx) => {
        if (itm.id === payload.key) {
          list.splice(inx, 1, data);
        }
      });
      yield put({ type: 'save', payload: list });
    },
    *queryHier(_, { call, put }) {
      let data = yield call(queryHier);
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
    },
  },
};
