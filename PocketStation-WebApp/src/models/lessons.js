
import LessonsService from "../services/lesson";
import OprServices from '../services/operation';
import { warn } from "../utils/log";
import { formatLessonPartsImageUrl } from "../utils/dev";


const Namespace = 'lessons';

export default {
  namespace: Namespace,
  state: {
    parts: [],
    list: [],
    all_tools: [],
    type: '课程',
    selectedIndex: 0,
    type_flag: '',
  },
  effects: {
    *queryLessonParts(_, { call, put }) {
      const { err, data } = yield call(LessonsService.queryLessonParts);
      if (err) {
        warn(err);
      } else {
        yield put({ type: 'saveLessonParts', payload: data });
      }
    },
    *queryOperations({ payload }, { call, put }) {
      let { openid, part_id, types } = payload;
      const { data, err } = yield call(LessonsService.get_operations, part_id);
      if(err){
        warn(err)
      }else {
        yield put({ type: 'saveOperations', payload: data });
        yield put({ type: 'saveSelectedIndex', payload: 0 });
        yield put({ type: 'saveType', payload: '课程' });
        for(let i=0; i< data.length; i++) {
          let params = {openid, subPart_id: data[i].id, types};
          const { data: lessons, err } = yield call(OprServices.queryOprt_lsn, params);
          if(err) {
            warn(err)
          }else {
            yield put({type: 'saveOprLessons', payload: {lessons: lessons,subPart_id: data[i].id}});
          }
        }
      }
    },
  },
  reducers: {

    saveLessonParts(state, { payload }) {
      const parts = payload.map(it => ({
        id: it.id,
        title: it.name,
        img: it.img_src,
      }))
      return { ...state, parts };
    },
    saveOperations(state, { payload }) {
      let list = payload.map( op => ({
        id: op.id,
        name: op.name,
        cover_img: formatLessonPartsImageUrl(op.img_src),
      }))
      return { ...state, list: list};
    },
    saveSelectedIndex( state, { payload } ) {
      return { ...state, selectedIndex: payload };
    },
    saveType( state, { payload } ) {
      return { ...state, type: payload };
    },
    saveTools(state, { payload }) {
      return { ...state, selectedIndex: 1, type: '资源', all_tools: payload };
    },
    saveOprLessons(state, { payload }) {
      let { lessons, subPart_id } = payload;
      // console.log( subPart_id )
      let { list } = state;
      list.forEach( lt => {
        if( lt.id === subPart_id ) {
          lt.children = lessons;
        }
      });
      return {...state, list};
    },
    saveTypeFlag(state, { payload }) {
      return { ...state, type_flag: payload };
    }
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'queryLessonParts' });
    }
  }
}