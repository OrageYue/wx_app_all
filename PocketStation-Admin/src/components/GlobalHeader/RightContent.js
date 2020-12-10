import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Spin, Menu, Icon, Dropdown } from 'antd';
import SelectLang from '../SelectLang';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {
  render() {
    const { currentUser, onMenuClick, theme } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {currentUser ? (
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Icon type="user" style={{ fontSize: '16px', marginBottom: '6px' }} />
              <span className={styles.name}>{currentUser}</span>
            </span>
          </Dropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        <SelectLang className={styles.action} />
      </div>
    );
  }
}
