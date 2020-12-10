import React, { Component } from 'react';
import { connect } from 'dva';
import { Flex, Icon } from 'antd-mobile';
import { getPageQuery } from '../../utils/utils';

class DealerNewsDetails extends Component {
  state = {
    content: '',
  }
  componentDidMount() {
    const { content } = getPageQuery();
    this.setState({
      content,
    })
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
    // const { loading, newsItem: { content } } = this.props;
    const { content } = this.state;
    console.log( content )
    
  	return (
      <Flex style={wrap} justify="center" align="center">
        <Flex direction="column" style={{paddingBottom: '20px'}}>
          {/* {content && content.map( (item,index) => (
              <img src={item} alt={item} key={index} style={imgStyle} onClick={() => this.readImageFun(item, content) } />
            ))
          } */}
          <img src={content} alt={content} style={imgStyle} onClick={() => this.readImageFun(content, content) } />
        </Flex>
      </Flex>
  	)
  }
}
  
function mapState2Props({carousel_list, news,loading}) {
  console.log( carousel_list )
  return {
    // newsItem: news.newsItem,
    // loading:loading.effects["news/getNewsItem"]
  }
}

function mapDispatch2Props( dispatch ) {
  return {
    // getNewsItem(newsId) {
    //   dispatch({type:'news/getNewsItem',payload: newsId});
    // }
  }
}
export default connect(mapState2Props, mapDispatch2Props)(DealerNewsDetails);