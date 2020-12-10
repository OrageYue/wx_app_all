import { queryQues, queryReplys, deleActions } from '@/services/dealer_interAction';
import { message } from 'antd';

export default {
  namespace: 'ques',

  state: {
    ques: [],
    replys: [],
  },
  effects: {
    *getQues(_, { call, put }) {
      let { data, err } = yield call(queryQues);
      if (err) {
        message.warning(err);
      } else {
        yield put({ type: 'saveQues', payload: data });
      }
    },
    *queryReplys({ payload }, { call, put }) {
      let { data, err } = yield call(queryReplys, payload);
      if (err) {
        message.warning(err);
      } else {
        yield put({ type: 'saveReplys', payload: data });
      }
    },
    *deleLists({ payload, callback }, { call, put, select }) {
      const { key } = payload;
      const { ques } = yield select(state => state.ques);
      const { data, err } = yield call(deleActions, key);
      if (err) {
        console.log('请求错误，刷新页面');
      } else {
        message.success('ok');
      }
      for (var i = key.length - 1; i >= 0; i--) {
        ques.forEach((item, index) => {
          if (item.key === key[i]) {
            ques.splice(index, 1);
          }
        });
      }
      callback();
    },
  },
  reducers: {
    saveQues(state, { payload }) {
      return { ...state, ques: payload };
    },
    saveReplys(state, { payload }) {
      return { ...state, replys: payload };
    },
  },
};
