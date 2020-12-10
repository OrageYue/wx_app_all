
import { getPageQuery } from '../utils/utils';
import ToolService from '../services/tool';
import { warn } from '../utils/log';
export default {
  namespace: 'tool',
  state: {
    tool_info: {},
    collects: [],
  },
  effects: {
    *getToolInfo({ payload }, { call, put }) {
      const { data, err } = yield call(ToolService.queryToolInfo, payload);
      if(err){
        warn(err)
      }else {
        yield put({type: 'saveTool', payload: data});
      }
    },
    // *onCollect_all({ payload }, { call, put }) {
    //   let { data, err } = yield call(ToolService.queryCollect, payload );
    //   if(err){
    //     warn(err);
    //   }else {
    //     yield put({type: 'save_collects', payload: data});
    //   }
    // },
    
    *collect({ payload, callback }, { call, put, select }) {
      let { collects } = yield select( state => state.tool);
      let { data, err } = yield call(ToolService.collect, payload );
      if(err){
        warn(err);
      }else {
        // collects.push(payload.user_id);
        // yield put({type:'save_collects', payload: collects});
        callback();
      }
    },
    *cancleCollect({ payload, callback }, { call, put, select }) {
      let { collects } = yield select( state => state.tool);
      let { data, err } = yield call(ToolService.de_collect, payload );
      if(err){
        warn(err);
      }else {
        // collects.forEach( (cs, inx) => {
        //   cs === payload.user_id?collects.splice(inx,1):null;
        // });
        // console.log( collects )
        // yield put({type:'save_collects', payload: collects});
        callback();
      }
    },
  },
  reducers: {
    saveTool(state, { payload }) {
      return {...state, tool_info: payload};
    },
    save_collects(state, { payload }) {
      return {...state, collects: payload};
    },
    saveOprTools(state, { payload }) {
      return {...state, oprTools: payload};
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      // history.listen( ({search}) => {
      //   const { tool_id } =  getPageQuery(search);
      //   if( tool_id ) {
      //     dispatch({type: 'getToolInfo', payload: tool_id})
      //   }
      // })
    }
  }
}