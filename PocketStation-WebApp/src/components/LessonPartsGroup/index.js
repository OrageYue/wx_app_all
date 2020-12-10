import styles from './index.less';
import { Flex } from "antd-mobile";
import PropTypes from "prop-types";
import LessonPartCard from "./LessonPartCard";

function LessonPartsGroup({ parts }) {
  
  return (
    <Flex className={styles.container} style={{overflow: "auto"}} align="center">
      {parts.map(({ id, title, img, onPartClick }) => (
        <LessonPartCard key={id} onClick={onPartClick} title={title} img={img} />
      ))}
    </Flex>
  );
}

LessonPartsGroup.propTypes = {
  parts: PropTypes.arrayOf(
    PropTypes.shape({
      img: PropTypes.string,
      title: PropTypes.string,
      onPartClick: PropTypes.func
    })
  ),
};

// testing data!
LessonPartsGroup.defaultProps = {
  // parts: [
  //   { id: 'DSD', title: "DSD", img: "/DSD.png" },
  //   { id: 'NES', title: "NES", img: "/NES.png" },
  //   { id: 'OJR', title: "OJR", img: "/OJR.png" },
  //   { id: 'OPM', title: "OPM", img: "/OPM.png" },
  // ],
  // onPartClick: function (id) { console.log(`LessonPart: '${id}' is clicked!`) },
}

export default LessonPartsGroup;
