import { query, add } from '../../../services/dealer_carousel';
import { queryNews } from '../../../services/news';

export default {
  namespace: 'carousel',

  state: {
    carousels: [],
    news: [],
  },

  effects: {
    *fetchNews(_, { call, put }) {
      const { data } = yield call(queryNews);
      yield put({
        type: 'saveNews',
        payload: data,
      });
    },
    *fetch(_, { call, put }) {
      const { data } = yield call(query);
      yield put({
        type: 'save',
        payload: data,
      });
    },

    *add({ payload: params }, { call, put }) {
      yield call(add, params);
      yield put({
        type: 'fetch',
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        carousels: action.payload,
      };
    },
    saveNews(state, { payload }) {
      return {
        ...state,
        news: payload,
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
      dispatch({ type: 'fetchNews' });
    },
  },
};
