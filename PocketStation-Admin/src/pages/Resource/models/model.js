import {
  queryResources,
  postResource,
  deleResource,
  updateResource,
  queryHier,
  search,
} from '@/services/dealerResources';
import { message } from 'antd';

export default {
  namespace: 'dealer_resource',

  state: {
    resources: [],
    hier: [{ id: 1, name: '根目录' }],
  },

  effects: {
    *search({ payload }, { call, put }) {
      const { data } = yield call(search, payload);
      data.length > 0
        ? yield put({
            type: 'saveResources',
            payload: data,
          })
        : message.info('该资源不存在');
    },
    *queryHier({ payload }, { call, put, select }) {
      let { data, err } = yield call(queryHier);
      if (err) {
        message.warn(err);
      } else {
        yield put({ type: 'saveHier', payload: data });
      }
    },
    *queryResources(_, { call, put }) {
      let { data, err } = yield call(queryResources);
      if (err) {
        message.warn(err);
      } else {
        yield put({ type: 'saveResources', payload: data });
      }
    },
    // *queryResources(_, { call, put }) {
    //   let { data, err } = yield call(queryResources);
    //   if (err) {
    //     message.warn(err);
    //   } else {
    //     yield put({ type: 'saveResources', payload: data });
    //   }
    // },
    *postResource({ payload }, { call, put, select }) {
      const { resources } = yield select(state => state.dealer_resource);
      // let { type, content, ...others } = payload;
      // let text = type === 'richtext' ? content.blocks[0].text : content.file.name;
      // let params = { type, content: text, ...others };
      let { data, err } = yield call(postResource, payload);
      if (err) {
        message.warn(err);
      } else {
        // if (payload.type !== 'folder') {
        //   resources.unshift(data);
        // }
        // yield put({ type: 'saveResources', payload: resources });
        yield put({ type: 'queryResources' });
      }
    },
    *deleLists({ payload, callback }, { call, put, select }) {
      const { key } = payload;
      const { resources } = yield select(state => state.dealer_resource);
      const { data, err } = yield call(deleResource, key);
      if (err) {
        console.log('请求错误，刷新页面');
      } else {
        message.success('删除成功');
      }
      for (var i = key.length - 1; i >= 0; i--) {
        resources.forEach((item, index) => {
          if (item.key === key[i]) {
            resources.splice(index, 1);
          }
        });
      }
      callback();
    },
    *editResource({ payload }, { call, put, select }) {
      const { resources } = yield select(state => state.dealer_resource);
      const { data, err } = yield call(updateResource, payload);
      // console.log(payload);
      if (err) {
        console.log('请求错误');
      } else {
        resources.forEach((itm, inx) => {
          if (itm.id === payload.key) {
            resources.splice(inx, 1, data);
          }
        });
        yield put({ type: 'saveResources', payload: resources });
      }
    },
  },

  reducers: {
    saveResources(state, { payload }) {
      return { ...state, resources: payload };
    },
    saveHier(state, { payload }) {
      // let hier = state.hier;
      // hier = [...hier, ...payload]
      // state.hier.push(payload);
      // console.log(hier)
      return { ...state, hier: payload };
    },
  },
};
