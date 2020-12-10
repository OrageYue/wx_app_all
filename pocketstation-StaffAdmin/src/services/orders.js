import requestV2 from '../utils/requestV2';

export async function queryOrders() {
  return requestV2(`/api/v2/get/all/orders/`);
  // return [
  //   {
  //     id: 1,
  //     order_number: 201900319001,
  //     receiver: {
  //       name: '张三',
  //       phone: 13827412314,
  //       address: 'xx省 xx市 xx区 xx街道 xx路 xx号 xx栋 xx单元 xx',
  //     },
  //     prods: [
  //       {
  //         id: 1,
  //         name: '商品1',
  //         count: 2,
  //       },{
  //         id: 2,
  //         name: '商品2',
  //         count: 1,
  //       }
  //     ],
  //     price: 430,
  //     date: '2019/03/19',
  //     status: 0,
  //   },
  //   {
  //     id: 2,
  //     order_number: 201900319001,
  //     receiver: {
  //       name: '张三',
  //       phone: 13827412314,
  //       address: 'xx省 xx市 xx区 xx街道 xx路 xx号 xx栋 xx单元 xx',
  //     },
  //     prods: [
  //       {
  //         id: 3,
  //         name: '商品3',
  //         count: 1,
  //       },{
  //         id: 4,
  //         name: '商品4',
  //         count: 1,
  //       }
  //     ],
  //     price: 200,
  //     date: '2019/03/20',
  //     status: 1,
  //   },
  // ]
}

export async function set_orderStatus({ order_id }) {
  return requestV2(`/api/v2/status/order/${order_id}/`);
}

// export async function remove(id) {
//   return requestV2(``, {
//     method: 'DELETE',
//   });
// }
