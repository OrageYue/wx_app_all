import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Popconfirm, Button, Card, Modal, Form, Input } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { timeFormat } from '@/utils/utils';
import { routerRedux } from 'dva/router';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(
  ({ QA }) => ({ QA }),
  dispatch => ({
    getFaqs() {
      dispatch({ type: 'QA/getFaqs' });
    },
    deleLists(deleOne, callback) {
      dispatch({
        type: 'QA/deleLists',
        payload: { key: deleOne },
        callback,
      });
    },
    submitFAQ(fieldsValue) {
      dispatch({ type: 'QA/postFAQ', payload: fieldsValue });
    },
    goEdit(id) {
      dispatch(routerRedux.push(`/dealer/QA/FAQ/edit?id=${id}`));
    },
  })
)
class FAQ extends Component {
  state = {
    visible: false,
  };
  componentDidMount() {
    this.props.getFaqs();
  }
  columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '问题',
      dataIndex: 'title',
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <div>
            <Button
              size="small"
              onClick={() => this.edit(record.key)}
              style={{ marginRight: '8px' }}
            >
              编辑
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={() => this.deleteList(record.key)}>
              <Button type="danger" size="small">
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  deleteList = key => {
    let deleOne = [];
    key = key * 1;
    deleOne.push(key);
    const callback = () => {
      this.setState({
        selectedRows: [],
      });
    };
    this.props.deleLists(deleOne, callback);
  };
  edit = key => {
    this.props.goEdit(key);
  };
  addLeson = () => {
    this.setState({
      visible: true,
    });
  };
  handleOk = e => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue) {
        this.props.submitFAQ(fieldsValue);
        this.setState({
          visible: false,
        });
        form.resetFields();
      }
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    let { faqs } = this.props.QA;
    faqs.map(fs => (fs.key = fs.id));
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Button
            icon="plus"
            type="primary"
            style={{ marginBottom: '20px' }}
            onClick={() => this.addLeson()}
          >
            新建
          </Button>
          <Table
            bordered
            dataSource={faqs}
            expandedRowRender={record => <div style={{ margin: 0 }}>{record.answer}</div>}
            columns={this.columns}
            rowClassName="editable-row"
            // pagination={{ defaultCurrent: 1, total: 20 }}
            scroll={{ x: 1000 }}
          />
          <Modal
            title="添加FAQ"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <FormItem {...formItemLayout} label="问题">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your question',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="答案">
              {getFieldDecorator('answer', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your answer',
                  },
                ],
              })(<TextArea rows={4} placeholder="请输入" />)}
            </FormItem>
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const WrappedFAQ = Form.create()(FAQ);
export default WrappedFAQ;
