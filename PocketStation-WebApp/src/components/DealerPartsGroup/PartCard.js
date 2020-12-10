import { Flex } from 'antd-mobile'; 
import styles from './PartCard.less';
import PropTypes from 'prop-types';


function PartCard({ title, img, onClick }) {
  return (
    <Flex direction="column" justify="center" align="center" className={styles.container} onClick={onClick}>
      <img src={img} alt={title}/>
      <h4 style={{fontSize: '12px'}}>{title}</h4>
    </Flex>
  );
}

PartCard.propTypes = {
  title: PropTypes.string,
  img: PropTypes.string,
  onClick: PropTypes.func,
};

export default PartCard;
