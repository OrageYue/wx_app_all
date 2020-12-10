import DealerService from "../services/dealer";
import { warn } from "../utils/log";
import { Toast } from 'antd-mobile';

export default {
  namespace: "dealer_lessons",
  state: {
    essence_gains: [],
    gains: [],
    lessonInfo: {},
  },

  effects: {
    *queryEssenceGains({ payload }, { call, put }) {
      const { data, err } = yield call(DealerService.queryEssenceGains, payload);
      if (err) {
        warn(err);
      } else {
        yield put({ type: 'saveEssence_gains', payload: data });
      }
    },
    *queryGains({ payload }, { call, put }) {
      const { data, err } = yield call(DealerService.queryGains, payload);
      if (err) {
        warn(err);
      } else {
        yield put({ type: 'saveGains', payload: data });
      }
    },
    *queryTrainingLesson({ payload }, { call, put }) {
      const { data, err } = yield call(DealerService.queryTrainingLesson, payload);
      if(err) {
        warn(err);
      }else {
        yield put({ type: 'saveTrainingLesson', payload: data });
      }
    },
    *postGains({ payload, callback }, { call, put, select }) {
      let { gains } = yield select( state => state.dealer_lessons );
      const { data, err } = yield call(DealerService.postGains, payload);
      if(err) {
        warn(err);
      }else {
        let arr = [];
        data.id = data.id + Math.random(0, 1);
        arr.push(data);
        yield put({ type: 'saveGains', payload: [...arr, ...gains] });
        callback();
        Toast.info('发表成功');
      }
    },
    
  },

  reducers: {
    saveEssence_gains(state, { payload }) {
      return { ...state, essence_gains: payload }
    },
    saveGains(state, { payload }) {
      return { ...state, gains: payload }
    },
    saveTrainingLesson(state, { payload }) {
      let { id, content } = payload;
      let lessonInfo = { id, content };
      return { ...state, lessonInfo }
    }
  },
  subscriptions: {
    setup({ dispatch }) {
    }
  }
};