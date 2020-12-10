import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import { timeFormat } from '@/utils/utils';
import { RSA_X931_PADDING } from 'constants';

@connect(
  ({ ques }) => ({ ques }),
  dispatch => ({
    getReplys(ques_id) {
      dispatch({ type: 'ques/queryReplys', payload: ques_id });
    },
  })
)
class ExpandedReplys extends Component {
  componentDidMount() {
    let { ques_id, getReplys } = this.props;
    getReplys(ques_id);
  }
  render() {
    let { replys } = this.props.ques;
    replys.forEach(rs => {
      rs.key = rs.reply_id;
      // rs.create_at = timeFormat(rs.create_at);
    });
    const columns = [
      {
        title: '回复id',
        dataIndex: 'reply_id',
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
      // {
      //   title: '回复时间',
      //   dataIndex: 'create_at',
      // },
    ];
    return (
      <Table
        dataSource={replys}
        columns={columns}
        expandedRowRender={record => <div style={{ margin: 0 }}>{record.reply}</div>}
      />
    );
  }
}

export default ExpandedReplys;
