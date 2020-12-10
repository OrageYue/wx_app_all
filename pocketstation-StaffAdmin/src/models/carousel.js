import { query, add } from '../services/carousel';

export default {
  namespace: 'carousel',

  state: {
    carousels: [],
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
      if (response.msg) {
        yield put({
          type: 'fetch',
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        carousels: action.payload,
      };
    },
    reduce(state, { payload: obj_id }) {
      const { carousels } = state;
      return {
        ...state,
        carousels: carousels.filter(obj => obj.id !== obj_id),
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'fetch' });
    },
  },
};
