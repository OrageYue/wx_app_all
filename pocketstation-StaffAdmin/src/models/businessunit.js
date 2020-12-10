import {
  queryBusinessUnits,
  removeBusinessUnit,
  addBusinessUnit,
  editBusinessUnit,
} from '../services/api';

export default {
  namespace: 'businessunit',

  state: {
    businessunits: [],
  },

  effects: {
    *getBusinessUnit(_, { call, put }) {
      const response = yield call(queryBusinessUnits);
      yield put({
        type: 'saveBusinessUnitList',
        payload: Array.isArray(response) ? response : [],
      });
    },

    *removeBusinessUnits({ payload: bu_ids }, { call, put }) {
      for (let bu_id of bu_ids) {
        yield call(removeBusinessUnit, { bu_id: bu_id.id });
      }
      yield put({ type: 'getBusinessUnit' });
    },

    *addBusinessUnit({ payload: name }, { call, put }) {
      const bu_obj = yield call(addBusinessUnit, { name });
      yield put({ type: 'getBusinessUnit' });
    },
    *editBusinessUnit({ payload }, { call, put, select }) {
      let { businessunits } = yield select(state => state.businessunit);
      const bu_obj = yield call(editBusinessUnit, payload);
      // businessunits.forEach((bs, inx) => {
      //   bs.id === payload.bu_id ? businessunits.splice(inx, 1, bu_obj) : null;
      // });
      // yield put({ type: 'saveBusinessUnitList', payload: businessunits });
      yield put({ type: 'getBusinessUnit' });
    },
  },

  reducers: {
    saveBusinessUnitList(state, action) {
      return {
        ...state,
        businessunits: action.payload,
      };
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      dispatch({ type: 'getBusinessUnit' });

      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
