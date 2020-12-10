import CommonService from "../services/common";
import DealerService from "../services/dealer";
import { warn } from "../utils/log";

export default {
  namespace: "dealer",
  state: {
    carousel_list: [],
    latest_trainings: [],
    trainings: [],
  },

  effects: {
    *queryCarousel(_, { call, put }) {
      const { data, err } = yield call(CommonService.queryDealerCarousel);
      if (err) {
        warn(err);
      } else {
        yield put({ type: 'saveCarousel', payload: data });
      }
    },
    *queryTrainingLessons(_, { call, put }) {
      const { data, err } = yield call(DealerService.queryTrainingLessons);
      if(err) {
        warn(err);
        console.log( data )
      } else {
        yield put({ type: 'save_trainings', payload: data });
        yield put({ type: 'saveLatest_trainings', payload: data });
      }
    }
  },

  reducers: {
    saveCarousel(state, { payload }) {
      const carousel_list = payload.map( it=>({id: it.id, url: it.cover_img, content: it.content}) );
      return { ...state, carousel_list };
    },
    save_trainings(state, { payload }) {
      return { ...state, trainings: payload };
    },
    saveLatest_trainings(state, { payload }) {
      let latest_trainings = payload.slice(0, 3);
      return { ...state, latest_trainings };
    },
    
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'queryTrainingLessons' })
      dispatch({ type: 'queryCarousel' })
    }
  }
};