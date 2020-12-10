import { Flex, WingBlank } from 'antd-mobile';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import styles from './index.less';


class QAListGroup extends Component {
  state = {
    click_id: '',
  }
  isExpanding = id => {
    return id === this.state.click_id;
  };
  handleChange = (id) => {
    this.setState({
      click_id: id,
    })
  }
  close = (id) => {
    this.setState({
      click_id: '',
    })
  }
  render() {
    const { FAQList } = this.props;
    return (
      <WingBlank>
        <Flex className={styles.container} direction="column">
          {FAQList.map( (ft, inx) => (
            <Flex direction="column" key={ft.id} style={{width: '100%'}}>
              <Flex className={styles.answerContainer} direction="column" justify="between">
                <Flex justify="between" style={{width: '100%'}}>
                  <span>{inx+1}.&ensp;{ft.title}</span>
                  {this.isExpanding(ft.id)?(<img src="/go.png" alt="/down.png" width="20px" onClick={() => this.close(ft.id)}/>):
                    (<img src="/go.png" alt="/go.png" width="20px" onClick={() => this.handleChange(ft.id)}/>)
                  }
                </Flex>
                
                {
                  this.isExpanding(ft.id)? null:<img src="/Line.png" alt="/Line.png" height="2px" width="100%"/>
                }
              </Flex>
              <Flex className={this.isExpanding(ft.id)?styles.show:styles.hide}>
                {ft.answer.split('#').map( (answer, inx) => (
                    inx===0?<p style={{margin: '0 0 0 10px'}} key={inx} >{answer}</p>:
                    <p style={{margin: '0 0 0 30px'}} key='0' >{answer}</p>
                  ))
                }
              </Flex>
            </Flex>
            ))
          }
        </Flex>
      </WingBlank>
      
    )
  }
}

QAListGroup.propTypes = {
  FAQList: PropTypes.array,
  onFAQDetails: PropTypes.func
}

export default QAListGroup