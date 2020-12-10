import ResourceService from '../services/resource';
import { getNodeInTree } from "../utils/resource";
export default {
  namespace: "dealer_resource",
  state: {
    uri: [],
    tree: {
      'id': null,
      'children': null,
    }
  },

  effects: {
    *queryNode({ payload: resId }, { call, put }) {
      // get root id if resId is null
      // if (!resId) {
      //   const { tree } = yield select((s) => s.staff_resource);
      //   resId = tree.id;
      // }
      const { data, err } = yield call(ResourceService.query, resId);
      if (err) {
        console.warn(err);
      } else {
        // console.log(resId, data);
        yield put({ type: 'saveNode', payload: { new_node: data, res_id: resId } });
        // yield put({ type: 'deepinUri', payload: resId });
      }
    }
  },
  reducers: {
    // deepinUri(state, { payload: new_end }) {
    //   return { ...state, uri: [...state.uri, new_end] };
    // },
    saveNode(state, { payload: { new_node, res_id } }) {
      // console.log("Save:", new_node, res_id);

      let { tree, uri } = state;

      const node = getNodeInTree(tree, [...uri, res_id]);
      // console.log("CurNode", node);
      node.children = new_node;
      // console.log("Mount",node);
      uri.push(res_id);
      return { ...state, uri: [...uri] };
    },
  
    /**
     * 后退uri
     * @param {*}} state 
     * @param {*} param1 
     */
    turnBack(state, { payload: new_node }) {
      if (state.uri.length > 1) {
        return { ...state, uri: state.uri.slice(0, state.uri.length - 1) };
      }
      return state
    }
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'queryNode', payload: 1 });
    }
  }
};