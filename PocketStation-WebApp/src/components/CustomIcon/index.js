import PropTypes from "prop-types";


function CustomIcon({ icon, width }) {
  width = width ? width: '1em';
  const styles = {
    width: width,
    height: width,
    verticalAlign: '-0.15em',
    fill: 'currentColor',
    overflow: 'hidden',
    marign: 0,
  }
  return (
    <svg style={styles}>
      <use xlinkHref={`#icon-${icon}`}></use>
    </svg>
  )
}

CustomIcon.propTypes = {
  icon: PropTypes.string
}

export default CustomIcon;