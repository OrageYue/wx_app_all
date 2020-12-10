import { Component, Fragment } from 'react';
import { connect } from 'dva';
// import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

// import StandartTable from '../../components/StandardTable';
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

import styles from './Class.less';
import { host, host_v1, UploadURL } from '../../constants';

const RESOURCE = 'news_class';

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
        imageUrl: host_v1 + info.file.response,
        imgLoading: false,
      });
    }
  };
  getInput = (form, name, dataIndex, record) => {
    if (this.props.title === '分类名称') {
      return form.getFieldDecorator(dataIndex, {
        initialValue: record[dataIndex],
      })(<Input />);
    } else {
      return form.getFieldDecorator(dataIndex, {
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
            <img src={this.state.imageUrl} alt="" width="60" />
          ) : (
            <div>
              <Icon type={this.state.imgLoading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
          )}
        </Upload>
      );
    }
  };

  render() {
    const { editing, dataIndex, title, name, inputType, record, index, ...restProps } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem>{this.getInput(form, name, dataIndex, record)}</FormItem>
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

@connect(
  ({ news_class: { news_classes }, loading }) => ({
    news_classes,
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
    edit(params) {
      return dispatch({ type: `${RESOURCE}/edit`, payload: params });
    },
  })
)
@Form.create()
class NewsClass extends Component {
  state = {
    selectedRows: [],
    modalNewVisible: false,
    editingKey: '',
    imageUrl: '',
  };

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '分类ID',
        dataIndex: 'id',
      },
      {
        title: '分类名称',
        dataIndex: 'name',
        editable: true,
      },
      {
        title: '分类封面',
        dataIndex: 'img_src',
        editable: true,
        render: (txt, row) => (
          <img src={host_v1 + row.img_src} alg={host_v1 + row.img_src} width={36} height={36} />
        ),
      },
      {
        title: '操作',
        // render: (txt, row, idx) => (
        //   <Fragment>
        //     <Button disabled={true} size="small">
        //       编辑
        //     </Button>
        //     <Divider type="vertical" />
        //     <Popconfirm
        //       title="将删除该分类及其任何相关信息"
        //       okText="删除"
        //       cancelText="取消"
        //       onConfirm={() => this.handleDeleteOne(row)}
        //     >
        //       <Button type="danger" size="small">
        //         删除
        //       </Button>
        //     </Popconfirm>
        //   </Fragment>
        // ),
        render: (txt, record, idx) => {
          const editable = this.isEditing(record);
          return (
            <div className="editable-row-operations">
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <Button
                        size="small"
                        onClick={() => this.save(form, record.id)}
                        type="primary"
                      >
                        保存
                      </Button>
                    )}
                  </EditableContext.Consumer>
                  <Divider type="vertical" />
                  <Button size="small" onClick={() => this.cancel(record.id)}>
                    取消
                  </Button>
                </span>
              ) : (
                <span>
                  <Button onClick={() => this.edit(record.id)} size="small">
                    编辑
                  </Button>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="将删除该人员及其任何相关信息"
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
  }

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
      fieldsValue.img_src = fieldsValue.img_src[0].response;
      add(fieldsValue).then(() => {
        this.handleNewModelVisible();
        form.resetFields();
      });
    });
  };

  isEditing = record => {
    return record.id === this.state.editingKey;
  };
  edit(key) {
    this.setState({ editingKey: key });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      if (Array.isArray(row.img_src)) {
        row.img_src = row.img_src[0].response;
      }

      this.props.edit({ ...row, id: key * 1 });
      // CALL PATCH SERVICE !!
      this.setState({ editingKey: '' });
    });
  }

  normFile = e => {
    // console.log('Upload event:', e);
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

  render() {
    const { selectedRows } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    const { loading, form, adding, removing, news_classes: tableData } = this.props;
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

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          name: col.title === '分类名称' ? 'name' : null,
          dataIndex: col.dataIndex,
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
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <PageHeaderWrapper title="资讯分类管理">
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
                    title="将删除该分类及其任何相关信息"
                    okText="删除"
                    cancelText="取消"
                    onConfirm={this.handleDeleteList}
                  >
                    <Button loading={removing}>批量删除</Button>
                  </Popconfirm>
                </span>
              )}
            </div>
            {/* <StandartTable
              rowKey="id"
              selectedRows={selectedRows}
              onSelectRow={this.handleSelectRow}
              loading={loading}
              data={{ list: tableData }}
              columns={columns}
              onChange={e => console.log(e)}
            /> */}
            <Table
              rowKey="id"
              dataSource={tableData}
              columns={columns}
              components={components}
              onChange={e => console.log(e)}
            />
          </div>
          <Modal
            visible={modalNewVisible}
            title="添加分类"
            onOk={() => this.handleNewBU_OK()}
            onCancel={() => this.handleNewModelVisible()}
            confirmLoading={adding}
          >
            <Form.Item {...formItemLayout} label="名称">
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input News Class name...' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="分类图片">
              {form.getFieldDecorator('img_src', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
                rules: [{ required: true, message: 'Please choose a image' }],
              })(
                <Upload
                  name="file"
                  listType="picture-card"
                  showUploadList={false}
                  action={UploadURL}
                  onChange={this.handleImgChange}
                >
                  {this.state.imageUrl ? (
                    <img src={this.state.imageUrl} alt="" width="60" />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              )}
            </Form.Item>
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default NewsClass;
