import Service from '../services/gratituderecord';
import { message } from 'antd';

export default {
  namespace: 'gratitude',

  state: {
    gratitudes: [],
  },

  effects: {
    *query(_, { call, put }) {
      const response = yield call(Service.query);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *remove({ payload: objs }, { call, put }) {
      for (let obj of objs) {
        yield call(Service.remove, { gra_id: obj.id });
        yield put({
          type: 'reduce',
          payload: obj.id,
        });
      }
    },
    *search({ payload }, { call, put }) {
      const res = yield call(Service.search, payload);
      if (res.length > 0) {
        yield put({
          type: 'save',
          payload: res,
        });
      } else {
        message.info('暂无该条感恩记录');
      }
    },
  },
  // 创建reducer 传入action type
  reducers: {
    save(state, action) {
      return {
        ...state,
        gratitudes: action.payload,
      };
    },
    reduce(state, { payload: obj_id }) {
      const { gratitudes } = state;
      return {
        ...state,
        gratitudes: gratitudes.filter(obj => obj.id !== obj_id),
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'query' });
    },
  },
};
