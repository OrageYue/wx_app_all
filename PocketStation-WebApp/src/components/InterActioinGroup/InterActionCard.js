import { Flex, WingBlank } from 'antd-mobile';
import styles from './InterActionCard.less';
const InterActionCard = ({onCardClick, name, avatar, reply, ques, create_at}) => {
  return (
   <WingBlank size="lg" className={styles.wrap}>
    <Flex justify="start" className={styles.card} onClick={onCardClick}>
      <Flex align="center">
        <img className={styles.avatar} src={avatar} alt={avatar}/>
      </Flex>
      <Flex className={styles.cardR} direction="column" align="start" justify="between" >
        <span className={styles.title}>{ques}</span>
        <Flex justify="between" className={styles.right_bottom}>
          <span>{name}</span>
          <Flex className={styles.right} justify="around">
            <Flex className={styles.reply}><i className="iconfont icon-xiaoxi"></i><span>{reply}</span></Flex>
            <span>{create_at}</span>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
   </WingBlank>
  )
}
export default InterActionCard


 