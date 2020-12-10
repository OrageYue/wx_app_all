import { query } from '../services/lecturer';

export default {
  namespace: 'lecturer',

  state: {
    lecturers: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(query);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        lecturers: action.payload,
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'fetch' });
    },
  },
};
