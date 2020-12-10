import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';
import { Flex, SegmentedControl } from 'antd-mobile';

const LsnListHeader = ({ selectedIndex, values, onValueChange }) => {
  const top = {
    width: '100%',
    boxShadow: '1px 1px 4px rgb(245, 242, 242)'
  }
  return (
    <Flex 
    	direction="column"
    	style={top}
    >
    	<Flex.Item>
        <SegmentedControl 
          className={styles.choice}
    			values={values} 
    			style={{"width": "160px",height: '40px', lineHeight: '40px'}}
    			onValueChange = { onValueChange }
    			selectedIndex={selectedIndex}
    		/>
    	</Flex.Item>
    </Flex>
  )
}
LsnListHeader.propTypes = {
  selectedIndex: PropTypes.number,
  values: PropTypes.array,
  onValueChange: PropTypes.func,
  imgUri: PropTypes.string
}
export default LsnListHeader;