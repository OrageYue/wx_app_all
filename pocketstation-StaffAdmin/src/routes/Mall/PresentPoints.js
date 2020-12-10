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
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Radio,
  Cascader,
  Upload,
  Table,
  message,
} from 'antd';
import { timeFormat2 } from '../../utils/utils';
import styles from './PresentPoints.less';

const RESOURCE = 'points';

@connect(
  ({ points }) => ({
    staffs: points.staffs,
  }),
  dispatch => ({
    present(params) {
      dispatch({ type: `${RESOURCE}/present`, payload: params });
    },
    search() {
      dispatch({ type: `${RESOURCE}/search` });
    },
  })
)
@Form.create()
export default class PresentPoints extends Component {
  state = {
    selectedRows: [],
    editingKey: '',
    visible: false,
  };

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '用户id',
        dataIndex: 'id',
      },
      {
        title: '员工姓名',
        dataIndex: 'name',
      },
      {
        title: '出生日期',
        dataIndex: 'birthday',
        render: (txt, record) => <div>{timeFormat2(record.birthday)}</div>,
      },
      {
        title: '操作',
        render: (txt, record, idx) => {
          return (
            <span>
              <Button
                onClick={() => this.handleModelVisible(record)}
                size="small"
                type="primary"
                ghost
              >
                赠送积分
              </Button>
            </span>
          );
        },
      },
    ];
  }

  handleModelVisible = record => {
    this.setState({ visible: true });
    this.setState({ id: record.id });
  };

  handleModelClose = record => {
    this.setState({ visible: false });
  };

  handle_OK = () => {
    const { form } = this.props;
    const { id } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.user_id = id;
      fieldsValue.points = fieldsValue.points * 1;
      this.props.present(fieldsValue);
      this.setState({ visible: !this.state.visible });
    });
  };

  handleSearch = () => {
    this.props.search();
  };

  render() {
    let { staffs, form } = this.props;
    staffs = staffs.map(ss => ({ id: ss.id, name: ss.name, birthday: ss.birthday, key: ss.id }));
    const { visible } = this.state;

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
      <PageHeaderLayout title="积分赠送">
        <Card>
          <div className={styles.tableList}>
            <Button
              type="primary"
              ghost
              size="default"
              onClick={this.handleSearch}
              style={{ marginBottom: 8 }}
            >
              查询今日生日员工
            </Button>
            <Table dataSource={staffs} columns={this.columns} onChange={e => console.log(e)} />
          </div>
        </Card>
        <Modal
          visible={visible}
          title="赠送积分"
          onOk={() => this.handle_OK()}
          onCancel={() => this.handleModelClose()}
        >
          <Form.Item {...formItemLayout} label="赠送积分数量">
            {form.getFieldDecorator('points', {
              rules: [{ required: true, message: 'Please input points counts...' }],
            })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
          </Form.Item>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
