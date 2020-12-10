import React from 'react';
import { Flex, Checkbox, WingBlank, WhiteSpace } from 'antd-mobile';
import PropTypes from 'prop-types';
import styles from './TestQuesRender.less';
const AgreeItem = Checkbox.AgreeItem;

function TestQuesRender({ item , index, onOptionChange, imgPreview }) {
  const { id, content, correct_option, other_option } = item;
  let options = [...correct_option, ...other_option];
  
  let title = content.indexOf('#')!==-1?content.split('#')[0]:content;
  let ques_img = content.indexOf('#')!==-1?content.split('#')[1]: null;
  const urls = [ques_img];

  return (
    <Flex direction="column" align="start" className={styles.bSpace} >
      <WingBlank>
        <WhiteSpace />
        <Flex className={styles.ques_tit}>{index+1}.{title}</Flex>
        <img src={ques_img} alt={ques_img} width="100%" onClick={() => imgPreview(ques_img, urls)} />
        <Flex direction="column" align="start" className={styles.check_container}>
          {options.map( (itm,inx) => (
            <AgreeItem key={itm} onChange={(selected) => onOptionChange(id,inx,selected)} >
              {itm}
            </AgreeItem>
          ))}
        </Flex>
      </WingBlank>
    </Flex>
  )
}

TestQuesRender.propTypes = {
  item: PropTypes.object.isRequired, 
  index: PropTypes.number, 
  onOptionChange: PropTypes.func,
}

export default TestQuesRender;