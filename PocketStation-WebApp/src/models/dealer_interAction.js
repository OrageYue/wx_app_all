import { warn } from "../utils/log";
import QAServices from '../services/QA';
export default {
  namespace: 'dealer_interAction',
  state: {
    question: {},
    replys: [],
  },
  effects: {
    *queryInterAction({ payload }, { call, put }) {
      let { data, err } = yield call(QAServices.queryAction, payload);
      if(err){
        warn(err);
      }else {
        yield put({type: 'saveQues', payload: data})
      }
    },
    *queryReplys({ payload }, { call, put }) {
      let { data, err } = yield call(QAServices.queryReplys, payload);
      if(err){
        warn(err);
      }else {
        yield put({type: 'saveReplys', payload: data})
      }
    },
    *postReply({ payload }, { call, put, select }) {
      let { replys } = yield select( state => (state.dealer_interAction));
      let { data, err } = yield call(QAServices.postReply, payload);
      if(err){
        warn(err);
      }else {
        // replys.unshift(data);
        // yield put({type: 'saveReplys', payload: replys})
      }
    }
  },
  reducers: {
    saveQues(state, { payload }) {
      return {...state, question: payload}
    },
    saveReplys(state, { payload }) {
      return {...state, replys: payload};
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(( { search } ) => {
        let id = search.split('=')[1];
        dispatch({type:'queryInterAction', payload: id});
        dispatch({type:'queryReplys', payload: id});
      });
    }
  }
}