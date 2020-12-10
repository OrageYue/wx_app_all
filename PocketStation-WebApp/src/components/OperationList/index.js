import { Flex , WingBlank, WhiteSpace } from 'antd-mobile';
import OperationItem from './OperationItem';
import NewTitle from '../NewTitle';
import { PropTypes } from 'prop-types';
import CustomIcon from '../CustomIcon';



const OperationList = ({ operationList, onGoLsnPage, onMore }) => {
  
  function renderOprLessons() {

    return operationList && operationList.map( ({id, name, ...other}) => {
      console.log(other)
      let toolsCount = 0;
      other.children.forEach( tt => {
        toolsCount += tt.tools.length;
      })
      
      return (
        <Flex direction="column" style={{width: '100%'}} key={id} >
        <NewTitle 
          title={name} 
          onMore={() => onMore(id)} 
          moreText={other.children.length>0&toolsCount>0?'更多':''} 
          icon_name={other.children.length>0&toolsCount>0?'right': ''} 
        />
        {
          other.children.length === 0?<CustomIcon icon='kong' width='40'/>:<OperationItem onGoLsnPage={onGoLsnPage} {...other} />
        }
      </Flex>
      )
    })
  }

  return (
    <WingBlank size="lg" style={{width: '72%'}}>
    	<WhiteSpace size="xl" />
    	<Flex direction="column" align="start" >
        { renderOprLessons() }
      </Flex> 
    </WingBlank>
  )
}

OperationList.propTypes = {
  operationList: PropTypes.array,
  onGoLsnPage: PropTypes.func
}
export default OperationList;