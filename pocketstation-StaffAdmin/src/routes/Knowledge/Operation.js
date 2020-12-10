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
} from 'antd';

import styles from './Operation.less';
import { host, host_v1, UploadURL } from '../../constants';

const RESOURCE = 'operation';

// reagion START FOR EDITABLE ROW

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    imgLoading: false,
    imageUrl: '',
  };

  normFile = e => {
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
        // imageUrl: host + info.file.response.files[0].thumbnailUrl,
        imageUrl: host_v1 + info.file.response,
        imgLoading: false,
      });
    }
  };

  getInput = (form, name, record) => {
    if (name === 'img_src') {
      return form.getFieldDecorator(name, {
        // valuePropName: 'fileList',
        getValueFromEvent: this.normFile,
        initialValue: record.img_src,
      })(
        <Upload
          name="file"
          listType="picture-card"
          showUploadList={false}
          action={UploadURL}
          onChange={this.handleImgChange}
        >
          {this.state.imageUrl ? (
            <img src={this.state.imageUrl} alt="" width="100" />
          ) : (
            <div>
              <Icon type={this.state.imgLoading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
          )}
        </Upload>
      );
    } else if (this.props.name == 'name') {
      return form.getFieldDecorator(name, {
        rules: [{ required: true, message: 'Please input Lesson Class name...' }],
        initialValue: record.name,
      })(<Input />);
    }
  };

  render() {
    const { editing, name, record, index, ...restProps } = this.props;
    // console.log(name, record);
    return (
      <EditableContext.Consumer>
        {form => {
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem>{this.getInput(form, name, record)}</FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

// reagion END FOR EDITABLE ROW

@connect(
  ({ operation: { operations }, lesson_class: { lesson_classes }, loading }) => ({
    operations,
    lesson_classes,
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
    update(params) {
      return dispatch({ type: `${RESOURCE}/patch`, payload: params });
    },
  })
)
@Form.create()
export default class LessonClass extends Component {
  state = {
    selectedRows: [],
    modalNewVisible: false,
    imgLoading: false,
    imageUrl: '',
    editingKey: '',
  };
  columns = [
    {
      title: '术式ID',
      dataIndex: 'id',
    },
    {
      title: '术式名称',
      dataIndex: 'name',
      editable: true,
    },
    {
      title: '所属分类',
      render: (txt, row) => row.cls.name,
    },
    {
      title: '封面图片',
      render: (txt, row) => (
        // <img src={host + row.img_src} alg={host + row.avatar} width={36} height={36} />
        <img src={host_v1 + row.img_src} alg={host_v1 + row.avatar} width={36} height={36} />
      ),
      editable: true,
    },
    {
      title: '操作',
      render: (txt, record, idx) => {
        const editable = this.isEditing(record);
        return (
          <div className="editable-row-operations">
            {editable ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    <Button size="small" onClick={() => this.save(form, record.id)} type="primary">
                      保存
                    </Button>
                  )}
                </EditableContext.Consumer>
                <Divider type="vertical" />
                {/* <Popconfirm
                  title="确认取消?"
                  onConfirm={() => this.cancel(record.id)}
                > */}
                <Button size="small" onClick={() => this.cancel(record.id)}>
                  取消
                </Button>
                {/* </Popconfirm> */}
              </span>
            ) : (
              <span>
                <Button onClick={() => this.edit(record.id)} size="small">
                  编辑
                </Button>
                <Divider type="vertical" />
                <Popconfirm
                  title="将删除该术式及其任何相关信息"
                  okText="删除"
                  cancelText="取消"
                  onConfirm={() => this.handleDeleteOne(record)}
                >
                  <Button type="danger" size="small">
                    删除
                  </Button>
                </Popconfirm>
              </span>
            )}
          </div>
        );
      },
    },
  ];

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
      (fieldsValue.img_src =
        // fieldsValue.img_src[fieldsValue.img_src.length - 1].response.files[0].url),
        fieldsValue.img_src[fieldsValue.img_src.length - 1].response),
        // (fieldsValue.img_src = fieldsValue.img_src[0].name),
        add(fieldsValue).then(() => {
          this.handleNewModelVisible();
          form.resetFields();
        });
    });
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
      // console.log(info.file);
      // Get this url from response in real world.
      this.setState({
        // imageUrl: host + info.file.response.files[0].thumbnailUrl,
        imageUrl: host_v1 + info.file.response,
        imgLoading: false,
      });
      // getBase64(info.file.originFileObj, imageUrl => this.setState({
      //   imageUrl,
      //   imgLoading: false,
      // }));
    }
  };

  // Reagion EditableRow Start
  isEditing = record => {
    return record.id === this.state.editingKey;
  };
  edit(key) {
    this.setState({ editingKey: key });
  }
  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      if (Array.isArray(row.img_src)) {
        // row.img_src = row.img_src[0].response.files[0].url;
        row.img_src = row.img_src[0].response;
      }
      for (let key of Object.keys(row)) {
        if (row[key] === undefined) {
          delete row[key];
        }
      }

      // console.log(row);
      // CALL PATCH SERVICE !!
      this.props.update({ oper_id: this.state.editingKey, data: row });
      this.setState({ editingKey: '' });
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  // Reagion EditableRow End

  render() {
    // Editable Row Start
    const NameMap = {
      封面图片: 'img_src',
      术式名称: 'name',
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          name: NameMap[col.title],
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    // Editable Row End

    const { selectedRows } = this.state;

    const { loading, form, adding, removing, operations: tableData, lesson_classes } = this.props;
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

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <PageHeaderLayout title="术式管理">
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
                    title="将删除该术式及其任何相关信息"
                    okText="删除"
                    cancelText="取消"
                    onConfirm={this.handleDeleteList}
                  >
                    <Button loading={removing}>批量删除</Button>
                  </Popconfirm>
                </span>
              )}
            </div>
            <Table
              bordered
              rowKey="id"
              selectedRows={selectedRows}
              onSelectRow={this.handleSelectRow}
              loading={loading}
              // data={{ list: tableData }}
              dataSource={tableData}
              components={components}
              columns={columns}
              // onChange={e => console.log(e)}
            />
          </div>
          <Modal
            visible={modalNewVisible}
            title="添加术式"
            onOk={() => this.handleNewBU_OK()}
            onCancel={() => this.handleNewModelVisible()}
            confirmLoading={adding}
          >
            <Form.Item {...formItemLayout} label="分类">
              {form.getFieldDecorator('cls_id', {
                rules: [{ required: true, message: 'Please select class...' }],
              })(
                <Select
                  style={{ width: 120 }}
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {lesson_classes.map(cls => (
                    <Select.Option key={cls.id} value={cls.id}>
                      {cls.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="名称">
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input operation name...' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>

            <Form.Item {...formItemLayout} label="封面图片">
              {form.getFieldDecorator('img_src', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
                rules: [{ required: true, message: 'Please upload image...' }],
              })(
                <Upload
                  name="file"
                  listType="picture-card"
                  // className="avatar-uploader"
                  showUploadList={false}
                  action={UploadURL}
                  // beforeUpload={beforeUpload}
                  onChange={this.handleImgChange}
                >
                  {this.state.imageUrl ? (
                    <img src={this.state.imageUrl} alt="" width="80" />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              )}
            </Form.Item>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
