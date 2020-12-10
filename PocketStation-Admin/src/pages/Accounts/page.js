import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  message,
  Form,
  Button,
  Card,
  Modal,
  Upload,
  Select,
  Icon,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isEmail, timeFormat } from '@/utils/utils';
import { randomString } from '../../utils/random';
import { saveAs } from 'file-saver';
import { host_v1, UploadURL } from '../../constants';

const FormItem = Form.Item;
const { Consumer, Provider } = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <Provider value={form}>
    <tr {...props} />
  </Provider>
);
const EditableFormRow = Form.create()(EditableRow);

@connect(
  ({ dealer_accounts }) => ({
    dealer_accounts,
  }),
  () => ({})
)
class EditableCell extends React.Component {
  state = {
    imgUrl: '',
  };
  // handleImgChange = info => {
  //   if (info.file.status === 'done') {
  //     this.setState({
  //       imgUrl: host_v1 + info.file.response.files[0].thumbnailUrl,
  //     });
  //   }
  // };
  // normFile = e => {
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e && e.fileList;
  // };
  getInput = (form, name, dataIndex, record) => {
    // if (dataIndex === 'avatar') {
    //   return form.getFieldDecorator(dataIndex, {
    //     valuePropName: 'fileList',
    //     getValueFromEvent: this.normFile,
    //     // initialValue: record.avatar,
    //   })(
    //     <Upload
    //       name="file"
    //       listType="picture-card"
    //       showUploadList={false}
    //       action={UploadURL}
    //       onChange={this.handleImgChange}
    //     >
    //       {this.state.imageUrl ? <img src={this.state.imageUrl} alt="" /> : (
    //         <div>
    //           <Icon type={this.state.imgLoading ? 'loading' : 'plus'} />
    //           <div className="ant-upload-text">Upload</div>
    //         </div>
    //       )}
    //     </Upload>
    //   )
    // }
    // return form.getFieldDecorator(dataIndex, {
    // })(<Input  initialValue={record[dataIndex]} />)
    let { bus } = this.props.dealer_accounts;
    if (this.props.title === '部门') {
      // console.log( record.bu )
      let curr_bus = record.bu.map(itm => itm.id);
      // console.log( curr_bus )

      return form.getFieldDecorator(dataIndex, {
        valuePropName: 'fileList',
        getValueFromEvent: this.normFile,
        initialValue: curr_bus,
      })(
        <Select
          mode="multiple"
          style={{ width: 120 }}
          placeholder={record.bu.name}
          defaultValue={curr_bus}
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {bus.map(bu => (
            <Select.Option key={bu.id} value={bu.id}>
              {bu.name}
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
    const { editing, dataIndex, title, inputType, record, index, ...restProps } = this.props;
    return (
      <Consumer>
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
      </Consumer>
    );
  }
}

@connect(
  ({ dealer_accounts }) => ({
    dealer_accounts,
  }),
  dispatch => ({
    getAccounts() {
      dispatch({ type: 'dealer_accounts/getAccounts' });
    },
    submitAccount(params) {
      dispatch({ type: 'dealer_accounts/postAccounts', payload: params });
    },
    delAccount(deleOne, callback) {
      dispatch({
        type: 'dealer_accounts/delAccount',
        payload: { key: deleOne },
        callback,
      });
    },
    editList({ row, key }) {
      dispatch({ type: 'dealer_accounts/editList', payload: { row, account_id: key } });
    },
    queryBus() {
      dispatch({ type: 'dealer_accounts/queryBus' });
    },
    search(params) {
      return dispatch({ type: `dealer_accounts/search`, payload: params });
    },
    refreshPwd() {
      dispatch({ type: 'dealer_accounts/refreshPwd' });
    },
  })
)
@Form.create()
class DealerAccounts extends Component {
  state = {
    editingKey: '',
    visible: false,
    imgUrl: '',
    randomPasswd: '',
    selectedRows: [],
  };
  componentDidMount() {
    const { getAccounts, queryBus } = this.props;
    getAccounts();
    queryBus();
    this.setRandomPasswd();
  }
  handleSelectRow = rows => {
    this.setState({ selectedRows: rows });
  };
  sendEmail = item => {
    // const { selectedRows } = this.state;
    // console.log( selectedRows )
    const { mail, pwd, email } = item;
    const subject = '经销商账号密码更改通知';
    const body = `账号: ${email}%0A密码: ${pwd}`;
    window.location.href = `mailto:${mail}?subject=${subject}&body=${body}`;
  };
  setRandomPasswd = () => {
    this.setState({ randomPasswd: randomString(6) });
  };
  columns = [
    {
      title: '经销商id',
      dataIndex: 'admin_id',
      editable: false,
    },
    {
      title: '名称',
      dataIndex: 'name',
      editable: true,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      editable: false,
      render: img => <img src={img} alt="img" style={{ width: '34px', borderRadius: '50%' }} />,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      editable: true,
    },
    {
      title: '公司邮箱',
      dataIndex: 'mail',
      editable: true,
    },
    {
      title: '部门',
      dataIndex: 'bu_id',
      render: (txt, row) => (
        <ul>
          {row.bu.map((b, inx) => (
            <li key={b.id}>
              {inx + 1}-{b.name}
            </li>
          ))}
        </ul>
      ),
      editable: true,
    },
    {
      title: '密码',
      dataIndex: 'pwd',
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'create_at',
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
                      onClick={() => this.save(form, record.key)}
                      type="primary"
                      size="small"
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
                <Button onClick={() => this.sendEmail(record)} size="small">
                  发送邮件
                </Button>
                <Button
                  onClick={() => this.edit(record.key)}
                  size="small"
                  style={{ margin: '0 8px' }}
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
        // selectedRows: [],
      });
    };
    this.props.delAccount(deleOne, callback);
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
      // if (row.avatar&&Array.isArray(row.avatar)){
      //   console.log( row.avatar[0].response )
      //   row.avatar = row.avatar[0].response.files[0].url;
      // }
      // if (row.avatar !== undefined){
      //   this.props.editList({row, key});
      // }
      row.bu_id = JSON.stringify(row.bu_id);
      console.log(row);
      if (isEmail(row.email)) {
        this.props.editList({ row, key });
        this.setState({ editingKey: '' });
      } else {
        message.error('邮箱格式错误');
      }
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleOk = e => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // const avatar = this.state.imgUrl;
      const { account, email, bu_id, pwd, mail } = fieldsValue;

      // console.log(isEmail(email));
      console.log(fieldsValue);

      if (isEmail(email)) {
        // this.props.submitAccount({ avatar, name: account, email });
        this.props.submitAccount({ name: account, email, bu_id: JSON.stringify(bu_id), pwd, mail });
        this.setState({
          visible: false,
        });
        form.resetFields();
      } else {
        message.error('邮箱格式错误');
      }
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  handleImgChange = info => {
    if (info.file.status === 'done') {
      this.setState({
        imgUrl: host_v1 + info.file.response.files[0].thumbnailUrl,
      });
    }
  };
  handleSearch = () => {
    this.props.search({ name: this.state.value });
  };

  handleChange = value => {
    this.setState({
      value,
    });
  };
  exportHandle = () => {
    let { accounts } = this.props.dealer_accounts;
    //excel表格的表头
    let str = '序号,经销商名称,邮箱,密码\n';
    for (const i in accounts) {
      str += `${i * 1 + 1},${accounts[i].name},${accounts[i].email},${accounts[i].pwd}\n`;
    }
    let exportContent = '\uFEFF';
    let blob = new Blob([exportContent + str], {
      type: 'application/vnd.ms-excel;',
    });
    saveAs(blob, '经销商信息.csv'); //导出的文件格式， .csv和.xlsx都是Excel文件后缀
  };

  render() {
    const { form } = this.props;
    const { randomPasswd, selectedRows } = this.state;
    let { accounts, bus } = this.props.dealer_accounts;
    accounts.map(itm => ((itm.key = itm.admin_id), (itm.create_at = timeFormat(itm.create_at))));
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const rowSelection = {
      selectedRowKeys: selectedRows,
      onChange: this.handleSelectRow,
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'avatar' ? 'image' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
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
    // const uploadButton = (
    //   <div>
    //     <Icon type="plus" />
    //     <div className="ant-upload-text">Upload</div>
    //   </div>
    // );
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Button
            icon="plus"
            type="primary"
            style={{ marginBottom: '20px' }}
            onClick={() => this.showModal()}
          >
            添加账号
          </Button>
          {/* {selectedRows.length > 0 && (
            <span>
              <Popconfirm
                title="为所有选中的经销商发送邮件？"
                okText="确定"
                cancelText="取消"
                // onConfirm={this.sendEmail}
              >
                <Button style={{margin: '0 8px'}} type="primary" ghost>批量发送邮件</Button>
              </Popconfirm>
            </span>
          )} */}
          <div style={{ float: 'right' }}>
            <Button type="primary" ghost size="default" onClick={this.exportHandle}>
              导出
            </Button>
            <Button
              type="primary"
              ghost
              size="default"
              onClick={this.props.refreshPwd}
              style={{ margin: '0 8px' }}
            >
              刷新密码
            </Button>
            经销商查询：
            <Select
              showArrow={false}
              style={{ width: 160, marginRight: '8px' }}
              showSearch
              onChange={this.handleChange}
            >
              {accounts.map(as => (
                <Select.Option key={as.admin_id} value={as.name}>
                  <span>{as.name}</span>
                </Select.Option>
              ))}
            </Select>
            <Button type="primary" ghost size="default" onClick={this.handleSearch}>
              查询
            </Button>
          </div>
          <Modal
            title="添加账户"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width="80%"
          >
            <Form>
              <FormItem {...formItemLayout} label="名称">
                {form.getFieldDecorator('account', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input resource name',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
              {/* <FormItem {...formItemLayout} label="头像">
                {form.getFieldDecorator('img_content', {
                  getValueFromEvent: this.normFile,
                })(
                  <Upload
                    name="file"
                    listType="picture-card"
                    showUploadList={false}
                    action={UploadURL}
                    onChange={this.handleImgChange}
                  >
                    {this.state.imgUrl2 ? <img src={this.state.imgUrl2} alt="" /> : uploadButton}
                  </Upload>
                )}
              </FormItem> */}
              <FormItem {...formItemLayout} label="邮箱">
                {form.getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input remail',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="公司邮箱">
                {form.getFieldDecorator('mail', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input remail',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="部门">
                {form.getFieldDecorator('bu_id', {
                  rules: [{ required: true, message: 'Please choose bussiness unit...' }],
                })(
                  <Select
                    mode="multiple"
                    // style={{ width: 120 }}
                    placeholder="选择部门"
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {bus.map(bu => (
                      <Select.Option key={bu.id} value={bu.id}>
                        {bu.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="初始密码">
                {form.getFieldDecorator('pwd', {
                  rules: [{ required: true, message: 'Please input password...' }],
                  initialValue: randomPasswd,
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Form>
          </Modal>
          <Table
            components={components}
            bordered
            dataSource={accounts}
            columns={columns}
            // rowSelection={rowSelection}
            rowClassName="editable-row"
            // pagination={{ defaultCurrent: 1, total: 20 }}
            // scroll={{ x: 1300 }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DealerAccounts;
