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

import styles from './Tool.less';
import { host, host_v1, UploadURL } from '../../constants';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

const RESOURCE = 'tool';

@connect(
  ({ tool: { tools }, lesson_class: { lesson_classes }, loading }) => ({
    tools,
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
    search(params) {
      return dispatch({ type: `${RESOURCE}/search`, payload: params });
    },
    edit(params) {
      dispatch({ type: `${RESOURCE}/edit`, payload: params });
    },
  })
)
@Form.create()
export default class LessonClass extends Component {
  state = {
    selectedRows: [],
    modalNewVisible: false,
    tool_id: '',
    editingKey: '',
  };

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '分类',
        dataIndex: 'cls',
        render: (txt, row) => row.cls.name,
      },
      // {
      //   title: '术式',
      //   dataIndex: 'oprt',
      //   render: (txt, row) => row.lsn.oprt.name,
      // },
      // {
      //   title: '课程',
      //   dataIndex: 'lsn',
      //   editable: true,
      //   render: (txt, row) => row.lsn.name,
      // },
      {
        title: '名称',
        editable: true,
        dataIndex: 'tool',
        render: (txt, row) => row.name,
      },
      {
        title: '类型',
        render: (txt, row) => row.type,
      },
      {
        title: '预览',
        render: (txt, row) => (
          <a target="_blank" href={host_v1 + row.content}>
            在线链接
          </a>
        ),
      },
      {
        title: '操作',
        // render: (txt, row, idx) => (
        //   <Fragment>
        //     <Popconfirm
        //       title="确认删除该工具？"
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
      console.log(fieldsValue);
      (fieldsValue.content =
        // fieldsValue.content[fieldsValue.content.length - 1].response.files[0].url),
        fieldsValue.content[fieldsValue.content.length - 1].response),
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

  handleSearch = () => {
    const { tool_id } = this.state;
    this.props.search({ tool_id });
  };

  handleChange = value => {
    this.setState({
      tool_id: value,
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
      console.log(row);
      const { lsn, tool } = row;
      this.props.edit({ lsn_id: lsn, tool_name: tool, tool_id: key * 1 });
      // CALL PATCH SERVICE !!
      this.setState({ editingKey: '' });
    });
  }

  render() {
    const { selectedRows } = this.state;

    const { loading, form, adding, removing, lesson_classes } = this.props;
    const { modalNewVisible } = this.state;
    let { tools: tableData } = this.props;
    tableData = tableData.map(ta => ({ ...ta, key: ta.id }));

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
          name: col.title === '部门名称' ? 'name' : null,
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

    return (
      <PageHeaderLayout title="工具管理">
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
                    title="确认删除所选工具？"
                    okText="删除"
                    cancelText="取消"
                    onConfirm={this.handleDeleteList}
                  >
                    <Button loading={removing}>批量删除</Button>
                  </Popconfirm>
                </span>
              )}
              <div style={{ float: 'right' }}>
                工具：<Select
                  showArrow={false}
                  style={{ width: 160, marginRight: '8px' }}
                  showSearch
                  onChange={this.handleChange}
                >
                  {tableData.map(tool => (
                    <Select.Option key={tool.id} value={tool.id}>
                      <span>{tool.name}</span>
                    </Select.Option>
                  ))}
                </Select>
                <Button type="primary" ghost size="small" onClick={this.handleSearch}>
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
              dataSource={tableData}
              columns={columns}
              components={components}
              onChange={e => console.log(e)}
            />
          </div>
          <Modal
            visible={modalNewVisible}
            title="添加工具"
            onOk={() => this.handleNewBU_OK()}
            onCancel={() => this.handleNewModelVisible()}
            confirmLoading={adding}
          >
            <Form.Item {...formItemLayout} label="课程分类">
              {form.getFieldDecorator('lsncls_id', {
                rules: [{ required: true, message: 'Please select class...' }],
              })(
                <Select
                  style={{ minWidth: 160 }}
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {lesson_classes.map(cls => (
                    <Select.Option key={cls.id} value={cls.id}>
                      {`${cls.name}`}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="名称">
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input Lesson Class name...' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="类型">
              {form.getFieldDecorator('type', {
                rules: [{ required: true, message: 'Please choose a video' }],
              })(
                <Radio.Group>
                  <Radio.Button value="pdf">PDF</Radio.Button>
                  <Radio.Button value="video">视频</Radio.Button>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="工具"
              // extra="仅选择最后上传的一份工具"
            >
              {form.getFieldDecorator('content', {
                valuePropName: 'fileList',
                rules: [{ required: true, message: 'Please choose a video' }],
                getValueFromEvent: e => (Array.isArray(e) ? e : e && [e.fileList[0]]),
              })(
                <Upload name="file" action={UploadURL} listType="picture">
                  <Button>
                    <Icon type="upload" />上传
                  </Button>
                </Upload>
              )}
            </Form.Item>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}

@connect(
  ({ lesson_class: { lesson_classes } }) => ({
    lesson_classes,
  }),
  dispatch => ({})
)
class EditableCell extends React.Component {
  getInput = (form, name, dataIndex, record) => {
    console.log(this.props.lesson_classes);
    if (this.props.title === '分类') {
      // console.log( record[dataIndex].oprt.id )
      return form.getFieldDecorator(dataIndex, {
        initialValue: record[dataIndex].id,
      })(
        <Select
          style={{ minWidth: 160 }}
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {this.props.lesson_classes.map(cls => (
            <Select.Option key={cls.id} value={cls.id}>
              {`${cls.name}`}
            </Select.Option>
          ))}
        </Select>
      );
    } else {
      return form.getFieldDecorator(dataIndex, {
        getValueFromEvent: this.normFile,
        initialValue: record.name,
      })(<Input />);
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
