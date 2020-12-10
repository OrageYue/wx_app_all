import {
  queryNews,
  add,
  remove,
  edit,
  search,
  news_cls_search,
  setTop,
} from '../../../services/news';
import { message } from 'antd';

export default {
  namespace: 'news',

  state: {
    news: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const { data } = yield call(queryNews);
      data.forEach(item => {
        switch (item.type_) {
          case 'toCustome':
            item.type_ = '贴近客户';
            break;
          case 'toStaff':
            item.type_ = '贴近员工';
            break;
          case 'doSystem':
            item.type_ = '系统合作';
            break;
          case 'Innovate':
            item.type_ = '开拓创新';
            break;
        }
      });
      yield put({
        type: 'save',
        payload: data,
      });
    },
    *remove({ payload: objs }, { call, put }) {
      for (let obj of objs) {
        yield call(remove, { id: obj.id });
        yield put({
          type: 'reduce',
          payload: obj.id,
        });
      }
    },
    *add({ payload: params }, { call, put }) {
      const { data } = yield call(add, params);
      yield put({
        type: 'extend',
        payload: data,
      });
    },
    *edit({ payload: params }, { call, put }) {
      const cls_obj = yield call(edit, params);
      yield put({ type: 'fetch' });
    },
    *search({ payload }, { call, put }) {
      if (payload.name) {
        const { data } = yield call(search, payload);
        data.length > 0
          ? yield put({
              type: 'save',
              payload: data,
            })
          : message.info('该新闻不存在');
      } else {
        message.info('该新闻不存在');
      }
    },
    *news_cls_search({ payload }, { call, put }) {
      if (payload.cls_id) {
        const { data } = yield call(news_cls_search, payload);
        data.length > 0
          ? yield put({
              type: 'save',
              payload: data,
            })
          : message.info('该分类下无新闻');
      } else {
        message.info('该分类下无新闻');
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        news: action.payload,
      };
    },
    extend(state, { payload: obj }) {
      const { news } = state;
      return {
        ...state,
        news: [obj, ...news],
      };
    },
    reduce(state, { payload: obj_id }) {
      const { news } = state;
      return {
        ...state,
        news: news.filter(obj => obj.id !== obj_id),
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'fetch' });
    },
  },
};
