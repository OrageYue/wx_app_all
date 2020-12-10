import { Flex } from "antd-mobile";
import styles from "./UriBar.js";
import PropTypes from "prop-types";
import CustomIcon from "../CustomIcon";


/**
 * Resource Panel 的Uri地址栏，包含一个返回按钮
 * 当back存在时，且uri长度大于0时才会渲染返回按钮
 */
function UriBar({ uri, back }) {

  return (
    <Flex justify='between' style={{ width: '100%' }} className={styles.uri_bar}>
      <span>{'/ ' + [ ...uri].join(' / ')}</span>
      {back && uri.length>0 && <span onClick={back}>
        <CustomIcon icon='back'/>
      </span>}
    </Flex>
  )
}
UriBar.propTypes = {
  // 地址
  uri: PropTypes.arrayOf(PropTypes.string),
  // 返回方法
  back: PropTypes.func,
}

export default UriBar;