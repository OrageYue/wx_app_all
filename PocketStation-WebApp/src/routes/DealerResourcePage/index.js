import { connect } from "dva";
import { idUri2titleUri, getItemsInTree, isItemViewable, canItemDownload, isFolder, getResourceUrl } from "../../utils/resource";
import ResourcePanel from "../../components/ResourcePanel";
import { WingBlank, Flex, WhiteSpace } from "antd-mobile";
import { routerRedux } from "dva/router";
import styles from './index.less';

function DealerResourcePage({ name, uri, iduri, tree, resourceGoBack, resource_loading, ...props }) {

  function buildResourceItems() {
    const { viewResource, downloadResource, queryResource } = props;
    const items = getItemsInTree(tree, iduri).map((item) => ({
      id: item.id,
      title: item.name,
      enter: isFolder(item) ? () => queryResource(item.id) : null,
      view: isItemViewable(item) ? () => viewResource(item) : null,
      download: canItemDownload(item) ? () => downloadResource(item) : null,
    }));
    return items;
  }

  return (
    <div style={{height:'100%'}}>
        <Flex className={styles.resource_top} align="start" justify="around" direction="column">
          <h1 className={styles.pageTit}>PocketStation</h1>
          <WingBlank><span className={styles.name}>Hi,&ensp;{name}</span></WingBlank>
        </Flex>
        <WhiteSpace />
        <WingBlank>
          <span className={styles.resource_title}>内部资源</span>
          <Flex style={{height: 'auto', overflow:'auto', marginBottom: '64px'}}>
            <ResourcePanel uri={uri} items={buildResourceItems()} loading={resource_loading} onBack={resourceGoBack} />
          </Flex>
        </WingBlank>
    </div>
  )
}

function mapState2Props({ user, dealer_resource, loading: { effects } }) {
  const { uri, tree } = dealer_resource;
  console.log( tree )
  return {
    name: user.name,
    uri: idUri2titleUri(tree, uri),
    iduri: uri,
    tree: tree,
    resource_loading: effects['dealer_resource/queryNode'],
  }
}

function mapDispatch2Props(dispatch) {
  return {
    resourceGoBack() {
      dispatch({ type: 'dealer_resource/turnBack' })
    },
    queryResource(resId) {
      dispatch({ type: 'dealer_resource/queryNode', payload: resId });
    },
    viewResource(item) {
      // console.log("view item:", item);
      // dispatch(routerRedux.push(`https://pocketstation.cn:8002/${item.content}`));
      // window.location.href = `https://pocketstation.cn/${item.content}`;
      window.open(getResourceUrl(item));
    },
    downloadResource(item) {
      // console.log("download item:", item);
      window.open(getResourceUrl(item));
    },
  };
}

export default connect(mapState2Props, mapDispatch2Props)(DealerResourcePage);