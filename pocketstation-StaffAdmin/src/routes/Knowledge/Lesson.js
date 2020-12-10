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
  Cascader,
  Upload,
  Table,
  message,
  Checkbox,
} from 'antd';

import styles from './Lesson.less';
import { host, host_v1, UploadURL } from '../../constants';

const RadioGroup = Radio.Group;
const RESOURCE = 'lesson';

@Form.create()
class PushStaffs extends React.Component {
  state = {
    bu_select: [],
    pushModalVisible: false,
  };

  componentWillReceiveProps(nextProps) {
    let { pushStaffs, pushModalVisible } = nextProps;
    pushStaffs = pushStaffs.map(item => {
      let staff = item.staff.map(itm => ({ ...itm, selected: false }));
      return { bu_id: item.bu_id, selected: false, staff };
    });
    // console.log( pushStaffs )
    this.setState({ bu_select: pushStaffs, pushModalVisible });
  }

  bu_Select = (bu_id, toSelect) => {
    let { bu_select } = this.state;
    bu_select.forEach(itm => {
      if (itm.bu_id === bu_id) {
        itm.selected = toSelect;
        itm.staff.forEach(item => {
          item.selected = toSelect;
        });
      }
    });

    this.setState({ bu_select });
  };

  staff_Select = (bu_id, id, toSelect) => {
    let { bu_select } = this.state;
    bu_select.forEach(itm => {
      let flag = [];
      if (itm.bu_id === bu_id) {
        itm.staff.forEach(item => {
          if (item.id === id) {
            item.selected = toSelect;
          }
          item.selected ? flag.push(true) : flag.push(false);
        });
        itm.selected = flag.includes(false) ? false : true;
      }
    });
    this.setState({ bu_select });
  };

  handlePush_OK = () => {
    const { pushModalVisible } = this.state;
    let selected = [];
    this.state.bu_select.forEach(item => {
      selected = item.staff.filter(itm => {
        return itm.selected;
      });
    });
    selected = selected.map(item => item.id);
    console.log(selected);
    if (selected.length > 0) {
      this.props.pushInfo({ selected, name: this.props.lsn_name });
      this.props.closeVisible();
      this.setState({ pushModalVisible: !pushModalVisible });
    } else {
      message.info('请选择推送目标...');
    }
  };

  render() {
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
    const columns = [
      {
        title: '部门ID',
        dataIndex: 'bu_id',
      },
      {
        title: '部门',
        dataIndex: 'bu_name',
      },
      {
        title: '选择',
        render: (txt, row) => (
          <Checkbox
            checked={row.selected}
            onChange={() => this.bu_Select(row.bu_id, !row.selected)}
          />
        ),
      },
    ];
    const staff_columns = [
      {
        title: '员工ID',
        dataIndex: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '选择',
        render: (txt, row) => (
          <Checkbox
            checked={row.selected}
            onChange={() => this.staff_Select(row.buId, row.id, !row.selected)}
          />
        ),
      },
    ];
    let { pushStaffs, form } = this.props;
    let { bu_select, pushModalVisible } = this.state;

    bu_select.forEach(item => {
      pushStaffs.map(bu => {
        if (item.bu_id === bu.bu_id) {
          bu.selected = item.selected;
          bu.staff = item.staff;
        }
      });
    });
    // console.log( pushStaffs )
    return (
      <Card>
        <Modal
          visible={pushModalVisible}
          title="选择推送"
          onOk={() => this.handlePush_OK()}
          onCancel={() => this.props.closeVisible()}
          width={780}
        >
          <Form.Item {...formItemLayout} label="选择">
            {form.getFieldDecorator('pushStaffs', {
              rules: [{ required: true, message: 'Please Set push staffs...' }],
              initialValue: [],
            })(
              <Table
                rowKey="bu_id"
                columns={columns}
                dataSource={pushStaffs}
                expandedRowRender={record => (
                  <div style={{ margin: 0 }}>
                    <Table rowKey="id" columns={staff_columns} dataSource={record.staff} />
                  </div>
                )}
              />
            )}
          </Form.Item>
        </Modal>
      </Card>
    );
  }
}

class LessonPermission extends React.Component {
  state = {};

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      // for (let bu_id of Object.keys(this.))
      const selected = {};
      value.forEach(bu => {
        selected[bu.bu_id] = bu.need_manager;
      });
      this.setState(selected);
    }
  }

  triggerChange = selected => {
    const { onChange } = this.props;
    onChange &&
      onChange(
        Object.keys(selected).map(bu_id => ({
          bu_id: Number(bu_id),
          need_manager: selected[bu_id],
        }))
      );
  };
  handleIsManager = (bu_id, need_manager) => {
    this.state[String(bu_id)] = need_manager;
    // this.setState({...this.state});
    this.triggerChange({ ...this.state });
  };

  handleSelect = (bu_id, toSelect) => {
    if (toSelect) {
      this.state[bu_id] = false;
    } else {
      delete this.state[bu_id];
    }
    // this.setState({...this.state});
    this.triggerChange({ ...this.state });
  };

  allSelectHandle = e => {
    const { businessunits } = this.props;
    if (e.target.checked) {
      businessunits.forEach(bu => {
        this.state[bu.id] = false;
      });
      this.triggerChange({ ...this.state });
    } else {
      let selected = this.state;
      businessunits.map(bu => {
        if (String(bu.id) in selected) {
          delete this.state[String(bu.id)];
        }
      });
      this.triggerChange({ ...this.state });
    }
  };

  render() {
    const columns = [
      {
        title: '部门ID',
        dataIndex: 'id',
      },
      {
        title: '部门',
        dataIndex: 'name',
      },
      {
        title: '选择',
        render: (txt, row) => (
          <Checkbox
            checked={row.selected}
            onChange={() => this.handleSelect(row.id, !row.selected)}
          />
        ),
      },
      {
        title: '是否是管理员',
        render: (txt, row) => (
          <Checkbox
            disabled={!row.selected}
            checked={row.need_manager}
            onChange={() => this.handleIsManager(row.id, !row.need_manager)}
          />
        ),
      },
    ];
    const { businessunits } = this.props;
    const selected = this.state;
    const tableData = businessunits.map(bu => {
      if (String(bu.id) in selected) {
        bu.selected = true;
        bu.need_manager = selected[String(bu.id)];
      } else {
        bu.selected = false;
        bu.need_manager = false;
      }
      return bu;
    });
    console.log(tableData);
    return (
      <Card>
        <Checkbox style={{ marginBottom: 20, marginRight: 10 }} onChange={this.allSelectHandle} />全选
        <Table rowKey="id" columns={columns} dataSource={tableData} />
      </Card>
    );
  }
}

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
        valuePropName: 'fileList',
        getValueFromEvent: this.normFile,
        // initialValue: record.img_src,
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
  ({
    staff: { staffs },
    lesson: { lessons, pushStaffs },
    operation: { operations },
    businessunit: { businessunits },
    loading,
  }) => ({
    operations,
    staffs,
    lessons,
    pushStaffs,
    businessunits,
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
    set_recommend(params) {
      return dispatch({ type: `${RESOURCE}/set_recommend`, payload: params });
    },
    set_islook(params) {
      return dispatch({ type: `${RESOURCE}/set_islook`, payload: params });
    },
    getPushStaffs(params) {
      dispatch({ type: `${RESOURCE}/getPushStaffs`, payload: params });
    },
    pushInfo(params) {
      dispatch({ type: `${RESOURCE}/pushInfo`, payload: params });
    },
  })
)
@Form.create()
export default class LessonClass extends Component {
  state = {
    selectedRows: [],
    modalNewVisible: false,
    pushModalVisible: false,
    imgLoading: false,
    imageUrl: '',
    editingKey: '',
    lsn_name: '',
  };

  columns = [
    {
      title: '课程ID',
      dataIndex: 'id',
    },
    {
      title: '分类',
      render: (txt, row) => row.oprt.cls.name,
    },
    {
      title: '术式',
      render: (txt, row) => row.oprt.name,
    },
    {
      title: '封面图片',
      render: (txt, row) => (
        <img src={host_v1 + row.img_src} alg={host_v1 + row.img_src} width={36} height={36} />
      ),
      editable: true,
    },
    {
      title: '课程名',
      dataIndex: 'name',
      editable: true,
    },
    {
      title: '课程类型',
      render: (txt, row) => (row.type === 'video' ? '视频' : '图文'),
    },
    {
      title: '讲师',
      // render: (txt, row) => (row.lecturer ? row.lecturer.name : 'ADMIN'),
      render: (txt, row) => (Object.keys(row.lecturer).length > 0 ? row.lecturer.name : 'ADMIN'),
    },
    {
      title: '权限',
      render: (txt, row) => (
        <ul>
          {/* {row.lesson_permissions.map((p, inx) => (
            <li key={inx}>
              {p.bu.name}-{p.need_manager ? '管理者权限' : '任何员工'}
            </li>
          ))} */}
        </ul>
      ),
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
                <Button onClick={() => this.set_recommend(record)} size="small">
                  {record.recommended === 1 ? '取消推荐' : '推荐'}
                </Button>
                <Divider type="vertical" />
                <Button onClick={() => this.set_islook(record)} size="small">
                  {record.is_look === 1 ? '经销商可见' : '经销商不可见'}
                </Button>
                <Divider type="vertical" />
                <Button
                  onClick={() => this.edit(record.id)}
                  size="small"
                  style={{ margin: '8px 0' }}
                >
                  编辑
                </Button>
                <Divider type="vertical" />
                <Button
                  onClick={() => this.handlePushVisible(record)}
                  size="small"
                  style={{ margin: '8px 0' }}
                >
                  推送
                </Button>
                <Divider type="vertical" />
                <Popconfirm
                  title="将删除该课程及其任何相关信息"
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

  handlePushVisible = record => {
    const { lesson_permissions } = record;
    // const { pushModalVisible } = this.state;
    // this.setState({ pushModalVisible: !pushModalVisible });
    this.props.getPushStaffs(lesson_permissions);
    this.setState({ lsn_name: record.name });
    this.closeVisible();
  };
  closeVisible = () => {
    const { pushModalVisible } = this.state;
    this.setState({ pushModalVisible: !pushModalVisible });
  };
  handlePush_OK = () => {
    const { pushModalVisible } = this.state;
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue);
    });

    // this.setState({ pushModalVisible: !pushModalVisible });
  };

  handleNewModelVisible = () => {
    const { modalNewVisible } = this.state;
    this.setState({ modalNewVisible: !modalNewVisible });
  };

  handleNewBU_OK = () => {
    const { form, add } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if (fieldsValue.type === 'video') {
        console.log(fieldsValue.content_video);
        fieldsValue.contents =
          // fieldsValue.content_video[fieldsValue.content_video.length - 1].response.files[0].url;
          fieldsValue.content_video[fieldsValue.content_video.length - 1].response;
        delete fieldsValue.content_video;
      } else {
        fieldsValue.lecturer_id = null;
        fieldsValue.contents = fieldsValue.content_images.map(
          // ({ response: { files } }) => files[0].url
          ({ response }) => response
        );
        fieldsValue.contents = JSON.stringify(fieldsValue.contents);
        delete fieldsValue.content_images;
      }
      fieldsValue.img_src =
        // fieldsValue.img_src[fieldsValue.img_src.length - 1].response.files[0].url;
        fieldsValue.img_src[fieldsValue.img_src.length - 1].response;
      fieldsValue.oprt_id = fieldsValue.oprt_id[1];

      // if (fieldsValue.type === "video") {
      //   fieldsValue.contents = fieldsValue.content_video[0].name;
      //   delete fieldsValue.content_video;
      // }else {
      //   fieldsValue.contents = fieldsValue.content_images.map(item => item.name);
      //   delete fieldsValue.content_images;
      // }
      // fieldsValue.img_src = fieldsValue.img_src[0].name;
      // fieldsValue.oprt_id = fieldsValue.oprt_id[1];

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

  getClsOprtData = () => {
    const { operations } = this.props;
    const ClsOprtData = [];
    for (let opr of operations) {
      let cls = ClsOprtData.find(cls => cls.value === opr.cls.id);
      if (cls === undefined) {
        cls = { value: opr.cls.id, label: opr.cls.name, children: [] };

        ClsOprtData.push(cls);
      }
      cls.children.push({ label: opr.name, value: opr.id });
    }
    return ClsOprtData;
  };

  getStaffsData = () => {
    let { staffs } = this.props;
    let index = 0;
    staffs = staffs.map(({ id, name }) => ({ label: name, value: id }));
    staffs.forEach((item, inx) => {
      index = item.label === '无' ? inx : index;
    });
    let specialLecture = staffs.splice(index, 1);
    staffs = [...specialLecture, ...staffs];
    return staffs;
    // return staffs.map(({ id, name }) => ({ label: name, value: id }));
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
      // row.img_src = row.img_src[0].name;
      // console.log(row);
      // CALL PATCH SERVICE !!
      this.props.update({ lsn_id: this.state.editingKey, data: row });
      this.setState({ editingKey: '' });
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };

  set_recommend = record => {
    this.props.set_recommend(record);
  };

  set_islook = record => {
    this.props.set_islook(record);
  };

  // Reagion EditableRow End

  render() {
    // Editable Row Start
    const NameMap = {
      封面图片: 'img_src',
      课程名: 'name',
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

    const {
      loading,
      form,
      adding,
      removing,
      lessons: tableData,
      businessunits,
      pushStaffs,
    } = this.props;
    const { modalNewVisible, pushModalVisible, lsn_name } = this.state;

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

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const typeGroup = ['是', '否'];

    return (
      <PageHeaderLayout title="课程管理">
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
                    title="将删除该课程及其任何相关信息"
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
              columns={columns}
              components={components}
              // onChange={e => console.log(e)}
            />
          </div>
          <Modal
            visible={modalNewVisible}
            title="添加课程"
            onOk={() => this.handleNewBU_OK()}
            onCancel={() => this.handleNewModelVisible()}
            confirmLoading={adding}
            width={650}
          >
            <Form.Item {...formItemLayout} label="名称">
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input Lesson name...' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="分类">
              {form.getFieldDecorator('oprt_id', {
                rules: [{ required: true, message: 'Please select operation...' }],
              })(<Cascader options={this.getClsOprtData()} />)}
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
            <Form.Item {...formItemLayout} label="课程权限">
              {form.getFieldDecorator('permissions', {
                rules: [{ required: true, message: 'Please Set Lesson permissions...' }],
                initialValue: [],
              })(<LessonPermission businessunits={businessunits} />)}
            </Form.Item>
            <Form.Item {...formItemLayout} row={4} label="经销商可见">
              {form.getFieldDecorator('is_look', {
                rules: [{ required: true, message: 'Please choice...' }],
              })(
                <RadioGroup>
                  {typeGroup.map((itm, inx) => (
                    <Radio key={inx} value={1 - inx}>
                      {itm}
                    </Radio>
                  ))}
                </RadioGroup>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="类型">
              {form.getFieldDecorator('type', {
                rules: [{ required: true, message: 'Please Select Lesson type...' }],
                initialValue: 'video',
              })(
                <Radio.Group>
                  <Radio.Button value="images">图文</Radio.Button>
                  <Radio.Button value="video">视频</Radio.Button>
                </Radio.Group>
              )}
            </Form.Item>

            {form.getFieldValue('type') === 'video' ? (
              <Fragment>
                <Form.Item {...formItemLayout} label="讲师">
                  {form.getFieldDecorator('lecturer_id', {
                    rules: [{ required: true, message: 'Please Select Lecturer...' }],
                  })(
                    <Select
                      showSearch
                      style={{ width: 200 }}
                      placeholder="选择讲师"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.getStaffsData().map(({ label, value }) => (
                        <Select.Option key={value} value={value}>
                          {label}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label="视频"
                  // extra="仅选择最后上传的一份视频"
                >
                  {form.getFieldDecorator('content_video', {
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
              </Fragment>
            ) : (
              <Form.Item {...formItemLayout} label="图文" extra="按顺序上传">
                {form.getFieldDecorator('content_images', {
                  valuePropName: 'fileList',
                  rules: [{ required: true, message: 'Please choose some images' }],
                  getValueFromEvent: e => (Array.isArray(e) ? e : e && e.fileList),
                })(
                  <Upload name="file" action={UploadURL} listType="picture" multiple={true}>
                    <Button>
                      <Icon type="upload" />上传
                    </Button>
                  </Upload>
                )}
              </Form.Item>
            )

            // <Form.Item
            //   {...formItemLayout}
            //   label="类型"
            // >
            //   {form.getFieldDecorator('type', {
            //     rules: [{ required: true, message: 'Please Select Lesson type...' }],
            //   })(
            //     <Radio.Group onChange={(e) => console.log(e)}>
            //       <Radio.Button value="images">图文</Radio.Button>
            //       <Radio.Button value="video">视频</Radio.Button>
            //     </Radio.Group>
            //   )}
            // </Form.Item>
            }
          </Modal>
          {/* <Modal
            visible={pushModalVisible}
            title="选择推送"
            onOk={() => this.handlePush_OK()}
            onCancel={() => this.closeVisible()}
            confirmLoading={adding}
            width={650}
          >
            <Form.Item {...formItemLayout} label="选择">
              {form.getFieldDecorator('pushStaffs', {
                // rules: [{ required: true, message: 'Please Set push staffs...' }],
                // initialValue: [],
              })(<PushStaffs pushStaffs={pushStaffs} />)}
            </Form.Item>
          </Modal> */}
          {pushModalVisible ? (
            <PushStaffs
              pushStaffs={pushStaffs}
              pushModalVisible={pushModalVisible}
              closeVisible={this.closeVisible}
              pushInfo={this.props.pushInfo}
              lsn_name={lsn_name}
            />
          ) : null}
        </Card>
      </PageHeaderLayout>
    );
  }
}
