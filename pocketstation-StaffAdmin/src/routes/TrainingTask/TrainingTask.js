import React, { Component, Fragment } from 'react';
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
  Table,
  Checkbox,
  Progress,
  InputNumber
} from 'antd';

import styles from './TrainingTask.less';
import { host, UploadURL } from "../../constants";



const RESOURCE = 'trainingtask';



@connect(
  ({ trainingtask: { trainingtasks }, lesson: { lessons }, staff: { staffs }, loading }) => ({
    trainingtasks, lessons, staffs,
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
  })
)
@Form.create()
export default class TrainingTask extends Component {
  state = {
    selectedRows: [],
    modalNewVisible: false,
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

  handleNewBU_OK = () => {
    const { form, add } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue)
      add(fieldsValue).then(() => {
        this.handleNewModelVisible();
        form.resetFields();
      });
    });
  };


  render() {
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '员工',
        render: (txt, row) => row.staff.name
      }, {
        title: '邮箱',
        render: (txt, row) => row.staff.email,
      }, {
        title: '电话',
        render: (txt, row) => row.staff.tel,
      }, {
        title: '课程',
        render: (txt, row) => `${row.lsn.oprt.cls.name}/${row.lsn.oprt.name}/${row.lsn.name}`
      }, {
        title: '时限',
        render: (txt, row) => `${row.limit}天`
      }, {
        title: '状态',
        // width: 180,
        render: (txt, row) => {
          if( row.staff.status) {
            if( row.staff.status.split('#').includes(row.lsn.id+'') ) {
              return <span style={{ color: "#18C086", fontWeight: '700'}}>通过</span>
            }else {
              return <span style={{ color: "#f00" }}>未通过</span>
            }
          }else {
            return <span style={{ color: "#f00" }}>未通过</span>
          }
          // if (row.finish_at && row.days_gone <= row.limit) {
          //   return <span style={{ color: "green" }}>通过</span>
          // } else if (row.finish_at && row.days_gone > row.limit) {
          //   return <span style={{ color: "yellow" }}>超时通过</span>
          // } else {
            // return <Progress
            //   percent={Math.min(100 * (row.days_gone / row.limit), 100)}
            //   status={row.days_gone > row.limit ? "exception" : "active"}
            //   format={(p)=>`${p.toFixed(0)}%`}
            //   />
          // }
        }
      }, {
        title: '操作',
        render: (txt, row, idx) => (
          <Fragment>
            <Button disabled={true} size="small">
              编辑
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title="将删除该任务及其任何相关信息"
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

    const { loading, form, adding, removing, trainingtasks: tableData, lessons } = this.props;
    let { staffs } = this.props;
    staffs = staffs.filter( item => {
      return item.name !== '无'
    })
    const { modalNewVisible } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        md: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 15 }
      },
    };

    return (
      <PageHeaderLayout title="任务管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleNewModelVisible()}>
                添加
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Popconfirm
                    title="将删除该任务及其任何相关信息"
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
          <Modal
            visible={modalNewVisible}
            title="布置任务"
            onOk={() => this.handleNewBU_OK()}
            onCancel={() => this.handleNewModelVisible()}
            confirmLoading={adding}
            width={650}
          >
            <Form.Item {...formItemLayout} label="课程">
              {form.getFieldDecorator('lsn_id', {
                rules: [{ required: true, message: 'Please select class...' }],
              })(
                <Select
                  style={{ minWidth: 160 }}
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {lessons.map((cls) => <Select.Option key={cls.id} value={cls.id}>
                    {`${cls.oprt.cls.name}/${cls.oprt.name}/${cls.name}`}
                  </Select.Option>)}
                </Select>
              )}
            </Form.Item>

            <Form.Item {...formItemLayout} label="员工">
              {form.getFieldDecorator('staff_id', {
                rules: [{ required: true, message: 'Please select staff...' }],
              })(
                <Select
                  // mode="multiple"
                  style={{ minWidth: 160 }}
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {staffs.map((staff) => <Select.Option key={staff.id} value={staff.id}>
                    {`${staff.pos.bu.name}/${staff.pos.name}/${staff.name}`}
                  </Select.Option>)}
                </Select>
              )}
            </Form.Item>

            <Form.Item {...formItemLayout} label="时限">
              {form.getFieldDecorator('limit', {
                rules: [{ required: true, message: 'Please input limit...' }],
                initialValue: 15
              })(
                <InputNumber
                  min={1}
                  formatter={value => `天数 ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\天数\s?|(,*)/g, '')}
                />
              )}
            </Form.Item>

          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
