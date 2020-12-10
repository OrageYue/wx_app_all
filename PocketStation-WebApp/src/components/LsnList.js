import { Flex , WingBlank, WhiteSpace } from 'antd-mobile';
import { PropTypes } from 'prop-types';

const LsnList = ({ operationList }) => {
  const itemImg = {
    width: '102px',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#edf2ee',
    margin: '6px'
  };
  const imgStyle = {
    width: '100%',
    height: '100%'
  }
  let listArr = [];
  if( operationList.length > 0 ) {
  	operationList.forEach( (item) => {
  		listArr.push( 
  			<div key={item.title} >
  				<div style={itemImg}>
  					<img src={item.imgUri} alt="" style={imgStyle} />
  				</div>
  				<h4>{item.title}</h4>
  			</div>
  		)})
  } else {
  	listArr.push(<div key={0}>无资源</div>)
  }
  return (
    <WingBlank size="lg">
    	<WhiteSpace size="xl" />
    	<Flex wrap="wrap" justify="between" >
        {listArr}
    	</Flex>
    </WingBlank>
  )
}

LsnList.propTypes = {
  operationList: PropTypes.array.isRequired
}

export default LsnList;