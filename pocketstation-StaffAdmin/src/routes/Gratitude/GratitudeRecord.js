import { Component, Fragment } from 'react';
import { connect } from 'dva';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandartTable from '../../components/StandardTable';
// import { queryStaffs } from '../../services/api';

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
  Select,
  Popconfirm,
  message,
} from 'antd';
import styles from './GratitudeRecord.less';

@connect(
  ({ gratitude: { gratitudes }, staff: { staffs }, loading }) => ({
    gratitudes,
    staffs,
    loading: loading.effects['gratitude/query'],
    removing: loading.effects['gratitude/remove'],
  }),
  dispatch => ({
    remove(objs) {
      return dispatch({ type: 'gratitude/remove', payload: objs });
    },
    search(params) {
      return dispatch({ type: `gratitude/search`, payload: params });
    },
  })
)
@Form.create()
class GratitudeRecord extends Component {
  state = {
    selectedRows: [],
    modalNewVisible: false,
    _from: '',
    _to: '',
    staffs: [],
  };
  // async componentDidMount() {
  //   const staffs = await queryStaffs();
  //   this.setState({
  //     staffs,
  //   });
  // }
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

  handleChange_from = value => {
    this.setState({
      _from: value,
    });
  };
  handleChange_to = value => {
    this.setState({
      _to: value,
    });
  };

  handleSearch = () => {
    const { _from, _to } = this.state;
    if (!_from || !_to) {
      message.info('请选择感恩者或者被感恩者');
    } else {
      this.props.search({ _from, _to });
    }
  };

  render() {
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '感谢者',
        render: (txt, row, idx) => (
          <span className={styles.staff}>
            <img src={row.staff_from.avatar} alt={row.staff_from.name} />
            <span>{row.staff_from.name}</span>
          </span>
        ),
      },
      {
        title: '被感谢者',
        render: (txt, row, idx) => (
          <span className={styles.staff}>
            <img src={row.staff_to.avatar} alt={row.staff_to.name} />
            <span>{row.staff_to.name}</span>
          </span>
        ),
      },
      {
        title: '内容',
        dataIndex: 'content',
      },
      {
        title: '操作',
        render: (txt, row, idx) => (
          <Fragment>
            <Divider type="vertical" />
            <Popconfirm
              title="将删除所有记录"
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
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    const { loading, form, removing, gratitudes, staffs } = this.props;
    // const { staffs } = this.state;
    const { modalNewVisible } = this.state;
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
      <PageHeaderLayout title="感恩记录浏览">
        <Card bordered={false}>
          <div>
            感恩者：<Select
              showArrow={false}
              style={{ width: 160, marginRight: '8px' }}
              showSearch
              onChange={this.handleChange_from}
            >
              {staffs.map(staff => (
                <Select.Option key={staff.id} value={staff.name}>
                  <span>{staff.name}</span>
                </Select.Option>
              ))}
            </Select>
            被感恩者：<Select
              showArrow={false}
              style={{ width: 160, marginRight: '8px' }}
              showSearch
              onChange={this.handleChange_to}
            >
              {staffs.map(staff => (
                <Select.Option key={staff.id} value={staff.name}>
                  <span>{staff.name}</span>
                </Select.Option>
              ))}
            </Select>
            <Button type="primary" ghost size="small" onClick={this.handleSearch}>
              查询
            </Button>
          </div>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <Popconfirm
                    title="将删除所选记录"
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
              data={{ list: gratitudes }}
              columns={columns}
              onChange={e => console.log(e)}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default GratitudeRecord;
