import PropTypes from 'prop-types';
const Video = ({ videoUri }) => {
  const videoWrap = {
    width:"100%",
    height:"160px",
    border:"1px solid #bfbfbf",
  }
  const videoStyle = {
    objectFit: "fill",
    width: "100%",
    height: "100%"
  }
  return (
    <div style={videoWrap}>
      <video src={videoUri} style={videoStyle}
        controls
        post=""
      >
      </video>
    </div>
  )
}
Video.propTypes = {
  videoUri: PropTypes.string
}
export default Video;