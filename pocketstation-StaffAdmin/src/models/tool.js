import { query, add, remove, search, edit } from '../services/tool';
import { queryLessonClasses } from '../services/api';
import { message } from 'antd';

export default {
  namespace: 'tool',

  state: {
    tools: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(query);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *remove({ payload: objs }, { call, put }) {
      for (let obj of objs) {
        yield call(remove, { id: obj.id });
        yield put({
          type: 'reduce',
          payload: obj.id,
        });
      }
    },
    *add({ payload: params }, { call, put }) {
      const response = yield call(add, params);
      yield put({
        type: 'extend',
        payload: response,
      });
    },
    *search({ payload }, { call, put }) {
      if (payload.tool_id) {
        const res = yield call(search, payload);
        const arr = [];
        arr.push(res);
        yield put({
          type: 'save',
          payload: arr,
        });
      } else {
        message.info('该工具不存在');
      }
    },
    *edit({ payload }, { call, put }) {
      const bu_obj = yield call(edit, payload);
      yield put({ type: 'fetch' });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        tools: action.payload,
      };
    },
    extend(state, { payload: obj }) {
      const { tools } = state;
      return {
        ...state,
        tools: [obj, ...tools],
      };
    },
    reduce(state, { payload: obj_id }) {
      const { tools } = state;
      return {
        ...state,
        tools: tools.filter(obj => obj.id !== obj_id),
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'fetch' });
    },
  },
};
