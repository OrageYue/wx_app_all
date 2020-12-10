import React from 'react';
import PropTypes from 'prop-types';
import GainShow from './GainShow'
import styles from './index.less';

const Gains = ({ experience, title }) => {
  let arr = [];
  if( experience.length !== 0 ) {
  	experience.map( item => (
  		arr.push(<div className={styles.item} key={item.id}>
  			<div className={styles.itemT}>
  				<div className={styles.itemLogo}>
  					<img src={item.dealer.avatar} alt="" />  
  				</div>
  				<div className={styles.itemR}>
  					<span className={styles.itemTit}>{item.dealer.name}</span>
  					<p className={styles.itemRB}>
  						<span>{item.dealer.position}</span>
  						<span>{item.create_at}</span>
  					</p>
  				</div>
  			</div>
  			<GainShow gainsCon={item.content} />
  		</div>)
  	))
  }else{
		arr.push(<div key='0'>暂无数据</div>)
	}
  return (
  	<div className={styles.wrap}>
  		<div className={styles.titleBox}><span className={styles.title}>{title}</span></div>
  		{
  			arr
  		}
  	</div>
  )
}

Gains.propTypes = {
  experience: PropTypes.array,
  title: PropTypes.string
}

export default Gains;
