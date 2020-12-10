import PropTypes from 'prop-types';
import { Flex, Button } from 'antd-mobile';
import styles from './Item.less';

function ResourcesListItem({ listType, name, type, GoExamination, passed, id }) {
  
  return (
    <Flex className={styles.titleWrap} direction="column" justify="around" align="start" >
      <div className={styles.title}>{name}</div>
      <div>
        {listType}:
        {listType==='课程类型'?type==='video'?'视频':'图文':type}
      </div>
      <Flex justify="end" style={{width:"100%","marginBottom": "12px"}}>
        {
          passed?<span>考核通过</span>:
          <Flex>{GoExamination?<Button type="primary" size="small" onClick={() => GoExamination(id)} >去考试</Button>:''}</Flex>
        }
      </Flex>
    </Flex>
  );
}

ResourcesListItem.propTypes = {
  listType: PropTypes.string,
  GoExamination: PropTypes.func,
  name: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.number,
};

export default ResourcesListItem;


