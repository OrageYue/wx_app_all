import { List } from 'antd-mobile';
import { PropTypes } from 'prop-types';
const Item = List.Item;
const Brief = Item.Brief;

const topNews = {
  display: 'inlineBlock',
  padding: '0 2px',
  height: '18px',
  lineHeight: '18px',
  textAlign: 'center',
  color: '#27ad77',
  fontSize: '12px',
  border: '1px solid #27ad77',
  marginRight: '10px',
  fontWeight: '300',
}

export default function renderFn({ data, onNewsDetails, type }){

  return (
    data && data.map( item => (
      <Item
        key={item.keyId?item.keyId:item.id}
        arrow="horizontal"
        thumb={item.cover_img}
        multipleLine
        onClick={() => { onNewsDetails({newsId:item.id}) }}
      >
        {item.title} <Brief>{type?<span style={ topNews }>置顶</span>: null}{item.brief}</Brief>
      </Item>
    ))
  )

  
  // return arr;
}
renderFn.propsTypes = {
  data: PropTypes.array,
  onNewsDetails: PropTypes.func,
  partId: PropTypes.string
}