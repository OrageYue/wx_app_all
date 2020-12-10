import { Component, Fragment } from 'react';
import { connect } from 'dva';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandartTable from '../../components/StandardTable';

import {
  message,
  DatePicker,
  Divider,
  Button,
  Card,
  Dropdown,
  Menu,
  Icon,
  Form,
  Input,
  Modal,
  Select,
  Popconfirm,
} from 'antd';

import styles from './GratitudeStar.less';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
@connect(
  ({ staff: { staffs }, gratitude_star: { gratitude_stars }, loading }) => ({
    staffs,
    gratitude_stars,
    loading: loading.effects['gratitude_star/query'],
    adding: loading.effects['gratitude_star/add'],
  }),
  dispatch => ({
    getGratitudeStars() {
      return dispatch({ type: 'gratitude_star/getGratitudeStars' });
    },
    addGratitudeStars(params) {
      console.log(params);
      return dispatch({ type: 'gratitude_star/addGratitudeStars', payload: params });
    },
  })
)
@Form.create()
class GratitudeStar extends Component {
  state = {
    selectedRows: [],
    modalNewVisible: false,
  };

  handleSelectRow = rows => {
    this.setState({ selectedRows: rows });
  };

  componentWillUpdate() {}

  handleNewGSModelVisible() {
    const { modalNewVisible } = this.state;
    this.setState({
      modalNewVisible: !modalNewVisible,
    });
  }

  handleNewGS_OK() {
    const { form, addGratitudeStars } = this.props;
    // console.log( form.fieldsValue.staff_id)
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // antd@2.0 之后，时间类组件的 value 改为 moment 类型，所以在提交前需要预处理。
      const values = {
        ...fieldsValue,
        year_month: fieldsValue['year_month'].format('YYYY.MM'),
      };

      const staff_id = values.staff_id;
      const year_month = values.year_month;
      const value = {
        staff_id: staff_id,
        year_month: year_month,
      };
      console.log(year_month);
      addGratitudeStars(value).then(() => {
        // 提交并且关闭

        this.handleNewGSModelVisible();
        form.resetFields();
      });
    });
  }

  render() {
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '员工ID',
        dataIndex: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'staff.name',
      },
      {
        title: '获取时间',
        dataIndex: 'year_month',
      },
    ];
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    const { loading, form, adding, gratitude_stars, staffs } = this.props;
    // const gratitudestars = [gratitude_stars]
    // console.log(gratitude_stars);
    const { modalNewVisible } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 8,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 16,
        },
      },
    };
    return (
      <PageHeaderLayout title="感恩之心">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="setting" type="primary" onClick={() => this.handleNewGSModelVisible()}>
                设置感恩之心
              </Button>
            </div>
            <Card loading={loading} type="inner" title="感恩之星">
              <p>编号：No. {gratitude_stars.id}</p>
              <p>
                日期：
                <span>{gratitude_stars.year_month}</span>
              </p>
              <p>
                员工姓名：
                {gratitude_stars.staff && (
                  <Fragment>
                    <img
                      alt={'avatar'}
                      src={gratitude_stars.staff.avatar}
                      width={36}
                      height={36}
                      style={{ borderRadius: 18 }}
                    />
                    <span style={{ marginLeft: 8 }}>{gratitude_stars.staff.name}</span>
                  </Fragment>
                )}
              </p>
              <p>
                员工职位:
                {gratitude_stars.staff && (
                  <Fragment>
                    {/* <span> {gratitude_stars.staff.pos.bu.name} - {gratitude_stars.staff.pos.name}</span> */}
                    <span>
                      {' '}
                      {gratitude_stars.bu.name} - {gratitude_stars.pos.name}
                    </span>
                  </Fragment>
                )}
              </p>
              <p>
                员工编号：
                <span>
                  {gratitude_stars.staff
                    ? // ? gratitude_stars.staff.pos.id
                      gratitude_stars.staff.id
                    : null}
                </span>
              </p>
            </Card>
            {/* <StandartTable

              rowKey="id"
              selectedRows={selectedRows}
              onSelectRow={this.handleSelectRow}
              loading={loading}
              data={{list: gratitudestars }}
              columns={columns}
              onChange={e => console.log(e)}
            /> */}
          </div>

          <Modal
            title="设置感恩之星"
            visible={modalNewVisible}
            onOk={() => this.handleNewGS_OK()}
            onCancel={() => this.handleNewGSModelVisible()}
            confirmLoading={adding}
          >
            <Form.Item {...formItemLayout} label="员工">
              {form.getFieldDecorator('staff_id', {
                rules: [
                  {
                    required: true,
                    message: 'Please select staff_id...',
                  },
                ],
              })(
                <Select
                  style={{
                    width: 160,
                  }}
                  showSearch
                >
                  {staffs.map(staff => (
                    <Select.Option key={staff.id} value={staff.id}>
                      <span>{staff.id}</span>
                      <span>{staff.name}</span>
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item {...formItemLayout} label="日期">
              {form.getFieldDecorator('year_month', {
                rules: [
                  {
                    required: true,
                    message: 'Please input data...',
                  },
                ],
              })(<DatePicker placeholder="请选择时间" />)}
            </Form.Item>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default GratitudeStar;
