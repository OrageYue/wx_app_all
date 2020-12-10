import { Flex, WingBlank, Icon } from 'antd-mobile';
import PropTypes from 'prop-types';

const NewTitle = ({ title, onMore, moreText, icon_name }) => {

  const containerStyle = {
    boxSizing: 'border-box',
    marginTop: '16px',
    width: '100%',
  }
  const color = '#339f6a';
  const titleStyle = {
    fontSize: '14px',
  }
  return (
    <WingBlank size="lg" style={{width: '96%'}}>
      <Flex justify='between' align='center' style={containerStyle}>
        <div style={titleStyle}>
          <span>{title}</span>
        </div>
        {onMore && <Flex style={{color: color}} onClick={onMore}>{moreText}<Icon type={icon_name} /></Flex>}
      </Flex>
    </WingBlank>
   
  )
}

NewTitle.propTypes = {
  // 显示标题
  title: PropTypes.string.isRequired,

  // 查看更多的方法，存在时显示'更多'
  onMore: PropTypes.func,

  // '更多' 的文本
  moreText: PropTypes.string,
}

NewTitle.defaultProps = {
  moreText: '查看更多',
}

export default NewTitle;