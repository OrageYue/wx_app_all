import PropTypes from 'prop-types';
import { Flex } from 'antd-mobile';
import styles from './OperationItem.less';

function OperationItem({ onGoLsnPage, children }) {
  children = children.slice(0, 4);
  let view = 123;
  return (
    <Flex justify="between" wrap="wrap" className={styles.cardWrap}>
    	{children && children.map( ({ id, img_src, name, type }) => (
          <Flex className={styles.card} key={id}>
            <img src={img_src} alt={img_src} />
            <Flex className={styles.mask} justify="center" align="center" onClick={() => onGoLsnPage(id)}>
              {
                type==='video'? <i className="iconfont icon-shipin"></i> : null
              }
              <span className={styles.lesson_name}>{name}</span>
              <p className={styles.lesson_view}><i className="iconfont icon-yonghu"></i>{view}</p>
            </Flex>
          </Flex>
        ))
      }
    </Flex>
    
  );
}

OperationItem.propTypes = {
  id: PropTypes.number,
  onGoLsnPage: PropTypes.func,
  name: PropTypes.string,
  cover_img: PropTypes.string,
};

export default OperationItem;


