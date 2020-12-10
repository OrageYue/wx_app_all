import { message } from 'antd';
import { queryStaffs, addStaff, removeStaff, patchUpdateStaff, search } from '../services/api';

export default {
  namespace: 'staff',

  state: {
    staffs: [],
  },

  effects: {
    *search({ payload }, { call, put }) {
      const response = yield call(search, payload);
      response.length > 0
        ? yield put({
            type: 'save',
            payload: response,
          })
        : message.info('该用户不存在');
    },
    *fetch(_, { call, put }) {
      const response = yield call(queryStaffs);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *remove({ payload: objs }, { call, put }) {
      for (let obj of objs) {
        yield call(removeStaff, { staff_id: obj.id });
        yield put({
          type: 'reduce',
          payload: obj.id,
        });
      }
    },
    *add({ payload: params }, { call, put }) {
      const response = yield call(addStaff, params);
      yield put({ type: 'fetch' });
    },
    *patch({ payload: params }, { call, put }) {
      const response = yield call(patchUpdateStaff, params);
      yield put({ type: 'fetch' });
      // yield put({
      //   type: 'update',
      //   payload: response,
      // });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        staffs: action.payload,
      };
    },
    extend(state, { payload: obj }) {
      const { staffs } = state;
      return {
        ...state,
        staffs: [obj, ...staffs],
      };
    },
    reduce(state, { payload: obj_id }) {
      const { staffs } = state;
      return {
        ...state,
        staffs: staffs.filter(obj => obj.id !== obj_id),
      };
    },
    update(state, { payload: obj }) {
      const { staffs } = state;
      const idx = staffs.findIndex(e => e.id === obj.id);
      staffs[idx] = obj;
      return {
        ...state,
        staffs: [...staffs],
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'fetch' });
    },
  },
};
