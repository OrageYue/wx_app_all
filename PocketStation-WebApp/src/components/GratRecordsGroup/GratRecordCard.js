import { Flex } from 'antd-mobile';
import styles from './GratRecordCard.less';

function GratRecordCard({ content, staff_from, staff_to }) {
  const { name: from_name, avatar: from_avatar } = staff_from;
  const { name: to_name, avatar: to_avatar } = staff_to;

  function staff({name, avatar}) {
   return (
    <Flex className={styles.CardStaff} direction="column" align="center" justify="center">
      <img src={avatar} alt={avatar} />
      <span>{name}</span>
    </Flex>
   )
  }

  return (
    <Flex justify="between" className={styles.Card}>
      { staff({name: from_name, avatar: from_avatar }) }
      <Flex className={styles.content}>{content}</Flex>
      { staff({name: to_name, avatar: to_avatar }) }
    </Flex>
  )
}

export default GratRecordCard;