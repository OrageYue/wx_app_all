import { Flex, WhiteSpace, WingBlank } from "antd-mobile";
import HeaderTitle from '../../components/HeaderTitle';

function DealerLivePage() {
  return (
    <WingBlank style={{height: '100%'}}>
      <Flex style={{height: '100%', width:"100%"}} direction="column" align='center'>
        <WhiteSpace size="lg"/>
        <HeaderTitle />
        <Flex style={{flex:1}} align="center">
          <img src="/expect.png" alt="/expect.png" width="60px" />
        </Flex>
      </Flex>
    </WingBlank>
  )
}

export default DealerLivePage;