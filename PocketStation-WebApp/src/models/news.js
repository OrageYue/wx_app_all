import NewsServices from '../services/staff_news';
export default {
  namespace: "news",
  state: {
    tabs: [],
    newsList: [],
    partId: 7,
    newsItem: {},
    news: [],
  },
  effects: {
    *getDefaultInfo(_, { call, put, select }) {
      const { data } = yield call(NewsServices.queryNews_classes);
      let tabs = [];
      for (let name of ['事业部','NES', 'DSD', 'OJR', 'OPM']) {
        const idx = data.findIndex(({id, title})=>title===name);
        if (idx > -1) {
          const [news_cls] = data.splice(idx, 1);
          tabs.push(news_cls);
        }
      }
      tabs = tabs.concat(data);
      yield put({type:"saveNewsTabs", payload:tabs});
      const { data: newses, err } = yield call(NewsServices.get_all);
      if( err ) {
        console.log( err )
      }else {
        yield put({type:'saveNews', payload: newses});
      }

    },
    *get_all_news(_, { call, put, select }) {
      const { data, err } = yield call(NewsServices.get_all);
      if( err ) {
        console.log( err )
      }else {
        console.log(  '111' )
        console.log(  data )
        yield put({type:'saveNews', payload: data});
      }
    },
    *getNewsItem({ payload },{call,put}) {
      let { data } = yield call(NewsServices.queryNews,payload);
      yield put({type:'saveNewsItem',payload: data});
    }
  },
  reducers: {
    saveNewsTabs(state, { payload }) {
      return {...state, tabs: payload}
    },
    saveNewsTop(state, { payload }) {
    return {...state, newsTopList:{...state.newsTopList,...payload}}
    },
    saveNews(state, { payload }) {
      return {...state, newsList: payload}
    },
    savePartId(state, { payload }) {
    	return {...state, partId: payload}
    },
    saveNewsItem(state, { payload }) {
      return {...state, newsItem: payload}
    },
    saveOffset(state, { payload}) {
      console.log( state.offset )
      let offset = state.offset
      return {...state, offset: ++offset}
    }
  },
  subscriptions: {
    setup({ dispatch }) {
    	dispatch({ type: 'getDefaultInfo'});
    	// dispatch({ type: 'get_all_news'});
    }
  }
}