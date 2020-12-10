import { connect } from 'dva';
import { Flex , WingBlank, WhiteSpace } from 'antd-mobile';
import { PropTypes } from 'prop-types';
import Item from './Item';
import styles from './index.less';

const CourseList = ({ resourcesList, onTools, listType, onGoExamination, goLessonDetails }) => {
  return (
    <div className={styles.wrap}>
      {resourcesList&&
        resourcesList.map( ({ id, cover_img, name, type, passed }) => (
          <WingBlank size="lg" key={id}>
            <Flex className={styles.itemWrap} justify="center" align="center" >
              <div className={styles.imgWrap} onClick={() => {onTools?onTools(id): goLessonDetails(id)}}>
                {
                  cover_img?<img src={cover_img} alt={cover_img} className={styles.imgStyle} />:
                  <img src={type==='video'?'/video_72px.png':'/pdf_72px.png'} alt='' className={styles.imgStyle} />
                }
              </div>
              <Item id={id} listType={listType} name={name} passed={passed} type={type} GoExamination={onGoExamination}/>
            </Flex>
            <WhiteSpace size="xl" />
          </WingBlank>
        ))
      }
    </div>
    
  )
}

CourseList.propTypes = {
  resourcesList: PropTypes.array,
  listType: PropTypes.string,
  onGoExamination: PropTypes.func,
  goLessonDetails: PropTypes.func
}
export default connect()(CourseList);