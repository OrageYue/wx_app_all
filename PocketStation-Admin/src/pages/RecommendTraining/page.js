import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Input, Upload, Popconfirm, Form, Button, Card, Icon, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ExpandedGains from './ExpandedGains';
import { host_v1, UploadURL } from '../../constants';

const FormItem = Form.Item;
const { Consumer, Provider } = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <Provider value={form}>
    <tr {...props} />
  </Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
  state = {
    cover_img: '',
    content: '',
  };
  handleChange = info => {
    if (info.file.status === 'done') {
      this.setState({
        // cover_img: host_v1 + info.file.response.files[0].thumbnailUrl,
        cover_img: host_v1 + info.file.response,
      });
    }
  };
  handleChange2 = info => {
    console.log(info);
    if (info.file.status === 'done') {
      this.setState({
        // content: host_v1 + info.file.response.files[0].url,
        content: host_v1 + info.file.response,
      });
    }
  };
  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  getInput = (form, dataIndex, record) => {
    if (dataIndex === 'cover_img') {
      return form.getFieldDecorator(dataIndex, {
        getValueFromEvent: this.normFile,
        initialValue: record[dataIndex],
      })(
        <Upload
          name="file"
          listType="picture-card"
          showUploadList={false}
          action={UploadURL}
          onChange={this.handleChange}
        >
          {this.state.cover_img ? (
            <img src={this.state.cover_img} alt="" height="80px" />
          ) : (
            <Icon type={this.state.imgLoading ? 'loading' : 'plus'} />
          )}
        </Upload>
      );
    } else if (dataIndex === 'content') {
      return form.getFieldDecorator(dataIndex, {
        getValueFromEvent: this.normFile,
        initialValue: record[dataIndex],
      })(
        <Upload
          name="file"
          action={UploadURL}
          // action='//jsonplaceholder.typicode.com/posts/'
          listType="picture"
          accept="video/*"
          onChange={this.handleChange2}
        >
          {this.state.content ? null : (
            <Button>
              <Icon type="upload" /> 上传视频
            </Button>
          )}
        </Upload>
      );
    } else {
      return form.getFieldDecorator(dataIndex, {
        initialValue: record[dataIndex],
      })(<Input />);
    }
  };
  render() {
    const { editing, dataIndex, title, inputType, record, name, index, ...restProps } = this.props;
    return (
      <Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem>{this.getInput(form, dataIndex, record)}</FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </Consumer>
    );
  }
}

@connect(
  ({ recommendtrainings }) => ({
    recommendtrainings,
  }),
  dispatch => ({
    deleLists(deleOne, callback) {
      dispatch({
        type: 'recommendtrainings/deleLists',
        payload: { key: deleOne },
        callback,
      });
    },
    getTrainings() {
      dispatch({ type: 'recommendtrainings/getTrainings' });
    },
    editList(row, key) {
      dispatch({ type: 'recommendtrainings/editList', payload: { row, course_id: key } });
    },
    goTrainingAdd() {
      dispatch(routerRedux.push('/dealer/recommendtrainings/lesson/add'));
    },
    getGains(course_id) {
      dispatch({ type: 'recommendtrainings/getGains', payload: course_id });
    },
  })
)
class RecommendTraining extends Component {
  state = {
    editingKey: '',
  };
  componentDidMount() {
    this.props.getTrainings();
  }
  columns = [
    {
      title: '课程id',
      dataIndex: 'id',
      width: '6%',
      editable: false,
    },
    {
      title: '课程名称',
      dataIndex: 'title',
      width: '14%',
      editable: true,
    },
    {
      title: '课程图片',
      dataIndex: 'cover_img',
      width: '12%',
      editable: true,
      render: img => <img src={img} alt="img" style={{ width: '40px' }} />,
    },
    {
      title: '讲师',
      dataIndex: 'lecturer',
      width: '10%',
      editable: false,
    },
    {
      title: '课程介绍',
      dataIndex: 'desc',
      width: '20%',
      editable: true,
    },
    {
      title: '课程内容',
      dataIndex: 'content',
      width: '12%',
      editable: true,
      render: content => <span>{content}</span>,
    },
    // {
    //   title: '观看次数',
    //   dataIndex: 'views',
    //   width: '10%',
    //   editable: false,
    // },
    {
      title: '操作',
      render: (text, record) => {
        const editable = this.isEditing(record);
        return (
          <div>
            {editable ? (
              <span>
                <Consumer>
                  {form => (
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => this.save(form, record.key)}
                      style={{ marginRight: 8 }}
                    >
                      保存
                    </Button>
                  )}
                </Consumer>
                <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                  <Button size="small">取消</Button>
                </Popconfirm>
              </span>
            ) : (
              <div>
                <Button
                  onClick={() => this.edit(record.key)}
                  size="small"
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
            )}
          </div>
        );
      },
    },
  ];
  deleteList = key => {
    let deleOne = [];
    deleOne.push(key);
    const callback = () => {
      this.setState({
        selectedRows: [],
      });
    };
    this.props.deleLists(deleOne, callback);
  };
  isEditing = record => {
    return record.key === this.state.editingKey;
  };
  edit(key) {
    this.setState({ editingKey: key });
  }
  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      if (Array.isArray(row.cover_img)) {
        row.cover_img =
          // host_v1 + row.cover_img[row.cover_img.length - 1].response.files[0].thumbnailUrl ||
          // host_v1 + row.cover_img[row.cover_img.length - 1].response.files[0].url;
          host_v1 + row.cover_img[row.cover_img.length - 1].response;
      }

      if (Array.isArray(row.content)) {
        // row.content = host_v1 + row.content[row.content.length - 1].response.files[0].url;
        row.content = host_v1 + row.content[row.content.length - 1].response;
      }

      // row.cover_img = host_v1 + row.cover_img;
      // row.content = host_v1 + row.content;
      // row.content = host_v1 + row.content.file.response.files[0].url || host_v1 + row.content.file.thumbUrl;
      // console.log( row )
      this.props.editList(row, key);
    });
    this.setState({ editingKey: '' });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  addLesson = () => {
    this.props.goTrainingAdd();
  };
  getGains = course_id => {
    this.props.getGains(course_id);
  };
  render() {
    let { lessons } = this.props.recommendtrainings;
    lessons.map(itm => (itm.key = itm.id));
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          // inputType: col.dataIndex === 'cover_img' ? 'cover_img' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Button
            icon="plus"
            type="primary"
            style={{ marginBottom: '20px' }}
            onClick={() => this.addLesson()}
          >
            添加
          </Button>
          <Table
            components={components}
            bordered
            dataSource={lessons}
            columns={columns}
            rowClassName="editable-row"
            // pagination={{ defaultCurrent: 1, total: 20 }}
            scroll={{ x: 1400 }}
            expandedRowRender={record => <ExpandedGains course_id={record.id} />}
            onExpand={(expanded, record) => this.getGains(record.id)}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default RecommendTraining;
