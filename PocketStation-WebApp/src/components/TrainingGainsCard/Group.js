import { Flex } from "antd-mobile";
import TrainingGainsCard from ".";

function Group({ gains }) {
  return (
    <Flex direction="column" style={{width: '90%'}}>
      {gains && gains.map((t,idx)=><TrainingGainsCard key={idx} {...t}/>)}
    </Flex>
  )
}

export default Group;