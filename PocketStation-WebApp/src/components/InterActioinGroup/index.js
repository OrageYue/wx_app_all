import { Flex } from 'antd-mobile';
import InterActionCard from './InterActionCard';
const InterActioinGroup = ({ interActionList }) => {
  let arr = [];
  if( interActionList ) {
    interActionList.map( (item, inx) => 
      arr.push(<InterActionCard {...item} key={item.ques_id} />)
    )
  }else {
    arr.push(<Flex key='0'>暂无数据</Flex>)
  }
  return (
    <Flex style={{width:"100%"}} direction="column">{arr}</Flex>
  )
}
export default InterActioinGroup