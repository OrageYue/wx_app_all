import { warn } from "../utils/log";
import QAServices from '../services/QA';
import { Toast } from 'antd-mobile';
export default {
  namespace: 'QA',
  state: {
    FAQList: [],
    interActionList: [],
    currAction: [],
    addVisible: false,
  },
  effects: {
    *queryFAQ(_, { call, put }) {
      const { data, err } = yield call(QAServices.queryFAQ);
      if(err) {
        warn(err);
      }else {
        yield put({type: 'saveFAQList', payload: data });
      }
    },
    *queryActions(_, { call, put }) {
      const { data, err } = yield call(QAServices.queryActions);
      if(err) {
        warn(err);
      }else {
        data.reverse();
        let currAction = data.slice(0,3);
        yield put({type: 'saveCurrAction', payload: currAction });
        yield put({type: 'saveActions', payload: data });
      }
    },
    *postQuestion({ payload }, { call, put, select }) {
      let { interActionList, currAction } = yield select( state => (state.QA));
      const { data, err } = yield call(QAServices.postQuestion, payload);
      if(err) {
        warn(err);
      }else {
        if( data.msg ) {
          Toast.info( data.msg );
        }else {
          interActionList.unshift(data);
          currAction.splice(currAction.length-1,1);
          currAction.unshift(data);
          yield put({type: 'saveActions', payload: currAction });
          yield put({type: 'saveActions', payload: interActionList });
        }
        yield put({type: 'saveVisible', payload: false });
      }
    },
  },
  reducers: {
    saveFAQList(state, { payload }) {
      let FAQList = payload.map( ft => ({
        id: ft.id,
        title: ft.title,
        answer: ft.answer,
      }))
      return {...state, FAQList}
    },
    saveActions(state, { payload }) {
      return {...state, interActionList: payload}
    },
    saveCurrAction(state, { payload }) {
      return {...state, currAction: payload}
    },
    saveVisible(state, { payload }) {
      return {...state, addVisible: payload}
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({type:'queryFAQ'});
      dispatch({type:'queryActions'});
    }
  }
}