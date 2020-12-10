import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, Upload, Popconfirm, Form, Button, Card, Icon, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getPageQuery } from '@/utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(
  ({ QA }) => ({ QA }),
  dispatch => ({
    getFaq(id) {
      dispatch({ type: 'QA/getFaq', payload: id });
    },
    updateFAQ(id, fieldsValue) {
      dispatch({ type: 'QA/updateFAQ', payload: { fieldsValue, id } });
    },
  })
)
class EditFaq extends Component {
  componentDidMount() {
    let { id } = getPageQuery(window.location.href);
    this.props.getFaq(id * 1);
  }
  handleSubmit = e => {
    let { id } = getPageQuery(window.location.href);
    id = id * 1;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.updateFAQ(id, values);
      }
    });
  };
  goBack = () => {
    this.props.history.goBack();
  };
  render() {
    let { faq } = this.props.QA;
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
      <PageHeaderWrapper title="编辑FAQ">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="问题">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your question',
                  },
                ],
                initialValue: faq.title,
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="答案">
              {getFieldDecorator('answer', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your answer',
                  },
                ],
                initialValue: faq.answer,
              })(<TextArea rows={4} />)}
            </FormItem>
            <FormItem wrapperCol={{ span: 12, offset: 10 }}>
              <Button type="primary" ghost htmlType="submit" style={{ marginRight: '8px' }}>
                提交
              </Button>
              <Button type="primary" ghost onClick={() => this.goBack()}>
                取消
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const WrappedEditFaq = Form.create()(EditFaq);
export default WrappedEditFaq;
