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
  Table,
} from 'antd';

import styles from './Position.less';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

@connect(
  ({ businessunit: { businessunits } }) => ({
    businessunits,
  }),
  dispatch => ({})
)
class EditableCell extends React.Component {
  getInput = (form, name, dataIndex, record) => {
    if (this.props.title === '职位名称') {
      return form.getFieldDecorator(dataIndex, {
        getValueFromEvent: this.normFile,
        initialValue: record.name,
      })(<Input />);
    } else if (this.props.title === '部门名称') {
      return form.getFieldDecorator(dataIndex, {
        initialValue: record.bu.id,
      })(
        <Select
          style={{ width: 120 }}
          // showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {this.props.businessunits.map(bu => (
            <Select.Option key={bu.id} value={bu.id}>
              {bu.name}
            </Select.Option>
          ))}
        </Select>
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
  ({ position: { positions }, businessunit: { businessunits }, loading }) => ({
    positions,
    businessunits,
    loading: loading.effects['position/queryPositions'],
    deleting: loading.effects['position/deletePositions'],
    adding: loading.effects['position/addPosition'],
  }),
  dispatch => ({
    removePositions(pos_objs) {
      return dispatch({ type: 'position/removePositions', payload: pos_objs });
    },
    addPosition(params) {
      return dispatch({ type: 'position/addPosition', payload: params });
    },
    editPosition(params) {
      dispatch({ type: 'position/editPosition', payload: params });
    },
  })
)
@Form.create()
export default class Position extends Component {
  state = {
    selectedRows: [],
    modalNewVisible: false,
    editingKey: '',
  };

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '职位ID',
        dataIndex: 'id',
      },
      {
        title: '部门名称',
        dataIndex: 'bu_id',
        render: (txt, row) => row.bu.name,
        editable: true,
      },
      {
        title: '职位名称',
        dataIndex: 'name',
        editable: true,
      },
      {
        title: '管理者',
        render: (txt, row) => <Icon type={row.is_manager === 0 ? 'close' : 'check'} />,
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
        //       title="将删除职位下所有人员及其任何相关信息"
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
    const { removePositions } = this.props;
    removePositions([obj]);
  };

  handleDeleteList = () => {
    const { selectedRows } = this.state;
    const { removePositions } = this.props;
    removePositions(selectedRows);
  };

  handleNewModelVisible = () => {
    const { modalNewVisible } = this.state;
    this.setState({ modalNewVisible: !modalNewVisible });
  };

  handleNewBU_OK = () => {
    const { form, addPosition } = this.props;
    form.validateFields((err, fieldsValue) => {
      fieldsValue.is_manager = Number(fieldsValue.is_manager);
      if (err) return;
      addPosition(fieldsValue).then(() => {
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
      this.props.editPosition({ ...row, pos_id: key * 1 });
      // CALL PATCH SERVICE !!
      this.setState({ editingKey: '' });
    });
  }

  render() {
    const { selectedRows } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    const { loading, form, adding, removing, positions, businessunits } = this.props;
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
      <PageHeaderLayout title="职位管理">
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
                    title="将删除所选职位及其下所有人员及其任何相关信息"
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
              data={{ list: positions }}
              columns={columns}
              onChange={e => console.log(e)}
            /> */}
            <Table
              rowKey="id"
              dataSource={positions}
              columns={columns}
              components={components}
              onChange={e => console.log(e)}
            />
          </div>
          <Modal
            visible={modalNewVisible}
            title="添加职位"
            onOk={() => this.handleNewBU_OK()}
            onCancel={() => this.handleNewModelVisible()}
            confirmLoading={adding}
          >
            <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="部门">
              {form.getFieldDecorator('bu_id', {
                rules: [{ required: true, message: 'Please choose bussiness unit...' }],
              })(
                <Select
                  style={{ width: 120 }}
                  placeholder="选择部门"
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {businessunits.map(bu => (
                    <Select.Option key={bu.id} value={bu.id}>
                      {bu.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input position name...' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="是否是管理者">
              {form.getFieldDecorator('is_manager', {
                rules: [{ required: true, message: 'Please select...' }],
              })(
                <Radio.Group>
                  <Radio value="0">否</Radio>
                  <Radio value="1">是</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
