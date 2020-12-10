import { Flex, Icon } from 'antd-mobile';
import { formatLessonPartsImageUrl } from "../../utils/dev";
import styles from './ToolsItem.less';

function ToolsItem({ list: { id, name, type, content }, onClick, listType, onDownload }) {

  return (
    <Flex key={id} className={styles.lsn_container}  direction="column" align="start">
      <span className={styles.title}>{name}</span>
      <Flex align="center" justify="between" className={styles.card_B}>
        <Flex className={styles.card_Bl}>
          <span>{`${listType}: ${type}`}</span>
        </Flex>
        <Flex className={styles.card_BR}>
          {type==='video'?<Icon type="right" onClick={() => onClick(id)} />:
            <Flex>
              <i className='iconfont icon-xiazai' onClick={() => onDownload(formatLessonPartsImageUrl(content) ) }></i>
              <Icon type="right" onClick={() => onClick(id)} />
            </Flex>
          }
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ToolsItem;