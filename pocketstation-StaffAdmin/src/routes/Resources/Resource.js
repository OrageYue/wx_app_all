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
  Table,
  message,
} from 'antd';

// import styles from './Class.less';
import { host, host_v1, UploadURL } from '../../constants';
import { Editor } from 'react-draft-wysiwyg';
// import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw } from 'draft-js';
// import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const RESOURCE = 'resources';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Consumer, Provider } = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <Provider value={form}>
    <tr {...props} />
  </Provider>
);
const EditableFormRow = Form.create()(EditableRow);

@Form.create()
@connect(
  ({ resources: resources, loading }) => ({
    resources,
    loading: loading.effects[`${RESOURCE}/query`],
  }),
  dispatch => ({
    postResource(values) {
      dispatch({ type: `${RESOURCE}/postResource`, payload: values });
    },
    deleLists(deleOne, callback) {
      dispatch({
        type: `${RESOURCE}/deleLists`,
        payload: { key: deleOne },
        callback,
      });
    },
    getHierarchy() {
      dispatch({ type: `${RESOURCE}/queryHier` });
    },
    editList(row, key) {
      let params = { row, key };
      dispatch({ type: `${RESOURCE}/editResource`, payload: params });
    },
    search(params) {
      return dispatch({ type: `${RESOURCE}/search`, payload: params });
    },
  })
)
class Resource extends Component {
  state = {
    editingKey: '',
    visible: false,
    res_uri: '',
    value: '',
    // editorState: undefined,
    editorState: EditorState.createEmpty(),
  };

  componentDidMount() {
    this.props.getHierarchy();
  }

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '资源id',
        dataIndex: 'id',
        editable: false,
      },
      {
        title: '资源名称',
        dataIndex: 'name',
        editable: true,
      },
      {
        title: '资源类型',
        dataIndex: 'type',
        editable: true,
      },
      {
        title: '资源层级',
        dataIndex: 'hier',
        editable: true,
        render: (text, record) => <span>{record.hier.name}</span>,
      },
      // {
      //   title: '资源内容',
      //   dataIndex: 'content',
      //   width: '15%',
      //   editable: true,
      // },
      {
        title: '资源内容',
        dataIndex: 'content',
        editable: true,
        render: (txt, row) => (
          <a target="_blank" href={host_v1 + row.content}>
            在线链接
          </a>
        ),
      },
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
                        onClick={() => this.save(form, record.key)}
                        style={{ marginRight: 8 }}
                        size="small"
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
                    style={{ marginRight: '8px' }}
                    size="small"
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
  }

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
      // let { content, hier, ...others } = row;
      // console.log(row);
      if (Array.isArray(row.content)) {
        // row.content = row.content[row.content.length - 1].response.files[0].url;
        row.content = row.content[row.content.length - 1].response;
      }
      if (Array.isArray(row.hier)) {
        row.hier = row.hier[row.hier.length - 1];
      }
      const params = row;
      this.props.editList(params, key);
    });
    this.setState({ editingKey: '' });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleChange = info => {
    if (info.file.status === 'done') {
      console.log(info.file);
      // Get this url from response in real world.
      this.setState({
        // res_uri: host_v1 + info.file.response.files[0].url,
        res_uri: host_v1 + info.file.response,
      });
    }
  };
  handleOk = e => {
    const { form } = this.props;
    const { hier: hiers, list } = this.props.resources;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue);
      let { hier, name, type, res_uri } = fieldsValue;

      let h = false;
      hiers.forEach(hs => {
        if (hs.name === name) {
          h = true;
        }
      });
      list.forEach(rs => {
        if (rs.name === name) {
          h = true;
        }
      });
      if (h) {
        message.info('资源层级名称已存在', 2);
      } else {
        if (res_uri) {
          console.log(res_uri);

          let content =
            // res_uri.file.response.files[0].url || res_uri.file.response.files[0].thumbnailUrl;
            res_uri.file.response;
          // let content = res_uri.file.name;
          const params = { hier, name, type, content };
          this.props.postResource(params);
          this.setState({
            visible: false,
          });
        } else if (fieldsValue.content) {
          message.info('暂时不支持');
        } else {
          // else if (fieldsValue.type === 'richtext') {
          //   fieldsValue.content = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
          //   // console.log( fieldsValue )
          //   this.props.postResource(fieldsValue);
          //   this.setState({
          //     visible: false,
          //   });
          // }
          const params = { hier, name, type, content: '' };
          this.props.postResource(params);
        }
      }
      this.setState({
        visible: false,
      });
      // const content = res_uri.file.name;
    });
    form.resetFields();
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  onEditorStateChange = editorState => {
    this.setState({
      editorState,
    });
  };
  handleSearch = () => {
    this.props.search({ name: this.state.value });
  };
  resChange = value => {
    this.setState({
      value,
    });
  };

  render() {
    let { list, hier, loading } = this.props.resources;
    list.map(rs => (rs.key = rs.id));
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    hier.map(hr => (hr.key = hr.id));

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    const { form } = this.props;
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
    let typeGroup = ['folder', 'pdf', 'image', 'video', 'richtext', 'other'];
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Button
            icon="plus"
            type="primary"
            style={{ marginBottom: '20px' }}
            onClick={() => this.showModal()}
          >
            添加
          </Button>
          <div style={{ float: 'right' }}>
            资源查询：<Select
              showArrow={false}
              style={{ width: 160, marginRight: '8px' }}
              showSearch
              onChange={this.resChange}
            >
              {list.map(res => (
                <Select.Option key={res.id} value={res.name}>
                  <span>{res.name}</span>
                </Select.Option>
              ))}
            </Select>
            <Button type="primary" ghost size="default" onClick={this.handleSearch}>
              查询
            </Button>
          </div>
          <Table
            components={components}
            bordered
            dataSource={list}
            columns={columns}
            rowClassName="editable-row"
            loading={loading}
            // scroll={{ x: 1300 }}
          />

          <Modal
            title="添加资源"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width="80%"
          >
            <Form>
              <FormItem {...formItemLayout} label="资源名称">
                {form.getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input resource name',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="资源类型">
                {form.getFieldDecorator('type', {
                  rules: [{ required: true, message: 'Please select resource type' }],
                })(
                  <RadioGroup>
                    {typeGroup.map((itm, inx) => (
                      <Radio key={inx} value={itm}>
                        {itm}
                      </Radio>
                    ))}
                  </RadioGroup>
                )}
              </FormItem>
              {form.getFieldValue('type') === 'richtext' ? (
                <FormItem {...formItemLayout} label="资源内容">
                  {form.getFieldDecorator('content', {
                    getValueFromEvent: this.normFile,
                    rules: [{ required: true, message: 'please input content' }],
                  })(
                    <Editor
                      wrapperClassName="demo-wrapper"
                      editorClassName="demo-editor"
                      toolbarClassName="demo-toolbar-absolute"
                      wrapperStyle={{ border: '1px solid #ccc', minHeight: '300px' }}
                      onEditorStateChange={this.onEditorStateChange}
                    />
                  )}
                  {/* <textarea
                    disabled
                    value={draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))}
                  /> */}
                </FormItem>
              ) : (
                <div>
                  {form.getFieldValue('type') === 'folder' ? null : (
                    <FormItem {...formItemLayout} label="上传资源">
                      {form.getFieldDecorator('res_uri', {
                        getValueFromEvent: this.normFile,
                        rules: [
                          {
                            required: true,
                            message: 'please select a resources',
                          },
                        ],
                      })(
                        <Upload
                          name="file"
                          action={UploadURL}
                          listType="picture"
                          // accept="video/*"
                          onChange={this.handleImgChange}
                        >
                          {this.state.res_uri ? null : (
                            <Button>
                              <Icon type="upload" /> 上传资源
                            </Button>
                          )}
                        </Upload>
                      )}
                    </FormItem>
                  )}
                </div>
              )}
              <FormItem {...formItemLayout} label="资源层级">
                {form.getFieldDecorator('hier', {
                  defaultValue: '根目录',
                  initialValue: 1,
                })(
                  <Select
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {hier.map(hr => (
                      <Select.Option key={hr.id} value={hr.id}>
                        {hr.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Form>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}

@connect(
  ({ resources }) => ({
    resources,
  }),
  dispatch => ({})
)
class EditableCell extends React.Component {
  state = {
    imgLoading: false,
    resUrl: '',
  };
  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  handleImgChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ imgLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({
        // resUrl: host_v1 + info.file.response.files[0].thumbnailUrl,
        resUrl: host_v1 + info.file.response,
        // imageUrl: info.file.name,
        imgLoading: false,
      });
    }
  };

  getInput = (form, dataIndex, record) => {
    const { hier } = this.props.resources;
    // console.log( hier )
    if (dataIndex === 'content') {
      return form.getFieldDecorator(dataIndex, {
        // valuePropName: 'fileList',
        getValueFromEvent: this.normFile,
        initialValue: record.content,
      })(
        <Upload
          name="file"
          listType="picture-card"
          showUploadList={false}
          action={UploadURL}
          onChange={this.handleImgChange}
        >
          {this.state.resUrl ? (
            <img src={this.state.resUrl} alt="" width="60" />
          ) : (
            <div>
              <Icon type={this.state.imgLoading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
          )}
        </Upload>
      );
    } else if (dataIndex === 'hier') {
      return form.getFieldDecorator(dataIndex, {
        initialValue: record.hier.id,
      })(
        <Select
          style={{ width: 120 }}
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {hier.map(hr => (
            <Select.Option key={hr.id} value={hr.id}>
              {hr.name}
            </Select.Option>
          ))}
        </Select>
      );
    } else if (dataIndex === 'type') {
      return form.getFieldDecorator(dataIndex, {
        initialValue: record[dataIndex],
      })(
        <Select
          style={{ width: 120 }}
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {['pdf', 'image', 'video', 'other'].map((tp, inx) => (
            <Select.Option key={inx} value={tp}>
              {tp}
            </Select.Option>
          ))}
        </Select>
      );
    } else {
      return form.getFieldDecorator(dataIndex, {
        rules: [{ required: true, message: 'Please input' }],
        initialValue: record[dataIndex],
      })(<Input />);
    }
  };

  render() {
    const { editing, dataIndex, title, inputType, record, index, ...restProps } = this.props;
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

export default Resource;
