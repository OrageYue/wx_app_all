import React, { Component } from 'react';
import { connect } from 'dva';
import { WingBlank, WhiteSpace, Flex } from "antd-mobile";
import { idUri2titleUri, getItemsInTree, isItemViewable, canItemDownload, isFolder, getResourceUrl } from "../../utils/resource";
import LessonPartsGroup from '../../components/LessonPartsGroup';
import Carousel from "../../components/Carousel";
import RecommendLesson from '../../components/RecommendLesson';
// import LastestThanks from '../../components/LastestThanks';
import HeadeLinesGroup from '../../components/HeadLines';
import SearchBar from '../../components/SearchBar';
import ResourcePanel from "../../components/ResourcePanel";
import { formatLessonPartsImageUrl } from "../../utils/dev";
import Title from '../../components/Title';
import styles from './index.less';
import { routerRedux } from 'dva/router';

class StaffHomePage extends Component {
  
  async componentDidMount() {
    const { getRecommendLessons, user_id, queryResource } = this.props;
    await getRecommendLessons( { user_id } );
    queryResource({user_id, hier: 1, resId: 'a'});
    
  }

  buildResourceItems = () => {
    
    const { viewResource, downloadResource, queryResource, tree, iduri, user_id } = this.props;
    
  	const items = getItemsInTree(tree, iduri).map((item) => ({
  		id: item.id,
  		title: item.name,
  		enter: isFolder(item) ? () => queryResource({hier: item.p_id,resId: item.id, user_id}) : null,
  		view: isItemViewable(item) ? () => viewResource(item) : null,
  		download: canItemDownload(item) ? () => downloadResource(item) : null,
  	}));
  	return items;
  }
  render() {
    const { onSearch, onLessonPartClick, onRecommendLessonClick, onNews, resourceGoBack } = this.props;
    let { lesson_parts, uri, carouselList, recommendLessons, hots, resource_loading } = this.props;
    
    carouselList = carouselList.map( ct => ({...ct, url: formatLessonPartsImageUrl(ct.img_src), onClick: () => onNews(ct.id)}))

    lesson_parts = lesson_parts.map( itm => ({...itm, onPartClick: () => onLessonPartClick(itm.id, itm.img) }));

    recommendLessons = recommendLessons.map(rs => ({ ...rs, img: formatLessonPartsImageUrl(rs.img_src), onClick: ()=> onRecommendLessonClick(rs.id) }))

    hots = hots.map( hs => ({...hs, onClick: () => onNews(hs.id) }) )

    return (
      <Flex className={styles.staffHomeCon} direction="column">
        <div direction="column" className={styles.bgf}>
          <WingBlank size="lg">
            <WhiteSpace />
            {/* 搜索 */}
            <WingBlank size="lg">
              <Flex justify='between' className={styles.searchBox}>
                <img width="110px" src="/PocketStation.png" alt="/PocketStation.png" />
                <SearchBar onSubmit={onSearch} />
              </Flex>
            </WingBlank>
            {/* 轮播 */}
            <Carousel carouselList={carouselList}/>
            {/* 课程分类 */}
            <LessonPartsGroup parts={lesson_parts} />
          </WingBlank>
        </div>
        {/* 头条 */}
        <Flex className={styles.bgf}>
          <WingBlank style={{width: '100%'}}>
            <HeadeLinesGroup news={hots} />
          </WingBlank>
        </Flex>
        {/* 推荐课程 */}
        {/* <Flex className={styles.bgf} style={{marginBottom: '0'}}>
          <WingBlank size="lg">
            <WingBlank>
              <Title title="为你推荐" />
            </WingBlank>
          </WingBlank>
        </Flex>
        <Flex className={styles.bgf} style={{width: '100%', overflow: 'auto', paddingBottom: '10px'}}>
          <WingBlank size="lg">
            <WingBlank>
              <RecommendLesson lessons={recommendLessons} />
            </WingBlank>
          </WingBlank>
        </Flex> */}
        {/* 员工资源 */}
        {/* <Flex direction="column" justify="start" align="start" className={styles.resource_container}>
          <p className={styles.resource_title}>内部资源</p>
          <WingBlank style={{width: '92%'}}>
            <ResourcePanel uri={uri} items={this.buildResourceItems()} loading={resource_loading} onBack={resourceGoBack} />
          </WingBlank>
        </Flex> */}
      </Flex>
    ) 
  }
}

StaffHomePage.defaultProps = {
  lesson_parts: [
    // { id: 'DSD', title: "DSD", img: "/DSD.png" },
    // { id: 'NES', title: "NES", img: "/NES.png" },
    // { id: 'OJR', title: "OJR", img: "/OJR.png" },
    // { id: 'OPM', title: "OPM", img: "/OPM.png" },
  ]
}


function mapState2Props({ user, staff, lessons, staff_resource, loading: { effects } }) {
  const { uri, tree } = staff_resource;
  let { parts } = lessons;
  let { carouselList, recommendLessons, hots } = staff;
  return {
    user_id: user.id,
    carouselList,
    recommendLessons,
    hots,
    lesson_parts: parts.map(p => ({ ...p, img: formatLessonPartsImageUrl(p.img) })),
    uri: idUri2titleUri(tree, uri),
    iduri: uri,
    tree: tree,
    resource_loading: effects['staff_resource/queryNode'],
  }
}
function mapDispatch2Props(dispatch) {
  return {
    onNews(news_id) {
      console.log( news_id)
      dispatch(routerRedux.push(`/news?newsId=${news_id}`));
    },
    onSearch(keyword) {
      console.log("Dealer Home Page Search:", keyword);
    },
    onRecommendLessonClick( lsn_id ) {
      dispatch(routerRedux.push(`/course?lesson_id=${lsn_id}`));
    },
    getRecommendLessons( user_id ) {
      dispatch({type: 'staff/getRecommendLessons', payload: user_id})
    },
    onThanksDetails( grat_id) {
      console.log('click',grat_id);
    },
    onLessonPartClick(lesson_part_id, img_uri) {
      dispatch(routerRedux.push(`/lsn_class/staff?part_id=${lesson_part_id}&imgUri=${img_uri}`))
    },
    resourceGoBack() {
      dispatch({ type: 'staff_resource/turnBack' })
    },
    queryResource(params) {
      dispatch({ type: 'staff_resource/queryNode', payload: params });
    },
    viewResource(item) {
      // console.log("view item:", item.content);
      // window.location.href = `https://pocketstation.cn:8000${item.content}`;
      window.open(getResourceUrl(item));
    },
    downloadResource(item) {
      // console.log("download item:", item);
      window.open(getResourceUrl(item));
    }
  }
}
export default connect(mapState2Props, mapDispatch2Props)(StaffHomePage);