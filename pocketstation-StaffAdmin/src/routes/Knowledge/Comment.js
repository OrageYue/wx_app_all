import { Component, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandartTable from '../../components/StandardTable';
import {
  Divider,
  Button,
  Card,
  Dropdown,
  Menu,
  Icon,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Radio,
  Cascader,
  Upload,
} from 'antd';

import styles from './Comment.less';
import { host } from '../../constants';

const RESOURCE = 'comment';

@connect(
  ({ lesson: { lessons }, staff: { staffs }, comment: { comments }, loading }) => ({
    comments,
    lessons,
    staffs,
    loading: loading.effects[`${RESOURCE}/query`],
    deleting: loading.effects[`${RESOURCE}/delete`],
    adding: loading.effects[`${RESOURCE}/add`],
  }),
  dispatch => ({
    remove(objs) {
      return dispatch({ type: `${RESOURCE}/remove`, payload: objs });
    },
    add(params) {
      return dispatch({ type: `${RESOURCE}/add`, payload: params });
    },
    staff_search(params) {
      return dispatch({ type: `${RESOURCE}/staff_search`, payload: params });
    },
    lsn_search(params) {
      return dispatch({ type: `${RESOURCE}/lsn_search`, payload: params });
    },
  })
)
export default class Comment extends Component {
  state = {
    selectedRows: [],
    modalNewVisible: false,
    staffs: [],
    staff_id: '',
    lsn_id: '',
  };

  handleSelectRow = rows => {
    this.setState({ selectedRows: rows });
  };

  handleDeleteOne = obj => {
    const { remove } = this.props;
    remove([obj]);
  };

  handleDeleteList = () => {
    const { selectedRows } = this.state;
    const { remove } = this.props;
    remove(selectedRows);
  };

  handleNewModelVisible = () => {
    const { modalNewVisible } = this.state;
    this.setState({ modalNewVisible: !modalNewVisible });
  };

  handleSearch_staff = () => {
    const { staff_id } = this.state;
    this.props.staff_search({ staff_id });
  };

  handleChange_staff = value => {
    this.setState({
      staff_id: value,
    });
  };

  handleSearch_lsn = () => {
    const { lsn_id } = this.state;
    this.props.lsn_search({ lsn_id });
  };

  handleChange_lsn = value => {
    this.setState({
      lsn_id: value,
    });
  };

  render() {
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '分类',
        render: (txt, row) => row.lsn.oprt.cls.name,
      },
      {
        title: '术式',
        render: (txt, row) => row.lsn.oprt.name,
      },
      {
        title: '课程',
        render: (txt, row) => row.lsn.name,
      },
      {
        title: '评论者',
        render: (txt, row) => row.staff.name,
      },
      {
        title: '评论内容',
        dataIndex: 'content',
      },
      {
        title: '操作',
        render: (txt, row, idx) => (
          <Fragment>
            <Popconfirm
              title="删除该条评论？"
              okText="删除"
              cancelText="取消"
              onConfirm={() => this.handleDeleteOne(row)}
            >
              <Button type="danger" size="small">
                删除
              </Button>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const { loading, form, adding, removing, lessons, staffs } = this.props;

    let { comments: tableData } = this.props;
    console.log(tableData);
    tableData = tableData.map(ta => ({ ...ta, key: ta.id }));

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <PageHeaderLayout title="评论管理">
        <Card bordered={false}>
          课程：<Select
            showArrow={false}
            style={{ width: 160, marginRight: '8px' }}
            showSearch
            onChange={this.handleChange_lsn}
          >
            {lessons.map(lsn => (
              <Select.Option key={lsn.id} value={lsn.id}>
                <span>{lsn.name}</span>
              </Select.Option>
            ))}
          </Select>
          <Button
            type="primary"
            ghost
            size="small"
            onClick={this.handleSearch_lsn}
            style={{ marginRight: '10px' }}
          >
            查询
          </Button>
          员工：<Select
            showArrow={false}
            style={{ width: 160, marginRight: '8px' }}
            showSearch
            onChange={this.handleChange_staff}
          >
            {staffs.map(staff => (
              <Select.Option key={staff.id} value={staff.id}>
                <span>{staff.name}</span>
              </Select.Option>
            ))}
          </Select>
          <Button type="primary" ghost size="small" onClick={this.handleSearch_staff}>
            查询
          </Button>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <Popconfirm
                    title="删除所有选中评论？"
                    okText="删除"
                    cancelText="取消"
                    onConfirm={this.handleDeleteList}
                  >
                    <Button loading={removing}>批量删除</Button>
                  </Popconfirm>
                </span>
              )}
            </div>
            <StandartTable
              rowKey="id"
              selectedRows={selectedRows}
              onSelectRow={this.handleSelectRow}
              loading={loading}
              data={{ list: tableData }}
              columns={columns}
              onChange={e => console.log(e)}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
