import {
  query,
  add,
  remove,
  updateS,
  set_recommend,
  set_islook,
  push,
  pushInfo,
} from '../services/lesson';
import { message } from 'antd';

export default {
  namespace: 'lesson',

  state: {
    lessons: [],
    pushStaffs: [],
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
        yield call(remove, { lsn_id: obj.id });
        yield put({
          type: 'reduce',
          payload: obj.id,
        });
      }
    },
    *add({ payload: params }, { call, put }) {
      const response = yield call(add, params);
      yield put({ type: 'fetch' });
      // yield put({
      //   type: 'extend',
      //   payload: response,
      // });
    },
    *patch({ payload: params }, { call, put }) {
      const response = yield call(updateS, params);
      yield put({ type: 'fetch' });
      // yield put({
      //   type: 'update',
      //   payload: response
      // })
    },
    *set_recommend({ payload }, { call, put }) {
      const response = yield call(set_recommend, payload);
      yield put({
        type: 'fetch',
      });
    },
    *set_islook({ payload }, { call, put }) {
      const response = yield call(set_islook, payload);
      yield put({
        type: 'fetch',
      });
    },
    *getPushStaffs({ payload }, { call, put }) {
      const response = yield call(push, payload);
      yield put({ type: 'savePushStaffs', payload: response });
    },
    *pushInfo({ payload }, { call, put }) {
      yield call(pushInfo, payload);
      message.info('课程推送成功');
    },
  },

  reducers: {
    savePushStaffs(state, { payload }) {
      return {
        ...state,
        pushStaffs: payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        lessons: action.payload,
      };
    },
    extend(state, { payload: obj }) {
      const { lessons } = state;
      return {
        ...state,
        lessons: [obj, ...lessons],
      };
    },
    reduce(state, { payload: obj_id }) {
      const { lessons } = state;
      return {
        ...state,
        lessons: lessons.filter(obj => obj.id !== obj_id),
      };
    },
    update(state, { payload: obj }) {
      const { lessons } = state;
      const idx = lessons.findIndex(e => e.id === obj.id);
      lessons[idx] = obj;
      return {
        ...state,
        lessons: [...lessons],
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'fetch' });
    },
  },
};
