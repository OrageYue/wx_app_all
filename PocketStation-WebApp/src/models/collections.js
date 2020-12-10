import { warn } from "../utils/log";
import collectsServices from '../services/collects';

export default {
  namespace: 'collects',
  state: {
    tools: [],
    lessons: [],
  },
  effects: {
    *getCollTools({ payload }, { call, put }) {
      const { data, err } = yield call(collectsServices.queryCollTools, payload);
      if(err) {
        warn(err);
      }else {
        yield put({type: 'saveCollTools', payload: data});
      }
    },
    *getCollLessons({ payload }, { call, put }) {
      const { data, err } = yield call(collectsServices.queryLessons, payload);
      if(err) {
        warn(err);
      }else {
        yield put({type: 'saveLessonss', payload: data});
      }
    },
    
  },
  reducers: {
    saveCollTools(state, { payload }) {
      return {...state, tools: payload};
    },
    saveLessonss(state, { payload }) {
      return {...state, lessons: payload};
    }
  }
}