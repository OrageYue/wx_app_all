import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Upload, Icon, Select, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { FormattedMessage } from 'umi/locale';
import { routerRedux } from 'dva/router';
import { host_v1, UploadURL } from '../../constants';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

@connect(
  ({ recommendtrainings }) => ({ recommendtrainings }),
  dispatch => ({
    getLecturers() {
      dispatch({ type: 'recommendtrainings/getLecturers' });
    },
    postTrainingCourse(params) {
      dispatch({ type: 'recommendtrainings/postTrainingCourse', payload: params });
    },
    goBack() {
      dispatch(routerRedux.push('/dealer/recommendtrainings/lesson'));
    },
  })
)
class TrainingAdd extends Component {
  state = {
    content: '',
    imgUrl: '',
  };
  componentDidMount() {
    this.props.getLecturers();
  }
  // handleChange = ({ fileList }) => this.setState({ fileList });

  handleChange = info => {
    if (info.file.status === 'done') {
      console.log(info.file);
      // Get this url from response in real world.
      this.setState({
        // imgUrl: host_v1 + info.file.response.files[0].url,
        imgUrl: host_v1 + info.file.response,
      });
    }
  };
  handleChange2 = info => {
    if (info.file.status === 'done') {
      console.log(info.file);
      // Get this url from response in real world.
      this.setState({
        // content: host_v1 + info.file.response.files[0].url,
        content: host_v1 + info.file.response,
      });
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    const { imgUrl, content } = this.state;
    this.props.form.validateFields((err, values) => {
      // console.log(values);
      if (!err) {
        this.props.postTrainingCourse({ values, imgUrl, content });
      }
    });
  };
  goBack = () => {
    this.props.goBack();
  };
  render() {
    let { lecturers } = this.props.recommendtrainings;
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
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <PageHeaderWrapper title={<FormattedMessage id="app.forms.lesson.add.title" />}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="课程名称">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'please input course title',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            {/* <FormItem {...formItemLayout} label="课程封面">
              {getFieldDecorator('cover_img', {
                getValueFromEvent: this.normFile,
                rules: [
                  {
                    required: true,
                    message: 'please select a image',
                  },
                ],
              })(
                <Upload
                  name="file"
                  action={UploadURL}
                  listType="picture-card"
                  accept="image/*"
                  onChange={this.handleChange}
                >
                  {this.state.imgUrl ? null : uploadButton}
                </Upload>
              )}
            </FormItem> */}
            <Form.Item {...formItemLayout} label="课程封面">
              {getFieldDecorator('cover_img', {
                // valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
                rules: [{ required: true }],
              })(
                <Upload
                  name="file"
                  listType="picture-card"
                  showUploadList={false}
                  action={UploadURL}
                  onChange={this.handleChange}
                >
                  {this.state.imgUrl ? (
                    <img src={this.state.imgUrl} alt="" height="80px" />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              )}
            </Form.Item>
            <FormItem {...formItemLayout} label="讲师" hasFeedback>
              {getFieldDecorator('lecturer', {
                rules: [{ required: true, message: 'Please select a lecturer!' }],
              })(
                <Select placeholder="选择讲师">
                  {lecturers.map(itm => (
                    <Option key="itm.id" value={itm.name}>
                      {itm.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="视频课程">
              {getFieldDecorator('content', {
                getValueFromEvent: this.normFile,
                rules: [
                  {
                    required: true,
                    message: 'please select a video',
                  },
                ],
              })(
                <Upload
                  name="file"
                  action={UploadURL}
                  // action='//jsonplaceholder.typicode.com/posts/'
                  listType="picture"
                  accept="video/*"
                  onChange={this.handleChange2}
                >
                  {this.state.video ? null : (
                    <Button>
                      <Icon type="upload" /> 上传视频
                    </Button>
                  )}
                </Upload>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="课程描述">
              {getFieldDecorator('desc', {
                rules: [
                  {
                    required: true,
                    message: 'please input course describe',
                  },
                ],
              })(<TextArea rows={4} placeholder="请输入" />)}
            </FormItem>
            <FormItem wrapperCol={{ span: 12, offset: 10 }}>
              <Button type="primary" ghost htmlType="submit" style={{ marginRight: '8px' }}>
                提交
              </Button>
              <Button type="primary" ghost onClick={this.goBack}>
                取消
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const WrappedRTrainingAdd = Form.create()(TrainingAdd);
export default WrappedRTrainingAdd;
