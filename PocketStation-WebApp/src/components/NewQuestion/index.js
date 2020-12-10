
import { Flex, Checkbox, WingBlank, WhiteSpace } from 'antd-mobile'; 
import styles from './index.less';

const AgreeItem = Checkbox.AgreeItem;

function NewQuestion({ sel, onChange }) {
  return (
    <Flex direction="column" align="start" className={styles.bSpace} >
      {
        sel.map( (item, index) => (
          <WingBlank key={index}>
            <WhiteSpace />
            <Flex className={styles.ques_tit}>{index+1}.{item.content}</Flex>
            <Flex direction="column" align="start" className={styles.check_container}>
              {item.option.map( (itm,inx) => (
                <AgreeItem key={inx} onChange={(selected) => onChange(item.id,inx,selected)} >
                  {itm}
                </AgreeItem>
              ))}
            </Flex>
          </WingBlank>
        ))
      }
    </Flex>
  )
}

export default NewQuestion