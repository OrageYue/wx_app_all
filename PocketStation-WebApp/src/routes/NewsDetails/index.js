import React, { Component } from 'react';
import { connect } from 'dva';
import { Flex, Icon } from 'antd-mobile';
import { getPageQuery } from '../../utils/utils';

class NewsDetails extends Component {
  componentDidMount() {
  	const { newsId } = getPageQuery();
    const { getNewsItem } = this.props;
    getNewsItem( newsId );
  }
  readImageFun = (item, content) => {
    window.wx.previewImage({
      current: item,
      urls: content
    })
  }
  render() {
    const wrap = {width: "100%"};
    const imgStyle = {width: "100%"};
    const { loading, newsItem: { content } } = this.props;
    
  	return (
      <Flex style={wrap} justify="center" align="center">
        {loading?<Flex align="center" justify="center" style={{height:"100%"}}>
            <Icon type='loading' size='lg'  />
          </Flex>:
          <Flex direction="column" style={{paddingBottom: '20px'}}>
            {content && content.map( (item,index) => (
                <img src={item} alt={item} key={index} style={imgStyle} onClick={() => this.readImageFun(item, content) } />
              ))
            }
          </Flex>
        }
      </Flex>
  	)
  }
}
  
function mapState2Props({news,loading}) {
  return {
    newsItem: news.newsItem,
    loading:loading.effects["news/getNewsItem"]
  }
}

function mapDispatch2Props( dispatch ) {
  return {
    getNewsItem(newsId) {
      dispatch({type:'news/getNewsItem',payload: newsId});
    }
  }
}
export default connect(mapState2Props, mapDispatch2Props)(NewsDetails);