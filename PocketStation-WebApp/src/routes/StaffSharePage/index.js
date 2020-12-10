import React, {Component } from 'react';
import { connect } from 'dva';
import { Tabs, WhiteSpace, Flex, List } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import render from './renderFn';
import HeaderTitle from '../../components/HeaderTitle';
import { formatLessonPartsImageUrl } from "../../utils/dev";
import styles from './index.less';
  
class StaffSharePage extends Component {
  
  //资讯列表渲染
  renderContent = () => {
    let { newsList, partId, onNewsDetails, offset } = this.props;
    const news = newsList.filter(one=>one.cls.id===partId).map(one => {
      return {cover_img: formatLessonPartsImageUrl(one.img_src),title: one.name, ...one};
    })

    const topNews = news.filter( one=> !!one.top)
    
    return (
    	<Flex direction="column" styles={{width:"100%"}}>
    		<List className={styles.myList}>
    			{/* {render({data:news.slice(offset,2), partId, onNewsDetails, type: 'top'})} */}
    			{render({data:topNews, partId, onNewsDetails, type: 'top'})}
    			{render({data:news.slice(2), partId, onNewsDetails})}
    		</List>
        <WhiteSpace />
        {/* <Flex className={styles.btnWrap} justify="center">
          <span className={styles.loadingMore} onClick={() => getMore()}>
            {
              loadingMore? '加载中': '加载更多'
            }
          </span>
        </Flex> */}
    	</Flex>
    )
  }
  render() {
    const { tabChange, tabs, isLoading } = this.props; 
    return(
      <div className={styles.newsCon}>
        <WhiteSpace />
        <HeaderTitle />
        <WhiteSpace size="lg"/>
        {isLoading?(<Flex justify="center"className={styles.loading}>加载中...</Flex>)
        	:(
        		<div>
              <Tabs 
                tabs={tabs} 
                tabBarTextStyle={{fontSize: 13, fontWight: 300, color: '#666'}}
                onChange={(tab) => { tabChange(tab.id) }}
                renderTab={tab => <span>{tab.name}</span>} 
              >
              	{this.renderContent}
              </Tabs>
              <WhiteSpace />
            </div>
        	)
        }
      </div>
    )
  }
}

function mapState2Props({ news, loading: { effects, models } }) {
  return {
    tabs: news.tabs,
    newsTopList: news.newsTopList,
    newsList: news.newsList,
    partId: news.partId,
    limit: news.limit,
    loadingMore: effects['news/getMoreNews'],  
    isLoading: models.news.tab
  }
}
function mapDispatch2Props(dispatch) {
  return {
    //tab切换请求对应数据
    tabChange(partId){
      dispatch({type: "news/savePartId",payload: partId});
    },
    //点击列表进入资讯详情
    onNewsDetails( {newsId} ){
      dispatch(routerRedux.push(`/news/?newsId=${newsId}`));
    },
  }
}
export default connect(mapState2Props,mapDispatch2Props)(StaffSharePage)