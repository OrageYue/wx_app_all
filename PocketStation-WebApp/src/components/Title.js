import { Flex, Icon } from 'antd-mobile';
import PropTypes from 'prop-types';

const Title = ({ title, onMore, moreText, rect }) => {

  const containerStyle = {
    marginTop: '8px',
    marginBottom: '8px',
    width: '100%',
  }
  const color = '#18C086';
  const titleStyle = {
    fontSize: '14px',
    padding: '6px 0 6px 0px',
  }
  return (
    <Flex justify='between' align='center' style={containerStyle}>
      <Flex style={titleStyle} align="center">
        <img src={rect} height="24px" alt={rect} />
        <span style={{marginLeft: '8px'}}>{title}</span>
      </Flex>
      {onMore && <Flex style={{color: color}} onClick={onMore}>{moreText}<Icon type="right" /></Flex>}
    </Flex>
  )
}

Title.propTypes = {
  // 显示标题
  title: PropTypes.string.isRequired,

  // 查看更多的方法，存在时显示'更多'
  onMore: PropTypes.func,

  // '更多' 的文本
  moreText: PropTypes.string,
}

Title.defaultProps = {
  moreText: '查看更多',
  rect: '/rect.png',
}

export default Title;