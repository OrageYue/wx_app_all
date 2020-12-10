import { PureComponent } from "react";
import ResourceSerivce from "../../services/resource";
import { Toast, Flex, ActivityIndicator } from "antd-mobile";
import { warn } from "../../utils/log";
import Video from "../../components/Video";
import { getResourceUrl } from "../../utils/resource";
import PDF from "react-pdf-js";

class ResourceViewPage extends PureComponent {
  state = {
    content: '',
    id: '',
    name: '',
    type: '',
    loading: true,
  }
  async componentDidMount() {
    const { resId } = this.props.match.params;
    
    const { data, err } = await ResourceSerivce.queryThisNode(resId);
    if (err) {
      warn(err);
      Toast.fail('获取资源失败，请重试')
    }else{
      this.setState(data);
    }
    this.setState({loading: false});
  }

  renderVideo() {
    return (<Video videoUri={getResourceUrl(this.state)} />)
  }
  renderPdf() {
    return <PDF file={getResourceUrl(this.state)} />
  }
  renderContent() {
    switch(this.state.type) {
      case 'video': return this.renderVideo();
      case 'pdf': return this.renderPdf();
      default: return <span> Resource Not Supported </span>
    }
  }
  render() {
    return (
      <Flex style={{height: '100vh', width: '100vw'}} align='center' justify='center'>
        { this.state.loading ? <ActivityIndicator text='正在加载' toast /> : this.renderContent() }
      </Flex>
    )
  }
}

// not need to connect model.
export default ResourceViewPage;