import { Flex } from "antd-mobile";
import PropTypes from "prop-types";
import PartCard from "./PartCard";

function DealerPartsGroup({ parts, onPartClick }) {
  return (
    <Flex style={{overflow: 'auto'}}>
      {parts.map(( { id, title, img } ) => ( <PartCard key={id} onClick={() => onPartClick(id, img)} img={img} title={title} /> ))}
    </Flex>
  );
}

DealerPartsGroup.propTypes = {
  parts: PropTypes.arrayOf(
    PropTypes.shape({
      cover_img: PropTypes.string,
      name: PropTypes.string,
      link: PropTypes.string
    })
  ),
  onPartClick: PropTypes.func,
};

export default DealerPartsGroup;
