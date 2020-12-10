
import { Flex } from 'antd-mobile';
import styles from './Card.less';

function Card({ lesson }) {
  let { img, name, type, onClick } = lesson;
  const view = 120;
  return (
    <Flex className={styles.card}>
      <img src={img} alt={img} />
      <Flex className={styles.mask} justify="center" onClick={onClick}>
        {
          type === 'video' ? <i className="iconfont icon-shipin"></i> : null
        }
        <span className={styles.lesson_name}>{name}</span>
        <p className={styles.lesson_view}><i className="iconfont icon-yonghu"></i>{view}</p>
      </Flex>
    </Flex>
  )
}

export default Card;