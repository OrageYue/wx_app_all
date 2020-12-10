import {
  queryTrainings,
  updateLesson,
  deleLesson,
  getLecturers,
  postTrainingCourse,
  getGains,
  changeEssence,
} from '@/services/trainings';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

export default {
  namespace: 'recommendtrainings',

  state: {
    lessons: [],
    lecturers: [],
    gains: [],
  },

  effects: {
    *getTrainings(_, { call, put }) {
      const { data, err } = yield call(queryTrainings);
      if (err) {
        console.log('请求错误');
      } else {
        yield put({ type: 'saveLessons', payload: data });
      }
    },
    *editList({ payload }, { call, put, select }) {
      const { lessons } = yield select(state => state.recommendtrainings);
      const { data, err } = yield call(updateLesson, payload);
      if (err) {
        console.log('请求错误');
      } else {
        lessons.forEach((itm, inx) => {
          if (itm.id === payload.course_id) {
            lessons.splice(inx, 1, data);
          }
        });
        yield put({ type: 'saveLessons', payload: lessons });
      }
    },
    *deleLists({ payload, callback }, { call, put, select }) {
      const { key } = payload;
      const { lessons } = yield select(state => state.recommendtrainings);
      const { data, err } = yield call(deleLesson, key);
      if (err) {
        console.log('请求错误，刷新页面');
      } else {
        message.success('delete ok !');
      }
      for (var i = key.length - 1; i >= 0; i--) {
        lessons.forEach((item, index) => {
          if (item.key === key[i]) {
            lessons.splice(index, 1);
          }
        });
      }
      callback();
    },
    *getLecturers(_, { call, put }) {
      const { data, err } = yield call(getLecturers);
      if (err) {
        console.log('请求错误');
      } else {
        yield put({ type: 'saveLecturers', payload: data });
      }
    },
    *postTrainingCourse({ payload }, { call, put, select }) {
      let { lessons } = yield select(state => state.recommendtrainings);
      let { values, imgUrl, content } = payload;
      const { desc, lecturer, title } = values;
      let params = { content: content, cover_img: imgUrl, desc, lecturer, title };
      const { data, err } = yield call(postTrainingCourse, params);
      let arr = [];
      arr.push(data);
      lessons = [...lessons, ...arr];
      yield put({ type: 'saveLessons', payload: lessons });
      message.success('add ok !');
      yield put(routerRedux.push('/dealer/recommendtrainings/lesson'));
    },
    *getGains({ payload }, { call, put }) {
      const { data, err } = yield call(getGains, payload);
      if (err) {
        console.log('请求错误');
      } else {
        yield put({ type: 'saveGains', payload: data });
      }
    },
    *changeEssence({ payload }, { call, put, select }) {
      let { gains } = yield select(state => state.recommendtrainings);
      const { data, err } = yield call(changeEssence, payload);
      if (err) {
        console.log('请求错误');
      } else {
        gains.forEach(gs => {
          if (gs.id === payload.gains_id) {
            gs.is_essence = !gs.is_essence;
          }
        });
        yield put({ type: 'saveGains', payload: gains });
      }
    },
  },

  reducers: {
    saveLessons(state, { payload }) {
      return { ...state, lessons: payload };
    },
    saveLecturers(state, { payload }) {
      return { ...state, lecturers: payload };
    },
    saveGains(state, { payload }) {
      return { ...state, gains: payload };
    },
  },
};
