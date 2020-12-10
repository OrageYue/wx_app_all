import React,{ Component, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import StandartTable from '../../components/StandardTable';
import {
  Divider,
  Button,
  Card,
  Icon,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Cascader,
  Upload,
  Table,
  DatePicker,
} from 'antd';
import moment from 'moment';

import styles from './Staff.less';
import { randomString } from '../../utils/random';
import { UploadURL, host_v1 } from '../../constants';
const DefaultAvatar = '/default/avatar_64px.png';
import { timeFormat2 } from '../../utils/utils';

const RESOURCE = 'staff';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

@connect(
  ({ position: { positions } }) => ({
    positions,
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

  getPosData = bu_id => {
    const { positions } = this.props;
    const PosData = [];
    for (let pos of positions) {
      bu_id === pos.bu.id ? PosData.push(pos) : null;
    }
    return PosData;
  };


  getInput = (form, name, dataIndex, record) => {
    if (this.props.title === '头像') {
      return form.getFieldDecorator(name, {
        // valuePropName: 'fileList',
        getValueFromEvent: this.normFile,
        initialValue: record.avatar,
      })(
        <Upload
          name="file"
          listType="picture-card"
          showUploadList={false}
          action={UploadURL}
          // onChange={this.handleImgChange}
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
    } else if (this.props.title === '职位名称') {
      return form.getFieldDecorator(dataIndex, {
        initialValue: record.pos.id,
      })(
        <Select
          style={{ width: 120 }}
          // showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {this.getPosData(record.pos.bu.id).map(pos => (
            <Select.Option key={pos.id} value={pos.id}>
              {pos.name}
            </Select.Option>
          ))}
        </Select>
      );
    } else if(this.props.title === '出生日期') {
      return form.getFieldDecorator('birthday', {
        initialValue: moment(timeFormat2(record.birthday)),
        rules: [{ required: true, message: 'Please input birthday...' }],
      })(<DatePicker 
        defaultValue={moment(timeFormat2(record.birthday), 'YYYY-MM-DD')}
        onChange={this.onChange}
      />)
    }else {
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
  ({ position: { positions }, businessunit: { businessunits }, staff: { staffs }, loading }) => ({
    positions,
    businessunits,
    staffs,
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
    search(params) {
      return dispatch({ type: `${RESOURCE}/search`, payload: params });
    },
  })
)
@Form.create()
export default class Staff extends Component {
  state = {
    selectedRows: [],
    modalNewVisible: false,
    randomPasswd: '',
    editingKey: '',
    value: '',
    clsValue: '',
  };
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '员工ID',
        dataIndex: 'id',
      },
      {
        title: '部门名称',
        dataIndex: 'bu_id',
        render: (txt, row) => row.pos.bu.name,
      },
      {
        title: '职位名称',
        dataIndex: 'pos_id',
        render: (txt, row) => row.pos.name,
        editable: true,
      },
      {
        title: '管理者',
        render: (txt, row) => <Icon type={row.pos.is_manager === 0 ? 'close' : 'check'} />,
      },
      {
        title: '头像',
        render: (txt, row) => (
          <img
            src={row.avatar}
            alg={row.avatar}
            width={36}
            height={36}
            style={{ borderRadius: 18 }}
          />
        ),
        editable: true,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        editable: true,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        editable: true,
      },
      {
        title: '电话',
        dataIndex: 'tel',
        editable: true,
      },
      {
        title: '密码',
        dataIndex: 'passwd',
      },
      {
        title: '出生日期',
        dataIndex: 'birthday',
        editable: true,
        width: '15%',
        render: (txt, record, idx) => <div>{timeFormat2(record.birthday)}</div>,
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
  setRandomPasswd = () => {
    this.setState({ randomPasswd: randomString(6) });
  };

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
      fieldsValue.pos_id = fieldsValue.pos_id[1];
      fieldsValue.avatar = DefaultAvatar;
      fieldsValue.birthday = moment(fieldsValue.birthday).format('L');
      add(fieldsValue).then(() => {
        this.handleNewModelVisible();
        form.resetFields();
      });
    });
  };
  getBuPosData = () => {
    const { positions } = this.props;
    const BuPosData = [];
    for (let pos of positions) {
      let bu = BuPosData.find(bu => bu.value === pos.bu.id);
      if (!bu) {
        bu = { value: pos.bu.id, label: pos.bu.name, children: [] };
        BuPosData.push(bu);
      }
      bu.children.push({ label: pos.name, value: pos.id });
    }
    return BuPosData;
  };

  componentDidMount() {
    this.setRandomPasswd();
  }

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
      console.log(row)
      row.birthday = moment(row.birthday).format('L');
      if (Array.isArray(row.avatar)) {
        // row.avatar = host_v1 + row.avatar[0].response.files[0].url;
        row.avatar = host_v1 + row.avatar[0].response;
      }
      if (row.avatar !== undefined) {
        this.props.update({ staff_id: this.state.editingKey, data: row });
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

  render() {
    const { selectedRows } = this.state;
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          name: col.title === '头像' ? 'avatar' : null,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    const { form, adding, removing, staffs } = this.props;
    const { modalNewVisible, randomPasswd } = this.state;
    const tableData = staffs;

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

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    return (
      <PageHeaderLayout title="人员管理">
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
                    title="将删除该人员及其任何相关信息"
                    okText="删除"
                    cancelText="取消"
                    onConfirm={this.handleDeleteList}
                  >
                    <Button loading={removing}>批量删除</Button>
                  </Popconfirm>
                </span>
              )}
              <div style={{ float: 'right' }}>
                员工查询：<Select
                  showArrow={false}
                  style={{ width: 160, marginRight: '8px' }}
                  showSearch
                  onChange={this.handleChange}
                >
                  {staffs.map(staff => (
                    <Select.Option key={staff.id} value={staff.name}>
                      <span>{staff.name}</span>
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
              // columns={columns}
              components={components}
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
            title="添加人员"
            onOk={() => this.handleNewBU_OK()}
            onCancel={() => this.handleNewModelVisible()}
            confirmLoading={adding}
          >
            <Form.Item {...formItemLayout} label="部门">
              {form.getFieldDecorator('pos_id', {
                rules: [{ required: true, message: 'Please choose bussiness unit...' }],
              })(<Cascader options={this.getBuPosData()} />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="名称">
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input BU name...' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="出生日期">
              {form.getFieldDecorator('birthday', {
                rules: [{ required: true, message: 'Please input birthday...' }],
              })(<DatePicker />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="邮箱">
              {form.getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please input email...' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="电话">
              {form.getFieldDecorator('tel', {
                rules: [{ required: true, message: 'Please input tel...' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="初始密码">
              {form.getFieldDecorator('passwd', {
                rules: [{ required: true, message: 'Please input password...' }],
                initialValue: randomPasswd,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
