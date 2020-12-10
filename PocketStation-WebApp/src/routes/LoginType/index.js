import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Toast, Flex } from 'antd-mobile';
import styles from '../LoginPage/index.less';
import { routerRedux } from 'dva/router';
import { loginCounts } from '../../services/user';


class LoginTypePage extends Component {

  /**
   * select Type
   */
  renderLoginType() {
    const { goDealerHome, goStaffHome, type, id } = this.props;
    return (
      <div className={styles.normal} >
        <img className={styles.bg} src='/new_bg.png' width="100%" height="100%" />
        <Flex direction="column" justify="center" className={styles.loginBox}>
          <img className={styles.bg} src='/new_bg.png' width="100%" height="100%" />
          <Button type="primary" size="small" style={{ padding: '0 20px', fontSize: '16px' }} onClick={() => goStaffHome({type, id})} >员工</Button>
          <Button type="primary" size="small" style={{ marginTop: '20px', fontSize: '16px' }} onClick={() => goDealerHome({type, id})} >经销商</Button>
        </Flex>
      </div>
    )
  }

  render() {
    return this.renderLoginType();
  }

}

// state => props
const mapStateToProps = ({ user }) => {
  return {
    type: user.type,
    id: user.id,
  }
}

// dispatch action => props
const mapDispatchToProps = (dispatch) => ({

  goStaffHome({type, id}) {
    type === 'dealer'? Toast.info('您没有权限'):
    loginCounts( {types: type, id} );
    dispatch(routerRedux.push('/staff/index'));
  },

  goDealerHome ( { type, id } ) {
    console.log( '经销商小程序' )
    window.wx.checkJsApi({
  jsApiList: ['previewImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
      success: function ( res ) {
        console.log( res )
        console.log('返回数据')
  // 以键值对的形式返回，可用的api值true，不可用为false
  // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
  }
});
    // window.wx.miniProgram.navigateTo({url: '/path/to/page'})
    // loginCounts( {types: type, id} );
    // dispatch(routerRedux.push('/dealer/index'));
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(LoginTypePage);
