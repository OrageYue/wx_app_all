/**
 * 横版的课程卡片
 */

import styles from './index.less';
import { Flex, Button } from "antd-mobile";
import PropTypes from "prop-types";


function DetailsLessonCard({ img, title, lecturer, create_at, views, onBtnClick, btntxt }) {


  return (
    <Flex className={styles.container} align='stretch'>
      <img src={img} alt={img} />

      {/* Card 右半部分 */}
      <Flex direction='column' justify="between" className={styles.right_panel}>
        {/* Card右半部分的上部：title + lecturer */}
        <Flex justify='between' className={styles.right_top_panel}>
          <h4 className={styles.title}>{title}</h4>
          <span className={styles.lecturer}>{lecturer}</span>
        </Flex>        {/* Card右半部分的下部：datetime + views + Button*/}
        <Flex justify='between' align='end' className={styles.right_bottom_panel}>
          {/* datetime + views */}
          {/* <Flex justify='between' className={styles.info_container}> */}
            <span>{create_at}</span>
            {/* <span>浏览: {views}</span> */}
          {/* </Flex> */}

          {/* buttons */}
          <Flex className={styles.btns_container}>
            <Button style={{ color: '#339f6a' }} type="ghost" size='small' onClick={onBtnClick}>{btntxt}</Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

DetailsLessonCard.propTypes = {
  img: PropTypes.string,
  title: PropTypes.string, 
  lecturer: PropTypes.string, 
  create_at: PropTypes.string, 
  views: PropTypes.number, 
  onBtnClick: PropTypes.func, 
  btntxt: PropTypes.string
};

// testing data!
DetailsLessonCard.defaultProps = {
  btntxt: '学习',
  onBtnClick: ()=>console.log("DetailsLessonCard btn clicked!"),
}


export default DetailsLessonCard;
