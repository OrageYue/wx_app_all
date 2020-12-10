import { connect } from 'dva';
import { Flex } from 'antd-mobile';

function DealerNewsDetails({ news }) {
 
  function previewImage(news){
    let images = [];
    images.push(news);
    window.wx.previewImage({
      current: news, 
      urls: images, 
    });
  }

  return (
    <Flex>
      <img src={news} alt={news} width="100%" onClick={() => previewImage(news)} />
    </Flex>
  )
}

function mapState2Props({dealer_news}) {
  return {
    news: dealer_news.news
  }
}
export default connect(mapState2Props)(DealerNewsDetails);