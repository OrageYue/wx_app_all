import { Flex } from "antd-mobile";
import PropTypes from "prop-types";
import ReplyCard from "./ReplyCard";

function DealerReplyGroup({ replys }) {
  return (
    <Flex justify="around" direction="column" style={{overflow: 'auto'}}>
      {replys.map(( item ) => ( <ReplyCard key={item.reply_id} {...item} /> ))}
    </Flex>
  );
}

DealerReplyGroup.propTypes = {
  replys: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string,
      reply: PropTypes.string,
      create_at: PropTypes.string,
    })
  ),
  onPartClick: PropTypes.func,
};

export default DealerReplyGroup;
