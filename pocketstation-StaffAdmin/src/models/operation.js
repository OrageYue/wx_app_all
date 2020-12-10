import { query, add, remove, updateS } from '../services/operation';

export default {
  namespace: 'operation',

  state: {
    operations: [],
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
        yield call(remove, { oper_id: obj.id });
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
    *patch({payload: params}, {call, put}) {
      const response = yield call(updateS, params);
      yield put({
        type: 'update',
        payload: response
      })
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        operations: action.payload,
      };
    },
    extend(state, { payload: obj }) {
      const { operations } = state;
      return {
        ...state,
        operations: [obj, ...operations],
      };
    },
    reduce(state, { payload: obj_id }) {
      const { operations } = state;
      return {
        ...state,
        operations: operations.filter(obj => obj.id !== obj_id),
      };
    },
    update(state, { payload: obj }) {
      const {operations} = state;
      const idx = operations.findIndex(e=>e.id===obj.id);
      operations[idx] = obj;
      return {
        ...state,
        operations: [...operations]
      }
    }
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'fetch' });
    },
  },
};
