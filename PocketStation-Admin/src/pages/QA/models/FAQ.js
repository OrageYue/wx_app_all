import { queryFaqs, queryFaq, deleFaqs, postFAQ, updateFAQ } from '@/services/QA';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'QA',

  state: {
    faqs: [],
    faq: {},
  },
  effects: {
    *getFaqs(_, { call, put }) {
      let { data, err } = yield call(queryFaqs);
      if (err) {
        message.warning(err);
      } else {
        yield put({ type: 'saveFaqs', payload: data });
      }
    },
    *getFaq({ payload }, { call, put }) {
      let { data, err } = yield call(queryFaq, payload);
      if (err) {
        message.warning(err);
      } else {
        yield put({ type: 'saveFaq', payload: data });
      }
    },
    *deleLists({ payload, callback }, { call, put, select }) {
      const { key } = payload;
      const { faqs } = yield select(state => state.QA);
      const { data, err } = yield call(deleFaqs, key);
      if (err) {
        console.log('请求错误，刷新页面');
      } else {
        message.success('ok');
      }
      for (var i = key.length - 1; i >= 0; i--) {
        faqs.forEach((item, index) => {
          if (item.key === key[i]) {
            faqs.splice(index, 1);
          }
        });
      }
      callback();
    },
    *postFAQ({ payload }, { call, put, select }) {
      let { faqs } = yield select(state => state.QA);
      const { data, err } = yield call(postFAQ, payload);
      if (err) {
        message.warning(err);
      } else {
        faqs.unshift(data);
        yield put({ type: 'saveFaqs', payload: faqs });
        message.success('add success!');
      }
    },
    *updateFAQ({ payload }, { call, put }) {
      const { data, err } = yield call(updateFAQ, payload);
      if (err) {
        message.warning(err);
      } else {
        message.success('更新成功');
        yield put(routerRedux.push('/dealer/QA/FAQ'));
      }
    },
  },
  reducers: {
    saveFaqs(state, { payload }) {
      return { ...state, faqs: payload };
    },
    saveFaq(state, { payload }) {
      return { ...state, faq: payload };
    },
  },
};
