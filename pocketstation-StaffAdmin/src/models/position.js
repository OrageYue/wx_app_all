import { queryPositions, addPosition, deletePosition, editPosition } from '../services/api';

export default {
  namespace: 'position',

  state: {
    positions: [],
  },

  effects: {
    *fetchPositions(_, { call, put }) {
      const response = yield call(queryPositions);
      yield put({
        type: 'savePositions',
        payload: response,
      });
    },
    *removePositions({ payload: pos_objs }, { call, put }) {
      for (let pos_obj of pos_objs) {
        yield call(deletePosition, { pos_id: pos_obj.id });
        yield put({
          type: 'reducePosition',
          payload: pos_obj.id,
        });
      }
    },
    *addPosition({ payload: params }, { call, put }) {
      const response = yield call(addPosition, params);
      yield put({
        type: 'extendPositions',
        payload: response,
      });
    },
    *editPosition({ payload }, { call, put, select }) {
      let { positions } = yield select(state => state.position);
      const pos_obj = yield call(editPosition, payload);
      // positions.forEach((ps, inx) => {
      //   ps.id === payload.pos_id ? positions.splice(inx, 1, pos_obj) : null;
      // });
      // yield put({ type: 'savePositions', payload: positions });
      yield put({ type: 'fetchPositions' });
    },
  },

  reducers: {
    savePositions(state, action) {
      return {
        ...state,
        positions: action.payload,
      };
    },
    extendPositions(state, { payload: pos }) {
      const { positions } = state;
      return {
        ...state,
        positions: [pos, ...positions],
      };
    },
    reducePosition(state, { payload: pos_id }) {
      const { positions } = state;
      return {
        ...state,
        positions: positions.filter(pos => pos.id !== pos_id),
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      dispatch({ type: 'fetchPositions' });

      // return history.listen(({ pathname, search }) => {
      //   if (typeof window.ga !== 'undefined') {
      //     window.ga('send', 'pageview', pathname + search);
      //   }
      // });
    },
  },
};
