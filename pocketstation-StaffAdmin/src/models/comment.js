import { query, add, remove, staff_search, lsn_search } from '../services/comment';
import { message } from 'antd';

export default {
  namespace: 'comment',

  state: {
    comments: [],
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
    *staff_search({ payload }, { call, put }) {
      if (payload.staff_id) {
        const res = yield call(staff_search, payload);
        if (res.length > 0) {
          yield put({
            type: 'save',
            payload: res,
          });
        } else {
          message.info('该员工暂无评论');
        }
      } else {
        message.info('该员工暂无评论');
      }
    },
    *lsn_search({ payload }, { call, put }) {
      if (payload.lsn_id) {
        const res = yield call(lsn_search, payload);
        if (res.length > 0) {
          yield put({
            type: 'save',
            payload: res,
          });
        } else {
          message.info('该课程暂无评论');
        }
      } else {
        message.info('该课程暂无评论');
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        comments: action.payload,
      };
    },
    extend(state, { payload: obj }) {
      const { comments } = state;
      return {
        ...state,
        comments: [obj, ...comments],
      };
    },
    reduce(state, { payload: obj_id }) {
      const { comments } = state;
      return {
        ...state,
        comments: comments.filter(obj => obj.id !== obj_id),
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'fetch' });
    },
  },
};
