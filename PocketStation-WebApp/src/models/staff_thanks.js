import gratsServices from '../services/grats';
import { Toast } from 'antd-mobile';
import { host } from '../constants';
export default {
  namespace: 'grats',
  state: {
    gratStar: {},
    gratsRecords: [],
    bu_staffs: [],
    pickerValue: [],
    gratsTree: []
  },
  effects: {
    *getGratStar(_, { call, put }) {
      const { data, err } = yield call(gratsServices.queryGratStar);
      if( err ) {
        Toast.info('请刷新页面');
      }else {
        yield put({type:'saveGratStar',payload: data});
      }
    },
    *getGratsRecords(_, { call, put }) {
      const { data, err } = yield call(gratsServices.getGratsRecord);
      if( err ) {
        Toast.info('请刷新页面');
      }else {
        yield put({type:'saveGratsRecords', payload: data});
      }
    },
    *getBus(_, { call, put }) {
    	const { data, err } = yield call(gratsServices.getBus);
      if( err ) {
        Toast.info('请刷新页面');
      }else {
        let bus = [];
        for( let i=0;i<data.length;i++ ) {
        	let obj = {};
        	if( !data[i].children ) {
        		const { data: buStaff } = yield call(gratsServices.getBu_Staff,{buId:data[i].id});
        		if( buStaff ) {
        			buStaff.forEach( item => {
        				item['label'] = item.name;
        				item['value'] = item.name;
        			})
        			obj = {"id":data[i].id, "label": data[i].name, "value":data[i].name, "children":[]};
        			obj['children']=[...obj.children,...buStaff]
        			bus.push( obj );
        		}else {
        			obj = {"id":data[i].id, "label": data[i].name, "value":data[i].name, "children":[]};
        			bus.push( obj );
        		}
        	}
        }
        yield put({type:'saveBus', payload: bus});
      }
    },
    *getBu_Staff({ payload }, { call, put, select }) {
      const { buId } = payload;
      const { bu_staffs } = yield select( state => state.thanks );
    	const { data, err } = yield call(gratsServices.getBu_Staff,payload);
      if( err ) {
        Toast.info('请刷新页面');
      }else {
        data.forEach( item => {
        	item['label'] = item.name;
        	item['value'] = item.name;
        })
        bu_staffs.forEach( itm => {
        	if( itm.id === buId ) {
        		itm['children']=[...itm.children,...data]
        	}
        })
        yield put({type:'saveBus', payload: bu_staffs});
      }
    },
    *submitGrats({ payload }, { call, put, select }) {
      let { gratsRecords } = yield select( state => state.grats );
      const { data, err } = yield call(gratsServices.postGrans, payload);
      if( err ) {
        Toast.info('请刷新页面');
      }else {
        gratsRecords.unshift( data );
        yield put({type:"saveGratsRecords", payload: gratsRecords});
        if( data ) {
        	Toast.info('提交成功');
        }else {
        	Toast.info('请重新填写提交');
        }
      }
    },
    *getGratsTree({ payload }, { call, put }) {
      const { data, err } = yield call(gratsServices.getGratsTree, payload);
      if( err ) {
        Toast.info('请刷新页面');
      } else {
        yield put({type:'saveGratsTree',payload: data});
      }
    }
  },
  reducers: {
    saveGratStar(state, { payload }) {
      return {...state, gratStar: payload}
    },
    saveGratsRecords(state, { payload }) {
      let gratsRecords = payload.map( gs => {
        if( gs.staff_to.avatar.indexOf('http') === -1 ) {
          // gs.staff_from.avatar = host + gs.staff_from.avatar;
          gs.staff_to.avatar = host + gs.staff_to.avatar;
        }
        return gs;
      })
      return {...state, gratsRecords }
    },
    saveStaff_BU(state, { payload }) {
    	return {...state, bu_staffs: payload}
    },
    changePickerValue(state, { payload }) {
      const { bu_staffs } = state;
      let changedId = undefined;
      bu_staffs.forEach( itm => {
        if( itm.id === payload[0] ) {
          const bustaff = itm.children;
          bustaff.forEach( item => {
            if( item.name === payload[1] ) {
              changedId = item.id;
            }
          })
        }
      })
    	return {...state, pickerValue: payload, to_id: changedId}
    },
    saveInpContent(state, { payload }) {
      return {...state, inpContent: payload}
    },
    saveGratsTree(state, { payload }) {
      return {...state, gratsTree: payload};
    }
  },
  subscription: {
    
  }
}