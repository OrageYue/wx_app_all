import { query, add, remove } from '../services/trainingtask';
import { message } from 'antd';

export default {
  namespace: 'trainingtask',

  state: {
    trainingtasks: [],
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
      if (response.msg === '任务已存在！') {
        message.success('该任务已存在');
      }
      yield put({ type: 'fetch' });
      // yield put({
      //   type: 'extend',
      //   payload: response,
      // });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        trainingtasks: action.payload,
      };
    },
    extend(state, { payload: obj }) {
      const { trainingtasks } = state;
      return {
        ...state,
        trainingtasks: [obj, ...trainingtasks],
      };
    },
    reduce(state, { payload: obj_id }) {
      const { trainingtasks } = state;
      return {
        ...state,
        trainingtasks: trainingtasks.filter(obj => obj.id !== obj_id),
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'fetch' });
    },
  },
};
