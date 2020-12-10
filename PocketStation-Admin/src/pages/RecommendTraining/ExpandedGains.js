import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import { timeFormat } from '@/utils/utils';

@connect(
  ({ recommendtrainings }) => ({ recommendtrainings }),
  dispatch => ({
    changeEssence(course_id) {
      dispatch({ type: 'recommendtrainings/changeEssence', payload: course_id });
    },
  })
)
class ExpandedGains extends Component {
  changeEssence = gains_id => {
    this.props.changeEssence({ gains_id, course_id: this.props.course_id });
  };
  render() {
    let { gains } = this.props.recommendtrainings;
    console.log(gains);
    gains.map(gs => (gs.key = gs.id));
    const columns = [
      {
        title: '心得id',
        dataIndex: 'id',
      },
      {
        title: '经销商姓名',
        dataIndex: 'dealer.name',
      },
      {
        title: '经销商头像',
        dataIndex: 'dealer.avatar',
        render: img => <img src={img} alt="img" style={{ width: '40px' }} />,
      },
      {
        title: '心得标题',
        dataIndex: 'title',
      },
      {
        title: '心得内容',
        dataIndex: 'content',
      },
      // {
      //   title: '发表时间',
      //   dataIndex: 'create_at',
      // },
      {
        title: '是否为精华心得',
        render: (text, record) => {
          console.log(record.type);
          return (
            <Button onClick={() => this.changeEssence(record.id)} size="small">
              {record.type ? '精华心得' : '心得'}
            </Button>
          );
        },
      },
    ];
    return <Table dataSource={gains} columns={columns} />;
  }
}

export default ExpandedGains;
