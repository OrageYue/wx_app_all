import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Flex, Toast, WingBlank, Picker, Modal, List, TextareaItem } from 'antd-mobile';
import arrayTreeFilter from 'array-tree-filter';
import styles from './index.less';
import GratRecordsGroup from '../../components/GratRecordsGroup';
import StaffService from "../../services/staff";
import GratsCard from '../../components/GratsCard';
import { compare } from '../../utils/utils';
import { createForm } from 'rc-form';

class StaffGratsPage extends Component {
  state = {
    visible: false,
  }
  componentDidMount() {
    const { getGratStar, getGratsList, getGratsTree } = this.props;
    getGratStar();
    getGratsList();
    getGratsTree();
  }
 
  onClose = () => {
    this.setState({
      visible: false,
    });
  }

  getSel = (pickerValue, bu_staffs) => {
  	const value = pickerValue;
  	if (value.length===0) {
  		return '';
  	}
  	const treeChildren = arrayTreeFilter(bu_staffs, (c, level) => c.value === value[level]);
  	return treeChildren.map(v => v.name).join(',');
  }

  onGrat = (e) => {
    e.preventDefault();  
    this.setState({
      visible: true,
    })
    this.get_bu_staffs();
  }

  get_bu_staffs = async () => {
    const { data: staffs } = await StaffService.get_all()
    const { staff_id, onStaff_BU } = this.props;
    const bu_staffs = [];
    for (let staff of staffs) {
      const bu = staff.pos.bu;
      let _bu = bu_staffs.find((v) => v.value === bu.id);
      if (!_bu) {
        _bu = { value: bu.id, label: bu.name, children: [] };
        bu_staffs.push(_bu)
      }
      // 排除自己
      if (staff_id !== staff.id) {
        _bu.children.push({ label: staff.name, value: staff.id });
      }
    }
    onStaff_BU( bu_staffs );
  }

  onSubmit = () => {
    const { staff_id: _from, submitHandle } = this.props;
    let to = this.props.pickerValue;
    let content = this.props.form.getFieldValue('content');
    if( to.length === 0 ) {
      Toast.info("请选择感恩对象", 1);
    }else if( !content ){
      Toast.info("请填写感谢内容", 1);
    }else {
      let params = { content, _from, to: to[1] };
      submitHandle( params );
      this.props.form.setFieldsValue({ content: "" });
      Toast.info("感恩已发送～", 1);
    }
  }

  gransCard = ({ gratsTree, gratStar }) => {
    let { bu_staffs, pickerValue, onChangePickerValue, getBus, loading_tree, loading_star } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <Flex>
        <GratsCard gratsTree={gratsTree} loading_tree={loading_tree} loading_star={loading_star} gratStar={gratStar} onGrat={this.onGrat} />
        <Modal
          visible={this.state.visible}
          transparent
          maskClosable={true}
          onClose={this.onClose}
          title="感恩信"
          footer={[
            { text: '取消', onPress: () => { this.onClose(); } },
            { text: '确认', onPress: () => { this.onSubmit(); this.onClose();} }
          ]}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
          className={styles.modalContainer}
        >
          <Flex style={{ height: '100%', overflow: 'scroll' }} direction="column">
            <Flex justify="between" style={{width: '82%'}}>
              <Flex justify="start" className={styles.modalTitle}>感恩对象</Flex>
              <Picker
                data={bu_staffs}
                title="BU-Staff"
                value={pickerValue}
                extra='选择部门,选择员工'
                onChange={ v => onChangePickerValue({ pickerValue: v })}
              >
                <List.Item 
                  extra={this.getSel(pickerValue, bu_staffs)} 
                  onClick={getBus}>
                </List.Item>
              </Picker>
            </Flex>
            <Flex justify="start" direction="column">
              <Flex justify="start" className={styles.modalTitle}>想说的话</Flex>
              <Flex className={styles.textarea}>
                <TextareaItem
                  {...getFieldProps('content')}
                  rows={3}
                />
              </Flex>
            </Flex>
          </Flex>
        </Modal>
      </Flex>
    )
  }
  render() {
    let { gratsRecords, loading, onTreeCardClick } = this.props; 
    let { gratsTree, gratStar } = this.props;
    gratsTree = gratsTree.map( gt => ({gt, treeCardClick: () => onTreeCardClick(gt.id) }));
    gratsRecords.sort(compare('id'));
    return (
      <Flex className={styles.thanksWrapper} direction="column" justify="start" align="start">
        <Flex className={styles.grats_top} justify="center" align="start">
          <span className={styles.pageTit}>PocketStation</span>
        </Flex>
        <WingBlank className={styles.grats_treeCard}>
          {/* 感恩之心 */}
          { this.gransCard({gratsTree, gratStar}) }

          {/* 感恩记录 */}
          <Flex className={styles.grants_records} justify="center">
            { loading ? <Icon type="loading" size='md' /> : <GratRecordsGroup records={gratsRecords} /> }
          </Flex>
        </WingBlank>
      </Flex>
    )
  }
}

StaffGratsPage.defaultProps = {}

function mapState2Props({ grats, user, loading }) {
  let {gratStar, gratsTree, gratsRecords, pickerValue, bu_staffs } = grats;
  return {
    staff_id: user.id,
    gratStar,
    gratsTree,
    gratsRecords,
    pickerValue,
    bu_staffs,
    loading: loading.effects['grats/getGratsRecords'],
    loading_tree: loading.effects['grats/getGratsTree'],
    loading_star: loading.effects['grats/getGratStar'],
  }
}

function mapDispatch2Props( dispatch ) {
  return {
    onStaff_BU( bu_staffs ) {
      dispatch({type:'grats/saveStaff_BU', payload: bu_staffs});
    },
    //获取本月感恩之星函数
    getGratStar() {
      dispatch({type:'grats/getGratStar'});
    },
    //获取感恩记录函数
    getGratsList() {
      dispatch({type:'grats/getGratsRecords'});
    },
    //改变选择的感恩对象
    onChangePickerValue({pickerValue}) {
      dispatch({type:'grats/changePickerValue', payload:pickerValue});
    },
    //提交最新感恩
    submitHandle( params ) {
      dispatch({type:'grats/submitGrats', payload:params});
    },
    //获取感恩树
    getGratsTree() {
      dispatch({type:'grats/getGratsTree'});
    },
    onTreeCardClick(id) {
      console.log( id )
    }
    
  }
}

const StaffGratsPageWrapper = createForm()(StaffGratsPage);
export default connect(mapState2Props, mapDispatch2Props )(StaffGratsPageWrapper)