import { Flex } from 'antd-mobile'; 
import PropTypes from 'prop-types';

const card = {
  width: '100%',
  backgroundColor: '#f1f1f1',
  borderRadius: '8px',
  marginBottom: '15px',
  boxSizing: 'border-box',
  padding: '10px 20px',
  color: 'rgb(134, 131, 131)',
  lineHeight: '20px',
}

const replyName = {
  color: '#339f6a',
  marginBottom: '8px',
}

function ReplyCard({ name, reply }) {
  return (
    <Flex direction="column" justify="center" align="start" style={card}>
      <div ><span style={replyName}>{name}回复：</span>{reply}</div>
    </Flex>
  );
}

ReplyCard.propTypes = {
  name: PropTypes.string,
  reply: PropTypes.string,
};

export default ReplyCard;
