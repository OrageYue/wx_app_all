import React, { Component } from 'react';
import { Flex, Modal, List, Button, TextareaItem } from 'antd-mobile';
import styles from './index.less';
import { createForm } from 'rc-form';

class QAPanel extends Component {
  getValue = () => {
    const value = this.props.form.getFieldsValue();
    const { question } =  value;
    return question;
  }
  clearInp =() => {
    this.refs.el.clearInput();
  }
  render() {
    const { showModal, onClose, showFlag, onSubmit } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <Flex direction="column" className={styles.askContainer}>
        <Flex className={styles.askBtn} justify="center" onClick={showModal}>提问</Flex>
        <Modal
          onClose={()=>onClose(this.clearInp)}
          popup
          visible={showFlag}
          animationType="slide-up"
        >
          <List renderHeader={() => <div>请输入您的问题</div>} className="popup-list">
            <List.Item>
              <TextareaItem
              {...getFieldProps('question')}
              placeholder="我的问题"
              autoHeight
              ref='el'
              clear
              onBlur={this.getValue}
              />
            </List.Item>
            <List.Item>
              <Button type="primary" onClick={() => onSubmit(this.getValue(),this.clearInp)}>提交</Button>
            </List.Item>
          </List>
        </Modal>
      </Flex>
    )
  }
}

const QAPanelWrapper = createForm()(QAPanel);

export default QAPanelWrapper

// export default QAPanel;