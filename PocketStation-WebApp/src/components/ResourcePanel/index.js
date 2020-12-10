import styles from './index.less';
import { List, Icon } from "antd-mobile";
import PropTypes from "prop-types";
import Item from "./item";
import UriBar from "./UriBar";
import CustomIcon from "../CustomIcon";

const panelInnerMinHeight = '200px';
const panelMinHeight = '240px';

function ResourcePanel({ loading, items, uri, onBack }) {

  function renderEmpty() {
    return (
      <div style={{ minHeight: panelInnerMinHeight, lineHeight: panelInnerMinHeight, textAlign: 'center', fontSize: '4rem', color: 'black' }}>
        <CustomIcon icon='kong' />
      </div>
    )
  }

  function renderListItems() {

    const folder_items = items.filter(it=>it.enter).sort((a,b)=>a.title>b.title);
    const file_item = items.filter(it=>!it.enter).sort((a,b)=>a.title>b.title);

    const sorted_items = [...folder_items, ...file_item];

    if (items.length > 0) {
      return sorted_items.map(({ id, enter, view, download, title }) => (<Item key={id} title={title} enter={enter} download={download} view={view} />))
    } else {
      return renderEmpty()
    }
  }

  function renderLoading() {
    return (
      <div style={{ minHeight: panelInnerMinHeight, lineHeight: panelInnerMinHeight, textAlign: 'center'}}>
        <Icon type='loading' size='lg' />
      </div>
    )
  }

  return (
    <List
      style={{ width: '100%', minHeight: panelMinHeight }}
      renderHeader={<UriBar uri={uri} back={onBack} />}
      className={styles.container}
    >
      {loading ? renderLoading() : renderListItems()}
    </List>
  );
}

// PropTypes !
ResourcePanel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    'enter': PropTypes.func,
    'view': PropTypes.func,
    'title': PropTypes.string,
    'download': PropTypes.func,
  })),
  uri: PropTypes.arrayOf(PropTypes.string),
  onBack: PropTypes.func,
  loading: PropTypes.bool,
};

// testing data!
ResourcePanel.defaultProps = {
  items: [
    { id: 1, 'title': 'Folder', enter: () => console.log("enter") },
    { id: 2, 'title': 'File1', view: () => console.log("view") },
    { id: 3, 'title': 'File2', download: () => console.log("download") },
    { id: 4, 'title': 'File3', view: () => console.log("view"), download: () => console.log("download") },
  ],
  uri: ['目录1', '目录2'],
  onBack: () => { },
  onView: () => { },
  onDown: () => { },
  onQuery: () => { },
  loading: false,
}


export default ResourcePanel;
