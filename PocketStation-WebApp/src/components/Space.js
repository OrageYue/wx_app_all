import { Flex } from 'antd-mobile';

const Space = ({location}) => {
  return (
    <Flex style={{width: '100%'}}>
      {location?
        <Flex style={{width: '100%',height:'6px', backgroundColor:'#f1f1f1', marginBottom:'64px'}}></Flex>
        :<Flex style={{width: '100%',height:'6px', backgroundColor:'#f1f1f1'}}></Flex>
      }
    </Flex>
  )
}

export default Space;