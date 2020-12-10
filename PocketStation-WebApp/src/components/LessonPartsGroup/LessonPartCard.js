import styles from './LessonPartCard.less';
import { Flex } from 'antd-mobile';
import PropTypes from 'prop-types';


function LessonPartCard({ onClick, title, img }) {
  return (
    <Flex className={styles.container} direction="column" justify="around" align="center" onClick={onClick}>
      <img src={img} alt={title}/>
      <span>{title}</span>
    </Flex>
  );
}

LessonPartCard.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string,
  img: PropTypes.string,
};

export default LessonPartCard;
