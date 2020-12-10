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
  Table,
} from 'antd';
import styles from './Department.less';
import React from 'react'
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = (form, name, record) => {
    if (this.props.title === '部门名称') {
      return form.getFieldDecorator(name, {
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

@connect(
  ({ businessunit, loading }) => ({
    businessunits: businessunit.businessunits.map(bu => ({ ...bu })),
    loading: loading.effects['businessunit/getBusinessUnit'],
    deleting: loading.effects['businessunit/removeBusinessUnits'],
    adding: loading.effects['businessunit/addBusinessUnit'],
  }),
  dispatch => ({
    removeBusinessUnits(bu_ids) {
      console.log(bu_ids);
      dispatch({ type: 'businessunit/removeBusinessUnits', payload: bu_ids });
    },
    addBusinessUnit(name) {
      return dispatch({ type: 'businessunit/addBusinessUnit', payload: name });
    },
    editBusinessUnit(params) {
      dispatch({ type: 'businessunit/editBusinessUnit', payload: params });
    },
  })
)
@Form.create()
export default class Department extends Component {
  state = {
    selectedRows: [],
    modalNewBUVisible: false,
    editingKey: '',
  };

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '部门ID',
        dataIndex: 'id',
      },
      {
        title: '部门名称',
        dataIndex: 'name',
        editable: true,
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
        //       title="将删除部门下所有人员及其任何相关信息"
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
  handleDeleteOne = bu => {
    const { removeBusinessUnits } = this.props;
    removeBusinessUnits([bu]);
  };
  handleDeleteList = () => {
    const { selectedRows } = this.state;
    const { removeBusinessUnits } = this.props;
    removeBusinessUnits(selectedRows);
  };
  handleNewBUModelVisible = () => {
    const { modalNewBUVisible } = this.state;
    this.setState({ modalNewBUVisible: !modalNewBUVisible });
  };

  handleNewBU_OK = () => {
    const { form, addBusinessUnit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      addBusinessUnit(fieldsValue.name).then(() => {
        this.handleNewBUModelVisible();
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
      this.props.editBusinessUnit({ ...row, bu_id: key * 1 });
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

    const { loading, form, adding, removing } = this.props;
    const { modalNewBUVisible } = this.state;
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
      <PageHeaderLayout title="部门管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleNewBUModelVisible()}>
                添加
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Popconfirm
                    title="将删除所选部门及其下所有人员及其任何相关信息"
                    okText="删除"
                    cancelText="取消"
                    onConfirm={this.handleDeleteList}
                  >
                    <Button loading={removing}>批量删除</Button>
                  </Popconfirm>
                  {/* <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown> */}
                </span>
              )}
            </div>
            {/*
              <StandartTable 
              rowKey="id"
              selectedRows={selectedRows}
              onSelectRow={this.handleSelectRow}
              components={components}
              loading={loading}
              data={{ list: this.props.businessunits }}
              columns={columns}
              onChange={e => console.log(e)}
            />*/}
            <Table
              rowKey="id"
              dataSource={this.props.businessunits}
              columns={columns}
              components={components}
              onChange={e => console.log(e)}
            />
          </div>
          <Modal
            title="添加部门"
            visible={modalNewBUVisible}
            onOk={() => this.handleNewBU_OK()}
            onCancel={() => this.handleNewBUModelVisible()}
            confirmLoading={adding}
          >
            <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input BU name...' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
