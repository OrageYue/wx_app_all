import { Component, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

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
} from 'antd';

import styles from './Carousel.less';
import { host } from '../../constants';

const RESOURCE = 'carousel';

@connect(
  ({ carousel: { carousels, news }, loading }) => ({
    carousels,
    news,
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
  })
)
@Form.create()
class Carousel extends Component {
  state = {
    selectedRows: [],
    modalNewVisible: false,
    idx: -1,
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

  handleNewModelVisible = idx => {
    const { modalNewVisible } = this.state;
    const news_state = { modalNewVisible: !modalNewVisible };
    if (idx !== undefined) {
      news_state.idx = idx;
    }
    this.setState(news_state);
  };

  handleNewBU_OK = () => {
    const { form, add, carousels } = this.props;
    const { idx } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const news_list = carousels.map(hot => Number(hot.id));
      if (news_list.includes(fieldsValue.news_id)) {
        message.info('该条轮播已存在');
      } else {
        let params = { old_id: news_list[idx], new_id: fieldsValue.news_id };
        add(params).then(() => {
          this.handleNewModelVisible();
          form.resetFields();
        });
      }
      // news_list[idx] = fieldsValue.news_id;
      // add({ news_ids: news_list }).then(() => {
      //   this.handleNewModelVisible();
      //   form.resetFields();
      // });
    });
  };

  render() {
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '顺序',
        render: (txt, row, idx) => idx + 1,
      },
      {
        title: '新闻',
        dataIndex: 'name',
      },
      {
        title: '简介',
        dataIndex: 'brief',
      },
      {
        title: '操作',
        render: (txt, row, idx) => (
          <Fragment>
            <Button
              disabled={false}
              size="small"
              onClick={() => this.handleNewModelVisible(idx)}
              type="primary"
            >
              编辑
            </Button>
            {/* <Divider type="vertical" /> */}
            {/* <Popconfirm
              title="将删除该热点及其任何相关信息"
              okText="删除"
              cancelText="取消"
              onConfirm={() => this.handleDeleteOne(row)}
            >
              <Button type="danger" size="small">
                删除
              </Button>
            </Popconfirm> */}
          </Fragment>
        ),
      },
    ];

    let { loading, form, adding, carousels, news } = this.props;
    const { modalNewVisible } = this.state;
    carousels = carousels.map(itm => ({ ...itm, key: itm.id }));

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
      <PageHeaderWrapper title="轮播栏管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            {/* <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <Popconfirm
                    title="将删除该分类及其任何相关信息"
                    okText="删除"
                    cancelText="取消"
                    onConfirm={this.handleDeleteList}
                  >
                    <Button loading={removing}>批量删除</Button>
                  </Popconfirm>
                </span>
              )}
            </div> */}
            {/* <StandartTable
              rowKey="id"
              selectedRows={selectedRows}
              onSelectRow={this.handleSelectRow}
              loading={loading}
              data={{ list: tableData.map((row,idx)=>({...row, id: idx})) }}
              columns={columns}
              onChange={e => console.log(e)}
            /> */}
            <Table dataSource={carousels} columns={columns} onChange={e => console.log(e)} />
          </div>
          <Modal
            visible={modalNewVisible}
            title="选择新闻"
            onOk={() => this.handleNewBU_OK()}
            onCancel={() => this.handleNewModelVisible()}
            confirmLoading={adding}
          >
            <Form.Item {...formItemLayout} label="新闻">
              {form.getFieldDecorator('news_id', {
                rules: [{ required: true, message: 'Please input News Class name...' }],
              })(
                <Select
                  style={{ minWidth: 160 }}
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {news.map(one => (
                    <Select.Option key={one.id} value={one.id}>
                      {`${one.cls.name}/${one.name}`}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Carousel;
