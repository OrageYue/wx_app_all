import { Flex } from "antd-mobile";
import DetailsLessonCard from ".";

function Group({ trainings }) {
  return (
    <Flex direction="column" style={{marginBottom: '64px'}}>
      {trainings.map((t,idx)=><DetailsLessonCard key={idx} {...t}/>)}
    </Flex>
  )
}

export default Group;