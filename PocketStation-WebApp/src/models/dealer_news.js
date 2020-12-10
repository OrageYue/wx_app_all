import { warn } from "../utils/log";
import DealerService from "../services/common";

export default {
  namespace: 'dealer_news',
  state: {
    news: undefined
  },
  effects: {
    *queryDealerNews({ payload }, { call, put }) {
      let { data, err } = yield call(DealerService.queryDealerNews, payload);
      if(err) {
        warn(err);
      }else {
        yield put({type: 'saveDealerNews', payload: data.content});
      }
    }
  },
  reducers: {
    saveDealerNews(state, { payload }) {
      return { ...state, news: payload };
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(( { search } ) => {
        let id = search.split('=')[1];
        dispatch({type: 'queryDealerNews', payload: id})
      });
    }
  }
}