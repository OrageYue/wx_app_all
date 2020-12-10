import { Flex } from 'antd-mobile';
import GratRecordCard from './GratRecordCard';

function GratRecordsGroup({ records }) {
  
  return (
    <Flex direction="column" style={{width: '100%', position: 'absolute', top: '0', left: '0', paddingBottom: '100px'}} >
      {records && records.map( ({ id, ...rs }) => (
          <GratRecordCard key={id} {...rs} />
        ))
      }
    </Flex>
  )
}

export default GratRecordsGroup;