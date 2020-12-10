import {
  queryCarousel,
  updateCarousel,
  deleCarousel,
  postCarousel,
} from '@/services/dealer_carousel';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'dealer_carousel',

  state: {
    carousels: [],
  },

  effects: {
    *getCarousels(_, { call, put }) {
      const { data, err } = yield call(queryCarousel);
      if (err) console.log(err);
      else {
        console.log(data);
        yield put({ type: 'saveCarousel', payload: data });
      }
    },
    *editList({ payload }, { call, put, select }) {
      console.log(payload);
      const { carousels } = yield select(state => state.dealer_carousel);
      const { data, err } = yield call(updateCarousel, payload);
      if (err) console.log(err);
      else {
        yield put({ type: 'getCarousels' });

        // carousels.forEach((cs, inx) => {
        //   if (cs.id === payload.key) {
        //     carousels.splice(inx, 1, data);
        //   }
        // });
        // yield put({ type: 'saveCarousel', payload: carousels });
      }
    },
    *deleLists({ payload, callback }, { call, put, select }) {
      const { key } = payload;
      const { carousels } = yield select(state => state.dealer_carousel);
      const { data, err } = yield call(deleCarousel, key);
      if (err) {
        console.log('请求错误，刷新页面');
      } else {
        message.success('delete ok !');
        for (var i = key.length - 1; i >= 0; i--) {
          carousels.forEach((item, index) => {
            if (item.key === key[i]) {
              carousels.splice(index, 1);
            }
          });
        }
      }
      callback();
    },
    *postCarousel({ payload }, { call, put, select }) {
      console.log(payload);
      let { carousels } = yield select(state => state.dealer_carousel);
      // let { content, cover_img } = payload;
      // let params = { content: content.file.name, cover_img: cover_img };
      let { data, err } = yield call(postCarousel, payload);
      if (err) console.log('请求错误');
      else {
        carousels.unshift(data);
        yield put({ type: 'saveCarousel', payload: carousels });
        message.success('添加成功');
      }
    },
  },

  reducers: {
    saveCarousel(state, { payload }) {
      return { ...state, carousels: payload };
    },
  },
};
