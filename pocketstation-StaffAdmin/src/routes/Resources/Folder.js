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
import styles from './Folder.less';

const RESOURCE = 'resources_folder';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

@connect(
  ({ resources_folder }) => ({
    resources_folder,
  }),
  dispatch => ({})
)
class EditableCell extends React.Component {
  getInput = (form, name, dataIndex, record) => {
    let { hier } = this.props.resources_folder;
    console.log(record.id);
    hier = hier.filter(h => {
      return h.id !== record.id;
    });
    console.log(hier);
    if (this.props.title === '目录名称') {
      return form.getFieldDecorator(name, {
        getValueFromEvent: this.normFile,
        initialValue: record.name,
      })(<Input />);
    } else {
      return form.getFieldDecorator(dataIndex, {
        initialValue: record.hier.id,
      })(
        <Select
          style={{ width: 120 }}
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {hier.map(hr => (
            <Select.Option key={hr.id} value={hr.id}>
              {hr.name}
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
  ({ resources_folder: resources_folder, loading }) => ({
    resources_folder,
    loading: loading.effects[`${RESOURCE}/query`],
  }),
  dispatch => ({
    deleLists(deleOne, callback) {
      dispatch({
        type: `${RESOURCE}/deleLists`,
        payload: { key: deleOne },
        callback,
      });
    },
    editList(row, key) {
      let params = { row, key };
      dispatch({ type: `${RESOURCE}/editResource`, payload: params });
    },
  })
)
@Form.create()
export default class Folder extends Component {
  state = {
    selectedRows: [],
    modalNewVisible: false,
    editingKey: '',
  };

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '目录ID',
        dataIndex: 'id',
      },
      {
        title: '目录名称',
        dataIndex: 'name',
        editable: true,
      },
      {
        title: '父目录名称',
        dataIndex: 'p_id',
        render: (text, record) => <span>{record.hier.name}</span>,
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
                    onConfirm={() => this.deleteList(record.id)}
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
  deleteList = key => {
    let deleOne = [];
    deleOne.push(key);
    const callback = () => {
      this.setState({
        selectedRows: [],
      });
    };
    this.props.deleLists(deleOne, callback);
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
      // if( row.p_id === '根目录') {
      //   row.p_id = 1;
      // }
      const params = row;
      console.log(row);

      this.props.editList(params, key * 1);
      this.setState({ editingKey: '' });
    });
    this.setState({ editingKey: '' });
  }

  render() {
    const { selectedRows } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    const { loading, form, adding, removing, resources_folder } = this.props;
    const { list } = resources_folder;
    list.map(rs => (rs.key = rs.id));
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
          name: col.title === '目录名称' ? 'name' : 'p_name',
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
      <PageHeaderLayout title="资源目录管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              loading={loading}
              rowKey="id"
              dataSource={list}
              columns={columns}
              components={components}
              onChange={e => console.log(e)}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
