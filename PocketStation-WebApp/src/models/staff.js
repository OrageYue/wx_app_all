import { queryThanksCurrent } from '../services/api';
import StaffServices from '../services/staff';
import CommonServices from '../services/common';
import RecommendLsnService from '../services/staff_recommendLesson';
import { warn } from '../utils/log';

export default {
  namespace: "staff",
  state: {
    selectTab: "professionalKnowledge",
    carouselList: [],
    gratsCurrent: {},
    recommendLessons: [],
    hots: [],
  },
  effects: {
    *getCarouselList(_, { call, put }){
      const { data, err} = yield call(CommonServices.queryStaffCarousel);
      if( err ) {
        warn( err )
      }else {
        yield put({type:"saveCarouselList",payload:data})
      }
    },
    // *getGratsCurrent(_, { call, put }){
    //   const {data, err} = yield call(queryThanksCurrent);
    //   if(err) {
    //     warn(err)
    //   }else {
    //   	yield put({type:"saveGratsCurrent",payload:data})
    //   }
    // },
    *getRecommendLessons({ payload }, { call, put }){
      const { data, err } = yield call(RecommendLsnService.queryStaffRecommendLsn, payload);
      if(err) {
        warn(err)
      }else {
    	  yield put({type:"saveRecommendLessons",payload:data})
      }
    },
    *get_hot(_, { call, put }) {
      const { data, err } = yield call(StaffServices.query_hot);
      if(err) {
        warn(err)
      }else {
        yield put({type: 'saveHots', payload: data});
      }
    }
  },
  reducers: {
    changeSelectedTab( state, { payload } ) {
      return { ...state, selectTab: payload };
    },
    saveCarouselList( state, { payload } ) {
    	return { ...state, carouselList: payload };
    },
    saveGratsCurrent( state, { payload } ) {
    	return { ...state, gratsCurrent: payload };
    },
    saveRecommendLessons( state, { payload } ) {
    	return { ...state, recommendLessons: payload };
    },
    saveHots(state, { payload }) {
      return {...state, hots: payload};
    }
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'getCarouselList'});
      // dispatch({ type: 'getGratsCurrent'});
      dispatch({ type: 'get_hot'});
    }
  }
};