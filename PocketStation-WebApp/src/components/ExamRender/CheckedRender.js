import React from 'react';
import { Flex, Checkbox, Icon } from 'antd-mobile';
import PropTypes from 'prop-types';
import styles from './TestQuesRender.less';
const AgreeItem = Checkbox.AgreeItem;

function CheckedRender({ item , index }) {
  const {ques_id,content,resChoices} = item;
  return (
    <div key={ques_id} className={styles.bSpace} >
    	<h4>{index+1}.{content}</h4>
    	<Flex direction="column" align="start" >
    		{resChoices?resChoices.map( (itm) => (
    			<AgreeItem key={itm.opt} className={styles[itm.optCorrectness]} disabled checked={itm.checkFlag}>
    				{itm.opt}
    			</AgreeItem>
    		)): <Icon type="loading" size="lg" />}
    	</Flex>
    </div>
  )
}

CheckedRender.propTypes = {
  item: PropTypes.object, 
  index: PropTypes.number, 
}

export default CheckedRender;