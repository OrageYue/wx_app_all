import React, { Component } from 'react';
import styles from './GainShow.less';


class GainShow extends Component {
  showMore() {
    this.refs.itemCon.style.display = "none";
    this.refs.expandItemCon.style.display = "block";
    this.refs.showBtn.style.display = "none";
    this.refs.hideBtn.style.display = "flex";
  }
  hideMore() {
    this.refs.itemCon.style.display = "block";
    this.refs.expandItemCon.style.display = "none";
    this.refs.hideBtn.style.display = "none";
    this.refs.showBtn.style.display = "block";
  }
  render() {
    const iconStyle = {color: "#333",fontSize:"20px"};
    return(
      <div className={styles.conBox} >
      	<div className={styles.con} style={{display:"block"}} ref="itemCon" >
          {this.props.gainsCon}
        </div>
        <div className={styles.expand} style={{display:"none"}} ref="expandItemCon" >
        	{this.props.gainsCon}
        </div>
        <div onClick={this.showMore.bind(this)} ref="showBtn" style={{height:"100%"}}>
      		<i className="iconfont icon-arrRight-fill" style={iconStyle}></i>
      	</div>
        <div onClick={this.hideMore.bind(this)} style={{display:"none",alignItems:"flex-end"}} ref="hideBtn" >
        	<i className="iconfont icon-arrTop-fill" style={iconStyle}></i>
        </div>
      </div>
    )
  }
}

export default GainShow;