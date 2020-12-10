import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import DealerPartsGroup from '../../components/DealerPartsGroup';
import DetailsLessonCardGroup from "../../components/DetailsLessonCard/Group";
import NewTitle from "../../components/NewTitle";
import { WingBlank, WhiteSpace, Flex, Icon } from "antd-mobile";
import SearchBar from '../../components/SearchBar';
import { routerRedux } from 'dva/router';
import Carousel from "../../components/Carousel";
import { formatLessonPartsImageUrl } from "../../utils/dev";
import { log } from "../../utils/log";

function DealerHomePage({ carousel_list, onNews, onSearch, loading, loading_cal, onTrainingsMore, ...props }) {
  let { onLessonPartClick } = props;

  let { latest_trainings, onTrainingLearn, lesson_parts } = props;
  // process for component
  latest_trainings = latest_trainings.map(lt => ({ ...lt, img: lt.cover_img, onBtnClick: () => onTrainingLearn(lt.id) }))

  lesson_parts = lesson_parts.map( itm => ({...itm, onPartClick: () => onLessonPartClick(itm.id) }))

  // carousel_list = carousel_list.map( ct => ({...ct, url: formatLessonPartsImageUrl(ct.url), onClick: () => onNews(formatLessonPartsImageUrl(ct.content))}))
  carousel_list = carousel_list.map( ct => ({...ct, onClick: () => onNews(ct.content)}))

  return (
    <div className={styles.normal}>
      <WingBlank size="lg">
        <WhiteSpace/>
        {/* 搜索 */}
        <WingBlank size="lg">
          <Flex justify='between' className={styles.searchBox}>
            <img width="110px" src="/PocketStation.png" alt="/PocketStation.png" />
            <SearchBar onSubmit={onSearch} />
          </Flex>
        </WingBlank>
      </WingBlank>
      <WingBlank size="lg">
      {
        loading_cal?(<Flex align="center" justify="center" style={{height:"100%"}}>
        <Icon type='loading' size='lg' /></Flex>):
        <Carousel carouselList={carousel_list} />
      }
       
      </WingBlank>
      {/* 课程分类*/}
      <WingBlank>
        {
          loading?(<Flex align="center" justify="center" style={{height:"100%"}}>
          <Icon type='loading' size='lg' /></Flex>):
          <DealerPartsGroup parts={lesson_parts} onPartClick={onLessonPartClick} />
        }
      </WingBlank>
      <WhiteSpace/>
      <Flex style={{height: '6px', backgroundColor: '#f1f1f1'}}></Flex>
      <WingBlank size='lg'>
        {/* 最新培训 */}
        <NewTitle title="最新培训" onMore={onTrainingsMore} icon_name="right" />
        <WhiteSpace/>
        <DetailsLessonCardGroup trainings={latest_trainings} />
      </WingBlank>
    </div>
  );

}

/**
 * Default Props for Testing.
 */
DealerHomePage.defaultProps = {
  // lesson_parts: [
  //   { id: 'OTC1', title: "OTC", img: "/OTC1.png" },
  //   { id: 'OTC2', title: "OTC", img: "/OTC2.png" },
  //   { id: 'OTC3', title: "OTC", img: "/OTC3.png" },
  // ],
}



function mapState2Props({ dealer, lessons, loading }) {
  const { carousel_list, latest_trainings } = dealer;
  console.log(carousel_list)
  return {
    carousel_list,
    latest_trainings,
    lesson_parts: lessons.parts.map(p => ({ ...p, img: formatLessonPartsImageUrl(p.img) })),
    loading: loading.effects['lessons/queryLessonParts'],
    loading_cal: loading.effects['lessons/queryCarousel'],
  }
}

function mapDispatch2Props(dispatch) {
  return {
    onNews(content) {
      dispatch(routerRedux.push(`/dealerNews?content=${content}`));
    },
    onSearch(keyword) {
      console.log("Dealer Home Page Search:", keyword);
    },
    onTrainingsMore() {
      dispatch(routerRedux.push(`/trainingCourse`))
    },
    onLessonPartClick(lesson_part_id, img_uri) {
      dispatch(routerRedux.push(`/lsn_class/dealer?part_id=${lesson_part_id}&imgUri=${img_uri}`))
    },
    onTrainingLearn(training_id) {
      log(`Training[${training_id}] Learn`)
      dispatch(routerRedux.push(`/train?training_id=${training_id}`));
    },
  }
}
export default connect(mapState2Props, mapDispatch2Props)(DealerHomePage);
