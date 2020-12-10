import { Component, Fragment } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandartTable from '../../components/StandardTable';
import { connect } from 'dva';
import {
  message,
  Divider,
  DatePicker,
  Button,
  Card,
  Dropdown,
  Menu,
  Icon,
  Form,
  Input,
  Modal,
  Popconfirm,
} from 'antd';
import styles from './Hots';

@connect(
  ({ hot: { hots }, loading }) => ({
    hots,
    // 缺少新闻news

    loading: loading.effects['hot/query'],
    adding: loading.effects['hot/add'],
  }),
  dispatch => ({
    add(params) {
      return dispatch({ type: 'hot/add', payload: params });
    },
  })
)
@Form.create()
class Hots extends Component {
  state = {
    selectedRows: [],
    loading: false,
  };
  handleSelectRow = rows => {
    console.log('selectedRowKeys changed: ', rows);
    this.setState({ selectedRows: rows });
    console.log(rows);
  };

  handleNewHot_OK() {
    // 上传设置后 提示
    this.setState({ loading: true });

    setTimeout(() => {
      this.setState({
        selectedRows: [],
        loading: false,
      });
      message.success('操作成功');
    }, 1000);
  }

  render() {
    const { selectedRows } = this.state;

    const dataSource = [
      {
        key: '1',

        news_id: 32,
        content: '新闻',
      },
      {
        key: '2',
        news_id: 42,
        content: '新闻',
      },
    ];
    const columns = [
      {
        title: '新闻ID',
        dataIndex: 'news_id',
      },
      {
        title: '新闻内容',
        dataIndex: 'content',
      },
    ];

    const { loading, form, adding, gratitude_stars } = this.props;
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

    const hasSelected = selectedRows.length > 0;
    return (
      <PageHeaderLayout title="轮播栏设置">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button
                type="primary"
                onClick={() => this.handleNewHot_OK()}
                loading={this.state.loading}
                disabled={!hasSelected}
              >
                设置热点
              </Button>
            </div>

            <StandartTable
              rowKey="id"
              selectedRows={selectedRows}
              onSelectRow={this.handleSelectRow}
              loading={loading}
              // data={{ list: gratitude_stars  }}
              data={{ list: dataSource }}
              columns={columns}
              onChange={e => console.log(e)}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default Hots;
