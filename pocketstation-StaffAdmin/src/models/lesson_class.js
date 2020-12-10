//
import {
  queryLessonClasses,
  addLessonClass,
  removeLessonClass,
  patchLessonClass,
} from '../services/api';

export default {
  namespace: 'lesson_class',

  state: {
    lesson_classes: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryLessonClasses);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *remove({ payload: objs }, { call, put }) {
      for (let obj of objs) {
        yield call(removeLessonClass, { cls_id: obj.id });
        yield put({
          type: 'reduce',
          payload: obj.id,
        });
      }
    },
    *add({ payload: params }, { call, put }) {
      const response = yield call(addLessonClass, params);
      yield put({
        type: 'extend',
        payload: response,
      });
    },
    *patch({ payload: params }, { call, put }) {
      const response = yield call(patchLessonClass, params);
      // yield put({
      //   type: 'update',
      //   payload: response,
      // });
      yield put({ type: 'fetch' });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        lesson_classes: action.payload,
      };
    },
    extend(state, { payload: obj }) {
      const { lesson_classes } = state;
      return {
        ...state,
        lesson_classes: [obj, ...lesson_classes],
      };
    },
    reduce(state, { payload: obj_id }) {
      const { lesson_classes } = state;
      return {
        ...state,
        lesson_classes: lesson_classes.filter(obj => obj.id !== obj_id),
      };
    },
    update(state, { payload: obj }) {
      const { lesson_classes } = state;
      const idx = lesson_classes.findIndex(e => e.id === obj.id);
      lesson_classes[idx] = obj;
      return {
        ...state,
        lesson_classes: [...lesson_classes],
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'fetch' });
    },
  },
};
