import QuesService from '../services/question';
import { Toast } from 'antd-mobile';
import { warn } from "../utils/log";
import { getPageQuery } from '../utils/utils';

export default {
  namespace: "question",
  state: {
    ques: [],
  },
  effects: {
    *queryQues({ payload }, { call, put }) {
      let {data, err} = yield call(QuesService.get_ques, payload);
      if(err){
        warn('题目加载失败',err)
      }else {
        if( data.length === 0 ) {
          // Toast.info("题库为空，暂时无法考试～");
          // window.history.back();
          yield put({type: 'saveQues', payload: data});
        }else {
          yield put({type: 'saveQues', payload: data});
        }
      }
    },
    *post_test({ payload }, { call, put }) {
      let {data, err} = yield call(QuesService.post_test, payload);
      if(err){
        warn(err)
      }else {
        console.log(data)
      }
    }
  },
  reducers: {
    saveQues(state, { payload }) {
      return { ...state, ques: payload };
    }
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   history.listen( ({search}) => {
    //     const { lesson_id } =  getPageQuery(search);
    //     console.log( lesson_id )
    //     if( lesson_id ) {
    //       dispatch({type:'queryQues', payload:lesson_id})
    //     }
    //   })
    // }
  }
}