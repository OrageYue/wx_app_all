
import OperationService from "../services/operation";
import { warn } from "../utils/log";
import { host } from '../constants';
import { Toast } from "antd-mobile";

export default {
  namespace: 'lsnInfo',
  state: {
    lsn_info: {},
    lsn_comments: [],
  },
  effects: {
    *queryComments({ payload }, { call, put }) {
      let { data, err } = yield call(OperationService.queryLsn_comments, payload);
      if(err) {
        warn(err);
      }else {
        yield put({type:'saveLsnComments', payload: data});
      }
    },
    *dl_collect({ payload, callback }, { call, put, select }) {
      let { collects } = yield select( state => state.lsnInfo);
      let { data, err } = yield call(OperationService.de_collect, payload);
      if(err) {
        warn(err)
      }else {
        callback();
      }
    },
    *collect({ payload, callback }, { call, put, select }) {
      let { collects } = yield select( state => state.lsnInfo);
      let { data, err}= yield call(OperationService.collect, payload);
      if(err){
        warn(err)
      }else {
        callback();
      }

    },
    *thumb({ payload, callback }, { call, put, select }) {
      let { thumbs } = yield select( state => state.lsnInfo);
      let {data, err}= yield call(OperationService.thumb, payload);
      if(err) {
        warn(err)
      }else {
        callback();
      }
    },
    *dl_thumb({payload, callback}, { call, put, select }) {
      let { thumbs } = yield select( state => state.lsnInfo);
      let {data, err}= yield call(OperationService.dl_thumb, payload);
      if(err) {
        warn(err)
      }else {
        callback();
      }
    },
    *share({ payload }, { call, put, select }) {
      let { lsn_comments } = yield select( state => state.lsnInfo );
      let { data, err } = yield call(OperationService.postComment, payload);
      if(err) {
        warn(err)
      }else {
        lsn_comments.unshift(data);
        yield put({type: 'saveLsnComments', payload: lsn_comments});
      }
    }
  },
  reducers: {
    saveLsnInfo(state, { payload }) {
      return {...state, lsn_info: payload};
    },
    saveLsnComments(state, { payload }) {
      let lsn_comments = payload.map( ls => {
        if( ls.staff.avatar.indexOf('http') === -1 ) {
          ls.staff.avatar = host + ls.staff.avatar;
        }
        return ls;
      })
      return {...state, lsn_comments};
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
    }
  }
}