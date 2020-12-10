import { message } from 'antd';
import pointsServices from '../services/points';
import { queryStaffs } from '../services/api';

export default {
  namespace: 'points',

  state: {
    staffs: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryStaffs);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *present({ payload }, { call, put }) {
      const { msg } = yield call(pointsServices.present, payload);
      if (msg) {
        message.info('赠送成功');
      } else {
        message.info('该用户未登录口袋加油站');
      }
    },
    *search(_, { call, put }) {
      const response = yield call(pointsServices.search);
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
        staffs: action.payload,
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'fetch' });
    },
  },
};
