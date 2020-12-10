import PropTypes from 'prop-types';
import { WhiteSpace, WingBlank, Carousel, Flex } from 'antd-mobile';
const CarouselCon = ({ carouselList }) => {
  const dotStyle = {marginBottom: "8px", width: '6px', height: '6px', backgroundColor: 'rgba(255,255,255, .6)', borderRadius: '50%' };
  const dotActiveStyle = {marginBottom: "9px", width: '20px', height: '4px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255, .9)'};
  return (
    <WingBlank size="lg">
      <WhiteSpace size='lg'/>
      <Carousel autoplay = {true} infinite dotStyle={dotStyle} dotActiveStyle={dotActiveStyle} autoplayInterval={5000} >
        {carouselList.map(({id, url, onClick}) => (
          <Flex key={id} onClick={onClick} style={{ display: 'inline-block', width: '100%'}} >
            <img src={url} alt={url} style={{ width:'100%',verticalAlign:'top', borderRadius:'10px' }}
              onLoad={() => {
                window.dispatchEvent(new Event('resize'));
              }}
            />
          </Flex>
        ))}
      </Carousel>
    </WingBlank>
  )
}
CarouselCon.propTypes = {
  carouselList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
    onClick: PropTypes.func,
    url: PropTypes.string
  }))
}
export default CarouselCon;


