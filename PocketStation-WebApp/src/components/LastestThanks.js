import { Flex, WhiteSpace, WingBlank } from 'antd-mobile';
import PropTypes from 'prop-types';
const LastestThanks = ({gratsCurrent:{ thanksPerson, thanksCon, time, onClick}}) => {
  const wrapBd = {border:"1px solid #bfbfbf",padding:"0 4px",lineHeight:"38px"};
  const iconStyle = {fontSize: "18px",color:"#bfbfbf",marginLeft:"5px"};
  const con = {flex: "2.8",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",margin:"0 5px 0 0"};
  return (
    <WingBlank>
      <WhiteSpace />
      <Flex align="center" justify="between" style={wrapBd}>
      	<Flex.Item style={{flex:"2.2"}}>{thanksPerson}:</Flex.Item>
      	<Flex.Item style={con}>{thanksCon}</Flex.Item>
        <Flex justify="between" align="center" style={{flex:"1.2"}}>
          <span>{time}</span>
          <i className="iconfont icon-gengduo" style={iconStyle} onClick={onClick}></i>
        </Flex>
      </Flex>
    </WingBlank>
  )
}
LastestThanks.propTypes = {
  thanksPerson: PropTypes.string,
  thanksCon: PropTypes.string,
  time: PropTypes.string,
  onClick: PropTypes.func,
}
export default LastestThanks;