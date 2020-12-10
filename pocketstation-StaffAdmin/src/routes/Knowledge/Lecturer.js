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

import styles from './Lecturer.less';
import { host } from '../../constants';

const RESOURCE = 'lecturer';

@connect(
  ({ lecturer: { lecturers }, loading }) => ({
    lecturers,
    loading: loading.effects[`${RESOURCE}/query`],
    deleting: loading.effects[`${RESOURCE}/delete`],
    adding: loading.effects[`${RESOURCE}/add`],
  }),
  dispatch => ({})
)
@Form.create()
export default class LessonClass extends Component {
  columns = [
    {
      title: '讲师',
      render: (txt, rcd) => (
        <span className={styles.info}>
          <img src={rcd.avatar} />
          <span>{rcd.name}</span>
        </span>
      ),
    },
    {
      title: '课程数',
      dataIndex: 'lessons',
    },
    // {
    //   title: '总被点赞',
    //   dataIndex: 'be_thumbs'
    // },
    // {
    //   title: '总被收藏',
    //   dataIndex: 'be_collected'
    // },
  ];

  render() {
    const { loading, lecturers } = this.props;
    const { columns } = this;

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

    return (
      <PageHeaderLayout title="讲师信息管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator} />
            <Table rowKey="name" loading={loading} dataSource={lecturers} columns={columns} />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
