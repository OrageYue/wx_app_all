import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Card, Button, Popconfirm } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ExpandedReplys from './ExpandedReplys';
import { timeFormat } from '@/utils/utils';

@connect(
  ({ ques }) => ({
    ques,
  }),
  dispatch => ({
    getQues() {
      dispatch({ type: 'ques/getQues' });
    },
    deleLists(deleOne, callback) {
      dispatch({
        type: 'ques/deleLists',
        payload: { key: deleOne },
        callback,
      });
    },
  })
)
class Question extends Component {
  componentDidMount() {
    this.props.getQues();
  }

  getReplys = ques_id => {
    console.log('获取回复');
  };
  deleteList = key => {
    let deleOne = [];
    key = key * 1;
    deleOne.push(key);
    const callback = () => {
      this.setState({
        selectedRows: [],
      });
    };
    this.props.deleLists(deleOne, callback);
  };
  render() {
    let { ques } = this.props.ques;
    ques.map(qs => ((qs.key = qs.ques_id), (qs.create_at = timeFormat(qs.create_at))));
    const columns = [
      {
        title: 'id',
        dataIndex: 'ques_id',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '头像',
        dataIndex: 'avatar',
        render: img => <img src={img} alt="img" style={{ width: '40px' }} />,
      },
      {
        title: '问题',
        dataIndex: 'ques',
      },
      // {
      //   title: '提问时间',
      //   dataIndex: 'create_at',
      // },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <Popconfirm title="Sure to cancel?" onConfirm={() => this.deleteList(record.key)}>
              <Button type="danger" size="small">
                删除
              </Button>
            </Popconfirm>
          );
        },
      },
    ];
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Table
            bordered
            dataSource={ques}
            columns={columns}
            rowClassName="editable-row"
            // pagination={{ defaultCurrent: 1, total: 20 }}
            scroll={{ x: 1000 }}
            expandedRowRender={record => <ExpandedReplys ques_id={record.ques_id} />}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Question;
