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

import styles from './Question.less';
import { excelUpload } from '../../constants';

const RESOURCE = 'question';

@connect(
  ({ question: { questions }, lesson: { lessons }, loading }) => ({
    questions,
    lessons,
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
  })
)
@Form.create()
export default class LessonClass extends Component {
  state = {
    selectedRows: [],
    modalNewVisible: false,
    fileList: [],
    lsn_id: '',
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

      /**
       * Build FormData
       */
      // const params = {
      //   content: '以下图中角度a为多少度##http://pocketstation.cn:8002/qs2.png',
      //   correct_option: '9°',
      //   other_option: '3°#90°#9°',
      // }
      // console.log(fieldsValue.lsn_id);
      console.log(fieldsValue);
      // const formData = { lsn_id: fieldsValue.lsn_id, file: fieldsValue.file[0].originFileObj };
      // console.log(fieldsValue);

      const formData = new FormData();
      formData.append('lsn_id', fieldsValue.lsn_id);
      formData.append('file', fieldsValue.file[0].originFileObj);

      console.log(formData);
      // fieldsValue.content = fieldsValue.content[fieldsValue.content.length - 1].response.files[0].url,
      add(formData).then(() => {
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
    const { lsn_id } = this.state;
    this.props.search({ lsn_id });
  };

  handleChange = value => {
    this.setState({
      lsn_id: value,
    });
  };

  render() {
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '分类',
        render: (txt, row) => row.lsn.oprt.cls.name,
      },
      {
        title: '术式',
        render: (txt, row) => row.lsn.oprt.name,
      },
      {
        title: '课程',
        render: (txt, row) => row.lsn.name,
      },
      {
        title: '题目',
        render: (txt, row) => row.content,
      },
      {
        title: '正确选项',
        render: (txt, row) => (
          <ul>{row.correct_option.split('#').map(opt => <li key={opt}>{opt}</li>)}</ul>
        ),
      },
      {
        title: '其他选项',
        render: (txt, row) => (
          <ul>{row.other_option.split('#').map(opt => <li key={opt}>{opt}</li>)}</ul>
        ),
      },
      {
        title: '操作',
        render: (txt, row, idx) => (
          <Fragment>
            <Popconfirm
              title="确认删除该题目？"
              okText="删除"
              cancelText="取消"
              onConfirm={() => this.handleDeleteOne(row)}
            >
              <Button type="danger" size="small">
                删除
              </Button>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const { loading, form, adding, removing, questions: tableData, lessons } = this.props;
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
    // form.setFieldsValue({file:this.state.fileList});

    return (
      <PageHeaderLayout title="题目管理">
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
                    title="确认删除所选题目？"
                    okText="删除"
                    cancelText="取消"
                    onConfirm={this.handleDeleteList}
                  >
                    <Button loading={removing}>批量删除</Button>
                  </Popconfirm>
                </span>
              )}
              <div style={{ float: 'right' }}>
                课程：<Select
                  style={{ width: 160, marginRight: '8px' }}
                  showSearch
                  onChange={this.handleChange}
                >
                  {lessons.map(lsn => (
                    <Select.Option key={lsn.id} value={lsn.id}>
                      {`${lsn.oprt.cls.name}/${lsn.oprt.name}/${lsn.name}`}
                    </Select.Option>
                  ))}
                </Select>
                <Button type="primary" ghost size="small" onClick={this.handleSearch}>
                  查询
                </Button>
              </div>
            </div>
            <StandartTable
              rowKey="id"
              selectedRows={selectedRows}
              onSelectRow={this.handleSelectRow}
              loading={loading}
              data={{ list: tableData }}
              columns={columns}
              onChange={e => console.log(e)}
            />
          </div>
          <Modal
            visible={modalNewVisible}
            title="上传题目"
            onOk={() => this.handleNewBU_OK()}
            onCancel={() => this.handleNewModelVisible()}
            confirmLoading={adding}
          >
            <Form.Item {...formItemLayout} label="课程">
              {form.getFieldDecorator('lsn_id', {
                rules: [{ required: true, message: 'Please select class...' }],
              })(
                <Select
                  style={{ minWidth: 160 }}
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {lessons.map(cls => (
                    <Select.Option key={cls.id} value={cls.id}>
                      {`${cls.oprt.cls.name}/${cls.oprt.name}/${cls.name}`}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="题目"
              // extra="仅选择最后上传的一份题目"
            >
              {form.getFieldDecorator('file', {
                valuePropName: 'fileList',
                rules: [{ required: true, message: 'Please choose a video' }],
                getValueFromEvent: e => (Array.isArray(e) ? e : e && [e.fileList[0]]),
              })(
                <Upload
                  name="file"
                  action={excelUpload}
                  listType="picture"
                  beforeUpload={file => {
                    return false;
                  }}
                  onRemove={e => console.log(e)}
                >
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
