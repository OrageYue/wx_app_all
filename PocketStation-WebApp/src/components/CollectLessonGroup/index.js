import Card from './Card';
import { Flex, WhiteSpace } from 'antd-mobile';

function CollectLessonGroup({ lessons }) {
  return (
    <Flex justify="center" wrap="wrap" style={{width: '100%'}}>
      <WhiteSpace size="md" />
      {lessons.length>0?lessons.map( ls => (
          <Card key={ls.id} lesson={ls} />
        )):<Flex justify="center" align="center">您未收藏任何课程</Flex>
      }
    </Flex>
  )
}

export default CollectLessonGroup;