import { query, add, remove, search } from '../services/question';
import { message } from 'antd';

export default {
  namespace: 'question',

  state: {
    questions: [],
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
        type: 'fetch',
        payload: response,
      });
    },
    *search({ payload }, { call, put }) {
      if (payload.lsn_id) {
        const response = yield call(search, payload);
        if (response.length > 0) {
          yield put({
            type: 'save',
            payload: response,
          });
        } else {
          message.info('试题不存在');
        }
      } else {
        message.info('试题不存在');
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        questions: action.payload,
      };
    },
    extend(state, { payload: obj }) {
      const { questions } = state;
      return {
        ...state,
        questions: [obj, ...questions],
      };
    },
    reduce(state, { payload: obj_id }) {
      const { questions } = state;
      return {
        ...state,
        questions: questions.filter(obj => obj.id !== obj_id),
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'fetch' });
    },
  },
};
