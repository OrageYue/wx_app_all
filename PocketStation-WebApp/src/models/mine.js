import { warn } from "../utils/log";
import mineServices from '../services/me';

export default {
  namespace: 'mine',
  state: {
    integral: 0,
    honor: '',
  },
  effects: {
    *getIntegral({ payload }, { call, put }) {
      const { data, err } = yield call(mineServices.query_integral, payload);
      if(err) {
        warn(err);
      }else {
        const {points, level} = data;
        yield put({type: 'saveIntegral', payload: points});
        yield put({type: 'saveHonor', payload: level});
      }
    },
    
  },
  reducers: {
    saveIntegral(state, { payload }) {
      return {...state, integral: payload};
    },
    saveHonor(state, { payload }) {
      return {...state, honor: payload};
    },
  }
}