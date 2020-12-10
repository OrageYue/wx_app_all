
import OperationService from "../services/operation";
import { warn } from "../utils/log";

export default {
  namespace: 'courses',
  state: {
    courseLists: [],
    selectedIndex: 0,
    type: '课程',
    lsn_info: {},
  },
  effects: {
    *queryOprt_lsn({ payload }, { call, put }) {
      let { data, err } = yield call(OperationService.queryOprt_lsn, payload);
      if(err) {
        warn(err)
      }else {
        yield put({type:'saveCourseLists', payload: data});
        yield put({type:'saveIndex', payload: 0});
        yield put({type:'saveType', payload: '课程'});
      }
    },
    *queryLsnInfo({ payload }, { call, put }) {
      let { data, err } = yield call(OperationService.queryLsn_info, payload);
      if(err) {
        warn(err);
      }else {
        yield put({type:'saveLsnInfo', payload: data});
      }
    }
  },
  reducers: {
    saveCourseLists(state, { payload }) {
      return {...state, courseLists: payload};
    },
    saveIndex(state, { payload }) {
      return {...state, selectedIndex: payload};
    },
    saveType(state, { payload }) {
      return {...state, type: payload};
    },
    saveLsnInfo(state, { payload }) {
      return {...state, lsn_info: payload};
    },
    saveTools(state, { payload }) {
      return {...state, courseLists: payload, type:'资源', selectedIndex: 1};
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
    }
  }
}