import { Flex } from "antd-mobile";
import PropTypes from "prop-types";
import styles from './index.less';
import { timeFormat } from '../../utils/utils';

function TrainingGainsCard({ dealer, title, content, create_at }) {
  const { name, avatar } = dealer;
  return (
    <Flex align='stretch' justify="start" className={styles.card_container}>
      <img src={avatar} alt={avatar} className={styles.right_img}/>
      <Flex direction="column" align="start" justify="start" className={styles.card_right}>
        <h4 className={styles.name}>{name}</h4>
        <Flex justify="between" className={styles.position}>
          <span>{timeFormat(create_at)}</span>
        </Flex>
        <p>{content}</p>
      </Flex>
    </Flex>
  );
}

TrainingGainsCard.propTypes = {
  img: PropTypes.string,
  title: PropTypes.string, 
  dealer: PropTypes.object, 
  content: PropTypes.string,
  create_at: PropTypes.string, 
};

export default TrainingGainsCard;
