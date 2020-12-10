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
  message,
} from 'antd';
import { saveAs } from 'file-saver';
import { timeFormat } from '../../utils/utils';
import styles from './Orders.less';

const RESOURCE = 'order';

@connect(
  ({ order: order, loading }) => ({
    order,
    loading: loading.effects[`${RESOURCE}/query`],
  }),
  dispatch => ({
    // deleLists(deleOne, callback) {
    //   dispatch({
    //     type: `${RESOURCE}/deleLists`,
    //     payload: { key: deleOne },
    //     callback,
    //   });
    // },
    set_orderStatus(params) {
      return dispatch({ type: `${RESOURCE}/set_orderStatus`, payload: params });
    },
  })
)
@Form.create()
export default class Orders extends Component {
  state = {
    selectedRows: [],
    editingKey: '',
  };

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '订单id',
        dataIndex: 'order_id',
      },
      {
        title: '订单编号',
        dataIndex: 'order_no',
      },
      {
        title: '收货人姓名',
        dataIndex: 'consignee',
      },
      {
        title: '收货人联系方式',
        dataIndex: 'phone',
      },
      {
        title: '收货人地址',
        dataIndex: 'address',
      },

      {
        title: '商品信息',
        width: '20%',
        dataIndex: 'productions',
        render: (text, record) => (
          <div>
            {record.productions.map(item => (
              <div key={item.id}>
                <span>
                  {item.name} x {item.number}
                </span>
              </div>
            ))}
          </div>
        ),
      },
      {
        title: '订单总价(积分)',
        dataIndex: 'price',
      },
      {
        title: '下单时间',
        dataIndex: 'create_at',
        render: (txt, record) => <span>{timeFormat(record.create_at)}</span>,
      },
      {
        title: '操作',
        render: (txt, record, idx) => {
          return (
            <span>
              <Button
                onClick={() => this.set_orderStatus(record)}
                size="small"
                disabled={record.status === 1 ? true : false}
              >
                {record.status === 1 ? '已发货' : '未发货'}
              </Button>
              {/* <Divider type="vertical" /> */}
              {/* <Popconfirm
                title="将删除该订单及其任何相关信息"
                okText="删除"
                cancelText="取消"
                onConfirm={() => this.deleteList(record.id)}
              >
                <Button type="danger" size="small">
                  删除
                </Button>
              </Popconfirm> */}
            </span>
          );
        },
      },
    ];
  }
  // deleteList = key => {
  //   let deleOne = [];
  //   deleOne.push(key);
  //   const callback = () => {
  //     this.setState({
  //       selectedRows: [],
  //     });
  //   };
  //   this.props.deleLists(deleOne, callback);
  // };

  set_orderStatus = record => {
    this.props.set_orderStatus(record);
  };

  handleChange = (value, list) => {
    list =
      value === '1'
        ? list.filter(item => {
            return item.status === 0;
          })
        : list;
    let str =
      '序号,订单编号,创建订单时间,总价(积分),订单状态,商品信息,收货人姓名,联系方式,收货地址\n';
    for (const i in list) {
      let prodStr = '';
      list[i].productions.forEach(item => {
        prodStr += `${item.name} x ${item.number};`;
      });
      const status = list[i].status === 1 ? '已发货' : '未发货';
      str += `${i * 1 + 1},${list[i].order_no},${timeFormat(list[i].create_at)},${
        list[i].price
      },${status},${prodStr},${list[i].consignee},${list[i].phone},${list[i].address}\n`;
    }
    let exportContent = '\uFEFF';
    let blob = new Blob([exportContent + str], {
      type: 'application/vnd.ms-excel;',
    });
    saveAs(blob, 'order.csv');
    message.info('导出成功');
  };
  // exportOrder = (list) => {
  //   let str = '序号,订单编号,创建订单时间,总价(积分),订单状态,商品信息,收货人姓名,联系方式,收货地址\n';
  //   for (const i in list) {
  //       let prodStr = '';
  //       list[i].prods.forEach(item => {
  //         prodStr += `${item.name} x ${item.count};`
  //       })
  //       const status = list[i].status === 1 ? '已发货':'未发货';
  //       str += `${i+1},${list[i].order_number},${list[i].date},${list[i].price},${status},${prodStr},${list[i].receiver.name},${list[i].receiver.phone},${list[i].receiver.address}`
  //   }
  //   let exportContent = "\uFEFF";
  //   let blob = new Blob([exportContent + str], {
  //     type: "application/vnd.ms-excel;"
  //   });
  //   saveAs(blob, "order.csv");
  // }
  render() {
    const { loading, order } = this.props;
    const { list } = order;
    list.map(rs => (rs.key = rs.order_id));

    return (
      <PageHeaderLayout title="商城订单">
        <Card bordered={false} className={styles.card}>
          <Select
            placeholder="选择导出订单类型"
            style={{ width: 200, marginBottom: 20 }}
            onChange={value => this.handleChange(value, list)}
          >
            <Select.Option value="1">导出未发货订单</Select.Option>
            <Select.Option value="2">导出所有订单</Select.Option>
          </Select>
          <div>
            <Table
              loading={loading}
              rowKey="order_id"
              dataSource={list}
              columns={this.columns}
              onChange={e => console.log(e)}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
