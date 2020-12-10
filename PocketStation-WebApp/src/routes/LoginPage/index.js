import React, {Component} from 'react';
import {connect} from 'dva';
import {
  Button,
  Toast,
  ActivityIndicator,
  Flex,
  SegmentedControl,
  WhiteSpace
} from 'antd-mobile';
import styles from './index.less';
import {isEmail} from "../../utils/utils";
import {routerRedux} from 'dva/router';

class LoginPage extends Component {
  use_dispatch = true;
  state = {
    type: 'staff',
    selectedIndex: 0
  }

  // 依据token 与 openid数据判断，是否需要绑定email needBindEmail = () => {   const { token,
  // openid } = this.props;   return openid && !token; }
  needBindEmail = () => {
    const {token} = this.props;
    return !token;
  }

  onValueChange = (value) => {
    let type = '';
    let selectedIndex = '';
    if (value === '员工') {
      type = 'staff';
      selectedIndex = 0;
    } else {
      type = 'dealer';
      selectedIndex = 1;
    }
    this.setState({type, selectedIndex})
  }

  /**
   * render Bind Email View
   */
  renderBind() {
    const {bindEmail, getIsUser} = this.props;
    const {selectedIndex, type} = this.state;
    return (
      <div className={styles.normal} >
        <img className={styles.bg} src='/new_bg.png' width="100%" height="100%" />
        <Flex className={styles.normal} align="center" justify="center" direction='column'>
          <Flex justify='center' >
            <img src='/title_logo.png' className={styles.titlelogo} />
          </Flex>

          <Flex direction="column" align="center" >

            <Flex direction="column" className={styles.bottomcontent}>
              <SegmentedControl
             
                className={styles.choiceType}
                values={['员工', '经销商']}
                onValueChange={this.onValueChange}
                selectedIndex={selectedIndex}/>
              <WhiteSpace size="lg"/>
              <WhiteSpace size="lg"/>
              <WhiteSpace size="lg"/>
              <WhiteSpace size="lg"/>
              <Flex style={{width:'100%'}}>
                {/* <Flex className={styles.txt}>邮箱</Flex> */}
                <input className={styles.inp} type="text" ref="email" placeholder='请输入邮箱'/>
              </Flex>
            </Flex>
            <Button
              loading={this.props.binding}
              type="primary"
              size="small"
              style={{
                marginTop: '40px',
                paddingTop: '5px',
                fontSize: '16px',
                width: '100%',
                height: '40px'
            }}
              onClick={() => bindEmail(this.refs.email.value, this.state.type)}>绑定邮箱</Button>

          </Flex>

        </Flex>

      </div>

    );
  }

  /**
   * render Login View
   */
  renderLogin() {
    const {goDealerHome, goStaffHome} = this.props;
    return (
      <div className={styles.normal}>
        {this.props.logging
          ? <ActivityIndicator toast text="正在登录"/>
          : <Flex direction="column" justify="center" className={styles.loginBox}>
            <Button
              type="primary"
              size="small"
              style={{
              padding: '0 20px',
              fontSize: '16px'
            }}
              onClick={goStaffHome}>员工</Button>
            <Button
              type="primary"
              size="small"
              style={{
              marginTop: '20px',
              fontSize: '16px',
            }}
              onClick={goDealerHome}>经销商</Button>
          </Flex>
}
      </div>
    )
  }

  render() {
    return this.needBindEmail()
      ? this.renderBind()
      : this.renderLogin();
  }

}

// state => props
const mapStateToProps = ({user, loading}) => {
  return {token: user.token, openid: user.openid, logging: loading.effects['user/getTokens'], binding: loading.effects['user/userBind']}
}

// dispatch action => props
const mapDispatchToProps = (dispatch) => ({

  bindEmail: function (email, type) {
    if (!isEmail(email)) {
      Toast.info('邮箱格式错误');
    } else {
      return dispatch({
        type: 'user/userBind',
        payload: {
          email,
          type
        }
      })
    }
  },

  goStaffHome() {
    dispatch(routerRedux.push('/staff/index'));
  },

  goDealerHome () {
    console.log('点击经销商小程序')
    dispatch(routerRedux.push('/dealer/index'));
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
