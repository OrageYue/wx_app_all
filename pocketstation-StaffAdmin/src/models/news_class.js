import { query, add, remove, edit } from '../services/news_class';

export default {
  namespace: 'news_class',

  state: {
    news_classes: [],
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
    *edit({ payload: params }, { call, put, select }) {
      let { news_classes } = yield select(state => state.news_class);
      const cls_obj = yield call(edit, params);
      yield put({ type: 'fetch' });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        news_classes: action.payload,
      };
    },
    extend(state, { payload: obj }) {
      const { news_classes } = state;
      return {
        ...state,
        news_classes: [obj, ...news_classes],
      };
    },
    reduce(state, { payload: obj_id }) {
      const { news_classes } = state;
      return {
        ...state,
        news_classes: news_classes.filter(obj => obj.id !== obj_id),
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'fetch' });
    },
  },
};
