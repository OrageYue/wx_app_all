import Card from './Card';
import { Flex } from 'antd-mobile';

function RecommendLsnGroup({ lessons }) {
  return (
    <Flex>
      {lessons.length>0 && lessons.map( ls => (
          <Card key={ls.id} lesson={ls} />
        ))
      }
    </Flex>
  )
}

export default RecommendLsnGroup;