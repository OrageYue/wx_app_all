import PropTypes from "prop-types";
import CustomIcon from '../CustomIcon';
import { Flex, Button, List } from "antd-mobile";
import styles from "./item.less";

function Item({ title, enter, view, download }) {

  function createBtnGroup() {
    return (
      <Flex justify='end'>
        {view && <Button size='small' inline onClick={view} className={styles.btn_view} icon={<CustomIcon icon='view' />} />}
        {download && <Button size='small' inline onClick={download} className={styles.btn_download} icon={<CustomIcon icon='download' />} />}
      </Flex>
    )
  }


  const props = {
    arrow: enter ? 'horizontal' : null,
    onClick: enter,
  }

  return (
    <List.Item {...props} extra={createBtnGroup()}>{title}</List.Item>
  )
}

Item.propTypes = {
  title: PropTypes.string,
  enter: PropTypes.func,
  view: PropTypes.func,
  download: PropTypes.func,
}

export default Item;