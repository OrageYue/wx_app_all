import ToolsItem from './ToolsItem';
import { Flex, WhiteSpace } from 'antd-mobile';

function RecommendLsnGroup({ list, listType, onTools, onDownload }) {

  return (
    <Flex direction="column">
      <WhiteSpace size="md" />
      {list.length>0?list.map( ls => (
          <ToolsItem key={ls.id} list={ls} listType={listType} onClick={onTools} onDownload={onDownload} />
        )) : <Flex justify="center" align="center">您未收藏任何工具</Flex>
      }
    </Flex>
    
  )
}

export default RecommendLsnGroup;