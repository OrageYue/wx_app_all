import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Popconfirm, Form, Button, Card, Upload, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import { host_v1, UploadURL } from '../../constants';

const FormItem = Form.Item;
const { Consumer, Provider } = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <Provider value={form}>
    <tr {...props} />
  </Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    imgLoading: false,
    imageUrl: '',
  };
  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  handleImgChange = info => {
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.setState({
        // imageUrl: host_v1 + info.file.response.files[0].thumbnailUrl,
        imageUrl: host_v1 + info.file.response,
        // imgUrl2: info.file.name,
        imgLoading: false,
      });
    }
  };

  getInput = (form, dataIndex, record) => {
    // if (dataIndex === 'cover_img') {
    return form.getFieldDecorator(dataIndex, {
      // valuePropName: 'fileList',
      getValueFromEvent: this.normFile,
      initialValue: record[dataIndex],
    })(
      <Upload
        name="file"
        listType="picture-card"
        // className="avatar-uploader"
        showUploadList={false}
        // action="//jsonplaceholder.typicode.com/posts/"
        action={UploadURL}
        // beforeUpload={beforeUpload}
        onChange={this.handleImgChange}
      >
        {this.state.imageUrl ? (
          <img src={this.state.imageUrl} alt="" width="60px" />
        ) : (
          <Icon type={this.state.imgLoading ? 'loading' : 'plus'} />
        )}
      </Upload>
    );
    // }
  };

  render() {
    const { editing, dataIndex, title, name, inputType, record, index, ...restProps } = this.props;
    return (
      <Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem>{this.getInput(form, dataIndex, record)}</FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </Consumer>
    );
  }
}

@connect(
  ({ dealer_carousel }) => ({ dealer_carousel }),
  dispatch => ({
    getCarouselList() {
      dispatch({ type: 'dealer_carousel/getCarousels' });
    },
    editList(params) {
      dispatch({ type: 'dealer_carousel/editList', payload: params });
    },
    deleLists(deleOne, callback) {
      dispatch({
        type: 'dealer_carousel/deleLists',
        payload: { key: deleOne },
        callback,
      });
    },
    postCarousel(fieldsValue) {
      console.log(fieldsValue);
      dispatch({ type: 'dealer_carousel/postCarousel', payload: fieldsValue });
    },
  })
)
class DealerCarousel extends Component {
  state = {
    editingKey: '',
    visible: false,
    fileList: [],
    previewVisible: false,
    previewImage: '',
    imgUrl1: '',
    imgUrl2: '',
  };
  componentDidMount() {
    this.props.getCarouselList();
  }
  columns = [
    {
      title: '图片id',
      dataIndex: 'id',
      editable: false,
    },
    {
      title: '轮播图片',
      dataIndex: 'cover_img',
      editable: true,
      render: img => <img src={img} alt="img" style={{ width: '34px' }} />,
    },
    // {
    //   title: '轮播内容',
    //   dataIndex: 'content',
    //   editable: true,
    //   render: img => <img src={img} alt="img" style={{ width: '34px' }} />,
    // },
    {
      title: '操作',
      render: (text, record) => {
        const editable = this.isEditing(record);
        return (
          <div>
            {editable ? (
              <span>
                <Consumer>
                  {form => (
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => this.save(form, record.key)}
                      style={{ marginRight: 8 }}
                    >
                      保存
                    </Button>
                  )}
                </Consumer>
                <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                  <Button size="small">取消</Button>
                </Popconfirm>
              </span>
            ) : (
              <div>
                <Button
                  onClick={() => this.edit(record.key)}
                  size="small"
                  style={{ marginRight: '8px' }}
                >
                  编辑
                </Button>
                {/* <Button onClick={() => this.deleteList(record.key)}>删除</Button> */}
                {/* <Popconfirm title="Sure to cancel?" onClick={() => this.deleteList(record.key)}>
                  <Button>删除</Button>
                </Popconfirm> */}
                <Popconfirm title="Sure to cancel?" onConfirm={() => this.deleteList(record.key)}>
                  <Button type="danger" size="small">
                    删除
                  </Button>
                </Popconfirm>
              </div>
            )}
          </div>
        );
      },
    },
  ];
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
    return record.key === this.state.editingKey;
  };
  edit(key) {
    this.setState({ editingKey: key });
  }
  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      console.log(row);
      let { cover_img, content } = row;

      if (Array.isArray(cover_img)) {
        // row.cover_img = host_v1 + cover_img[cover_img.length - 1].response.files[0].url;
        row.cover_img = host_v1 + cover_img[cover_img.length - 1].response;
        // row.cover_img = cover_img[0].name;
      }
      if (Array.isArray(content)) {
        // row.content = host_v1 + content[content.length - 1].response.files[0].url;
        row.content = host_v1 + content[content.length - 1].response;
        // row.content = content[0].name;
      }
      console.log(row);
      this.props.editList({ id: key, data: row });
      this.setState({ editingKey: '' });
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  addImg = () => {
    this.setState({
      visible: true,
    });
  };
  handleCarousel_OK = () => {
    // let { imgUrl1, imgUrl2 } = this.state;

    // const params = { cover_img: imgUrl1, content: imgUrl2 };
    // this.props.postCarousel(params);
    // this.setState({ visible: false });
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue);
      const { cover_img, content } = fieldsValue;
      let img_content = [];
      if (Array.isArray(cover_img)) {
        fieldsValue.cover_img = host_v1 + cover_img[cover_img.length - 1].response;
      }
      if (Array.isArray(content)) {
        content.forEach(itm => {
          img_content.push(host_v1 + itm.response);
        });
      }
      fieldsValue.content = JSON.stringify(img_content);
      this.props.postCarousel(fieldsValue);
      this.setState({ visible: false });
    });
  };
  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  handleImgChange = info => {
    if (info.file.status === 'done') {
      console.log(info.file);
      // Get this url from response in real world.
      this.setState({
        // imgUrl1: host_v1 + info.file.response.files[0].url,
        imgUrl1: host_v1 + info.file.response,
        // imgUrl1: info.file.name,
      });
    }
  };

  handleImgChange2 = info => {
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.setState({
        // imgUrl2: host_v1 + info.file.response.files[0].thumbnailUrl,
        imgUrl2: host_v1 + info.file.response,
        // imgUrl2: info.file.name,
        // imgLoading: false,
      });
    }
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleModalCancel = () => this.setState({ previewVisible: false });
  render() {
    const { form } = this.props;
    let { carousels } = this.props.dealer_carousel;
    carousels.map(cs => (cs.key = cs.id));
    let { fileList, previewVisible, previewImage } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
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
          inputType:
            col.dataIndex === 'cover_img' || col.dataIndex === 'content' ? 'image' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Button
            icon="plus"
            type="primary"
            style={{ marginBottom: '20px' }}
            onClick={() => this.addImg()}
          >
            添加
          </Button>
          <Modal
            title="添加轮播"
            visible={this.state.visible}
            onOk={this.handleCarousel_OK}
            onCancel={this.handleCancel}
          >
            <Form.Item {...formItemLayout} label="轮播封面">
              {form.getFieldDecorator('cover_img', {
                // valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
                rules: [{ required: true }],
              })(
                <Upload
                  name="file"
                  listType="picture-card"
                  // className="avatar-uploader"
                  showUploadList={false}
                  // action="//jsonplaceholder.typicode.com/posts/"
                  action={UploadURL}
                  // beforeUpload={beforeUpload}
                  onChange={this.handleImgChange}
                >
                  {this.state.imgUrl1 ? (
                    <img src={this.state.imgUrl1} alt="" width="60" />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="图文" extra="按顺序上传">
              {form.getFieldDecorator('content', {
                getValueFromEvent: this.normFile,
                rules: [{ required: true }],
              })(
                <Upload
                  name="file"
                  showUploadList={true}
                  action={UploadURL}
                  onChange={this.handleImgChange2}
                  multiple={true}
                >
                  <Button>
                    <Icon type="upload" /> 上传
                  </Button>
                </Upload>
              )}
            </Form.Item>
          </Modal>
          <Table
            components={components}
            bordered
            dataSource={carousels}
            columns={columns}
            rowClassName="editable-row"
            // pagination={{ defaultCurrent: 1, total: 20 }}
            // scroll={{ x: 1000 }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const WrappedDealerCarousel = Form.create()(DealerCarousel);

export default WrappedDealerCarousel;
