import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
// import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import StandartTable from '../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

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
} from 'antd';

import styles from './News.less';
import { host, host_v1, UploadURL } from '../../constants';

const RESOURCE = 'news';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

@connect(
  ({ news_class: { news_classes } }) => ({
    news_classes,
  }),
  () => ({})
)
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
        // imageUrl: host + info.file.response.files[0].thumbnailUrl,
        imageUrl: host_v1 + info.file.response,
        imgLoading: false,
      });
    }
  };

  getInput = (form, name, dataIndex, record) => {
    const { news_classes } = this.props;
    if (dataIndex === 'img_src') {
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
            <img src={this.state.imageUrl} alt="" width="60" />
          ) : (
            <div>
              <Icon type={this.state.imgLoading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
          )}
        </Upload>
      );
    } else if (this.props.title === '分类') {
      return form.getFieldDecorator(dataIndex, {
        initialValue: record.cls.id,
      })(
        <Select
          style={{ width: 120 }}
          // showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {news_classes.map(ns => (
            <Select.Option key={ns.id} value={ns.id}>
              {ns.name}
            </Select.Option>
          ))}
        </Select>
      );
    } else {
      return form.getFieldDecorator(dataIndex, {
        initialValue: record[dataIndex],
      })(<Input />);
    }
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      name,
      inputType,
      record,
      index,
      staffs,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          // const { getFieldDecorator } = form;
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
  ({ news_class: { news_classes }, news: { news }, loading }) => ({
    news_classes,
    news,
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
    search(params) {
      return dispatch({ type: `${RESOURCE}/search`, payload: params });
    },
    news_cls_search(params) {
      return dispatch({ type: `${RESOURCE}/news_cls_search`, payload: params });
    },
  })
)
@Form.create()
class News extends Component {
  state = {
    selectedRows: [],
    modalNewVisible: false,
    imgLoading: false,
    imageUrl: '',
    editingKey: '',
    value: '',
    cls_id: '',
  };

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '新闻ID',
        dataIndex: 'id',
      },
      {
        title: '分类',
        dataIndex: 'cls_id',
        editable: true,
        render: (txt, row) => row.cls.name,
      },
      {
        title: '封面图片',
        dataIndex: 'img_src',
        editable: true,
        render: (txt, row) => (
          <img src={host_v1 + row.img_src} alg={host_v1 + row.img_src} width={36} height={36} />
        ),
      },
      {
        title: '题目',
        dataIndex: 'name',
        editable: true,
      },
      {
        title: '简介',
        dataIndex: 'brief',
        editable: true,
      },
      // {
      //   title: '类型',
      //   dataIndex: 'type_',
      // },
      {
        title: '操作',
        // render: (txt, row, idx) => (
        //   <Fragment>
        //     <Button disabled={true} size="small">
        //       编辑
        //     </Button>
        //     <Divider type="vertical" />
        //     <Popconfirm
        //       title="将删除该资讯及其任何相关信息"
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
                  <Button
                    onClick={() => this.edit(record.id)}
                    size="small"
                    style={{ margin: '8px 0' }}
                  >
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
      fieldsValue.content = JSON.stringify(
        // fieldsValue.content.map(({ response: { files } }) => files[0].url)
        fieldsValue.content.map(({ response }) => response)
      );
      fieldsValue.img_src =
        // fieldsValue.img_src[fieldsValue.img_src.length - 1].response.files[0].url;
        fieldsValue.img_src[fieldsValue.img_src.length - 1].response;

      // fieldsValue.content = fieldsValue.content[0].name;
      // fieldsValue.img_src =fieldsValue.img_src[0].name;

      console.log(fieldsValue);
      add(fieldsValue).then(() => {
        this.handleNewModelVisible();
        form.resetFields();
      });
    });
  };

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
      console.log(row);
      if (row.img_src !== undefined) {
        this.props.edit({ id: key, data: row });
      }
      // CALL PATCH SERVICE !!
      this.setState({ editingKey: '' });
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };

  handleSearch = () => {
    this.props.search({ name: this.state.value });
  };

  handleChange = value => {
    this.setState({
      value,
    });
  };

  handleClsSearch = () => {
    this.props.news_cls_search({ cls_id: this.state.cls_id });
  };

  handleClsChange = cls_id => {
    this.setState({
      cls_id,
    });
  };

  render() {
    const { selectedRows } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    const { loading, form, adding, removing, news: tableData, news_classes } = this.props;
    const { modalNewVisible } = this.state;
    const typeList = [
      { name: '贴近客户', type: 'toCustome' },
      { name: '贴近员工', type: 'toStaff' },
      { name: '系统合作', type: 'doSystem' },
      { name: '开拓创新', type: 'Innovate' },
    ];

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        md: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 15 },
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
          name: col.title === '封面图片' ? 'img_src' : null,
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
      <PageHeaderWrapper title="资讯管理">
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
                    title="将删除该资讯及其任何相关信息"
                    okText="删除"
                    cancelText="取消"
                    onConfirm={this.handleDeleteList}
                  >
                    <Button loading={removing}>批量删除</Button>
                  </Popconfirm>
                </span>
              )}
              <div style={{ float: 'right' }}>
                分类查询：
                <Select
                  showArrow={false}
                  style={{ width: 160, marginRight: '8px' }}
                  showSearch
                  onChange={this.handleClsChange}
                >
                  {news_classes.map(news_cls => (
                    <Select.Option key={news_cls.id} value={news_cls.id}>
                      <span>{news_cls.name}</span>
                    </Select.Option>
                  ))}
                </Select>
                <Button type="primary" ghost size="default" onClick={this.handleClsSearch}>
                  查询
                </Button>
                新闻查询：
                <Select
                  showArrow={false}
                  style={{ width: 160, marginRight: '8px' }}
                  showSearch
                  onChange={this.handleChange}
                >
                  {tableData.map(news => (
                    <Select.Option key={news.id} value={news.name} placeholder="请填写新闻题目">
                      <span>{news.name}</span>
                    </Select.Option>
                  ))}
                </Select>
                <Button type="primary" ghost size="default" onClick={this.handleSearch}>
                  查询
                </Button>
              </div>
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
              // selectedRows={selectedRows}
              // onSelectRow={this.handleSelectRow}
              // loading={loading}
              dataSource={tableData}
              columns={columns}
              components={components}
              onChange={e => console.log(e)}
            />
          </div>
          <Modal
            visible={modalNewVisible}
            title="添加资讯"
            onOk={() => this.handleNewBU_OK()}
            onCancel={() => this.handleNewModelVisible()}
            confirmLoading={adding}
            width={650}
          >
            <Form.Item {...formItemLayout} label="名称">
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input Name...' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="分类">
              {form.getFieldDecorator('cls_id', {
                rules: [{ required: true, message: 'Please select News Class...' }],
              })(
                <Select style={{ width: 160 }}>
                  {news_classes.map(cls => (
                    <Select.Option key={cls.id} value={cls.id}>
                      {cls.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item {...formItemLayout} label="封面图片">
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
            {/* <Form.Item {...formItemLayout} label="类型">
              {form.getFieldDecorator('type_', {
                rules: [{ required: true, message: 'Please select News Class...' }],
              })(
                <Select style={{ width: 160 }}>
                  {typeList.map(ty => (
                    <Select.Option key={ty.type} value={ty.type}>
                      {ty.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item> */}
            <Form.Item {...formItemLayout} label="简介">
              {form.getFieldDecorator('brief', {
                rules: [{ required: true, message: 'Please select operation...' }],
              })(<Input.TextArea />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="图文" extra="按顺序上传">
              {form.getFieldDecorator('content', {
                valuePropName: 'fileList',
                rules: [{ required: true, message: 'Please choose some images' }],
                getValueFromEvent: e => (Array.isArray(e) ? e : e && e.fileList),
              })(
                <Upload name="file" action={UploadURL} listType="picture" multiple={true}>
                  <Button>
                    <Icon type="upload" />
                    上传
                  </Button>
                </Upload>
              )}
            </Form.Item>
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default News;
