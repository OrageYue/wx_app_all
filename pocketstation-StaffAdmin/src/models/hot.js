import { query, add } from '../services/hot';

export default {
  namespace: 'hot',

  state: {
    hots: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(query);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *add({ payload: params }, { call, put }) {
      const response = yield call(add, params);
      yield put({
        type: 'fetch'
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        hots: action.payload,
      };
    },
    reduce(state, { payload: obj_id }) {
      const { hots } = state;
      return {
        ...state,
        hots: hots.filter(obj => obj.id !== obj_id),
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'fetch' });
    },
  },
};
