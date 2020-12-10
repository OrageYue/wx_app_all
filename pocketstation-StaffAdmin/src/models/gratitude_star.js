import { add, query } from '../services/gratitudestar';

export default {
  namespace: 'gratitude_star',

  state: {
    gratitude_stars: [],
  },

  effects: {
    *getGratitudeStars(_, { call, put }) {
      const response = yield call(query);
      yield put({
        type: 'saveGratitudeStars',
        payload: response,
      });
    },

    *addGratitudeStars({ payload: params }, { call, put }) {
      const response = yield call(add, params);
      yield put({
        type: 'getGratitudeStars'
      });
    },
  },
  // 创建reducer 传入action type
  reducers: {
    saveGratitudeStars(state, action) {
      return {
        ...state,
        gratitude_stars: action.payload,
      };
    },
    add(state, { payload: obj }) {
      const { gratitude_stars } = state;
      console.log('gratitude_stars');
      console.log(gratitude_stars);
      return {
        ...state,
        gratitude_stars: [obj, ...gratitude_stars],
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'getGratitudeStars' });
    },
  },
};
